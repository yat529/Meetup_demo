/* eslint-disable */
import Vue from 'vue'
import * as firebase from 'firebase'
// import Utils from '../../plugins/utils.js'

const Users = {
  state: {
    // local cache user
    user: null, // firebase user obj
    user_ref: null, // ref obj to firebase users database

    notifications: {
      newFriend: [],
      newMember: [],
      newMessage: [],
      newInvitation: []
    },

    friends: [],
    groups: {
      created: [],
      registered: [],
      invited: [],
      pending: [],
      pending_member: []
    },
    todoList: [],
    popupMsg: {},
  },
  getters: {},
  mutations: {
    // local user cache
    signInUser (state, {user, user_ref}) {
      // user is firebase user obj
      state.user = user
      state.user_ref = user_ref
      console.log('user logged in')
    },
    signOutUser (state) {
      state.user = null
      state.user_ref = null
      console.log('user signed out')
    },
    updateUser (state, user_ref) {
      state.user_ref = user_ref
      console.log('user updated')
    },

    setNewFriendNotification (state, list) {
      state.notifications.newFriend = list
    },

    setNewMemberNotification (state, list) {
      state.notifications.newMember = list
    },

    setNewMessageNotification (state, list) {
      state.notifications.newMessage = list
    },

    setNewInvitationNotification (state, list) {
      state.notifications.newInvitation = list
    },

    setUserGroups (state, userGroups) {
      state.groups = userGroups
    },

    setSpecificUserGroups (state, {type, groups}) {

      switch (type) {
        case 'created':
          state.groups.created = Object.assign([], state.groups.created, groups)
          break
        case 'registered':
          state.groups.registered = Object.assign([], state.groups.registered, groups)
          break
        case 'pending':
          state.groups.pending = Object.assign([], state.groups.pending, groups)
          break
        case 'invited':
          state.groups.invited = Object.assign([], state.groups.invited, groups)
          break
        case 'pending_member':
          state.groups.pending_member = Object.assign([], state.groups.pending_member, groups)
          break
      }

    },

    setTodoList (state, list) {
      state.todoList = list
    },

    resetTodoList (state) {
      state.todoList = []
    },

    setPopupMsg (state, message) {
      state.popupMsg = Object.assign({}, state.popupMsg, message)
    },

    clearPopupMsg (state, message) {
      state.popupMsg = {}
    },

  },
  actions: {

    // User todo list
    watchUserTodo (context, group_key) {
      let user = firebase.auth().currentUser,
          uid = user.uid

      firebase.database().ref('users').child(uid + '/todo/' + group_key).on('value', data => {
        let arr = [], 
            list = data.val()
        
        for (let key in list) {
          let item = list[key]
          item.key = key

          arr.push(item)
        }

        context.commit('setTodoList', arr)
      })
    },

    stopWatchUserTodo (context, group_key) {
      let user = firebase.auth().currentUser,
          uid = user.uid

      firebase.database().ref('users').child(uid + '/todo/' + group_key).off('value', () => {
        context.commit('resetTodoList')
        console.log('stop todo list watch')
      })
    },

    toggleUserTodoCheck (context, {type, group_key, todo_key}) {
      let user = firebase.auth().currentUser,
          uid = user.uid,
          bol = type === 'check' ? true : false

      firebase.database().ref('users').child(uid + '/todo/' + group_key + '/' + todo_key + '/complete').set(bol)
    },

    // Create user account
    // Sign up account ONLY happens when user choose to signup with email and password
    // once finish, return new promise with resolved user object
    createUser (context, user) {
      return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(user => resolve(user))
        .catch(error => reject(error))
      })
    },

    // Create user database entry
    // When user choose to signup with email and password, a seperate user data will need to
    // record in the Users database, which provide a uniform user data format with the OAuth
    // users
    createDBUserEntry (context, user_snap) {
      let userDBProfile = {}
      // user.providerData is an array with only one item
      user_snap.providerData.forEach(profile => {
        Object.keys(profile).forEach(key => {
          userDBProfile[key] = user_snap.providerData[0][key]
        })
        // NOTE: overwrite uid property
        // default uid from providerData is the email address, change to user.uid
        userDBProfile.uid = user_snap.uid
      })
      // return a void promise
      return firebase.database().ref('users').child(userDBProfile.uid).set(userDBProfile)
    },

    // Check user database for matching emial address
    // used when user signup, check if email existed
    checkDBUserEmail (context, email) {
      let ref = firebase.database().ref('users')

      return new Promise((resolve, reject) => {
        ref.orderByChild('email').equalTo(email).once('value')
        .then(snapshot => resolve(snapshot.val()))
      })
    },

    // Send Verification Email
    // Once user signed up, but not init profile
    sendEmailVerification (context, user) {
      if (user) {
        return new Promise((resolve, reject) => {
          user.sendEmailVerification()
          .then(() => {
            console.log('verification email sent')
            resolve()
          })
          .catch(error => reject(error))
        })
      }
    },

    sendResetPasswordEmail (context, email) {
      let auth = firebase.auth()
      
      return new Promise((resolve, reject) => {
        auth.sendPasswordResetEmail(email)
        .then(() => resolve())
        .catch(error => reject(error))
      })
    },

    // verify email
    // used to verify user email after signup account
    verifyEmail (context, actionCode) {
      let auth = firebase.auth()

      return new Promise((resolve, reject) => {
        auth.applyActionCode(actionCode)
        .then(() => resolve())
        .catch(error => reject(error))
      })
    },

    // reset password
    // used when user forgot password
    // verify if reset password action code is valid
    verifyPasswordResetCode (context, actionCode) {
      let auth = firebase.auth()

      return new Promise((resolve, reject) => {
        auth.verifyPasswordResetCode(actionCode)
        .then(email => resolve(email))
        .catch(error => reject(error))
      })
    },

    // used once the new password is submitted
    resetPassword (context, {actionCode, newPassword}) {
      let auth = firebase.auth()

      return new Promise((resolve, reject) => {
        auth.confirmPasswordReset(actionCode, newPassword)
        .then(resp => resolve(resp))
        .catch(error => reject(error))
      })
    },

    // re-authenticate user
    // used before update password or email
    reauthenticateUser (context, password) {
      let user = firebase.auth().currentUser

      return new Promise((resolve, reject) => {
        user.reauthenticateWithCredential(password)
        .then(() => resolve())
        .catch(error => reject(error))
      })
    },

    // update user password
    updatePassword (newPassword) {
      let user = firebase.auth().currentUser

      return new Promise((resolve, reject) => {
        user.updatePassword(newPassword)
        .then(() => resolve())
        .catch(error => reject(error))
      })
    },

    // delete user
    deleteUser (context) {
      let user = firebase.auth().currentUser

      return new Promise((resolve, reject) => {
        user.delete()
        .then(() => resolve())
        .catch(error => reject(error))
      })
    },

    // Check User existance
    // This will check if user exists in the user database
    checkDBUserEntry (context, user) {
      let hasUser
      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(user.uid).once('value')
        .then(ref => {
          if (ref.val() !== null) {
            resolve(hasUser = true)
          } else {
            resolve(hasUser = false)
          }
        })
        .catch(error => console.log(error))
      })
    },

    // Signin with Google account
    // This can do either sign up / sign in, for new user, will create the account in firebase
    // Will rediret to google login page, once signin successful, redirect back
    signInWithGoogle (context) {
      let provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    },
    // called on page loads when google signin finishes and redirects back
    onGoogleSigninRedirect (context) {
      return new Promise((resolve, reject) => {
        firebase.auth().getRedirectResult()
        .then(result => {
          // The signed-in user info.
          let user = result.user
          resolve(user)
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
      })
    },

    // Sign in using email and password with firebase
    // authenticated user snapshot is returned by promise
    signInUser (context, user) {
      return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(user => resolve(user))
        .catch(error => reject(error))
      })
    },

    // Signout from firebase
    // local session cache cleared, return a promise
    signOutUser (context) {
      return new Promise((resolve, reject) => {
        context.dispatch('stopNotificationWatch')
        firebase.auth().signOut()
        .then(() => resolve())
        .catch(error => console.log(error))
      })
    },

    // Update user profile
    // Used to update the users database
    // NOTE: user must be logged in
    updateUserProfile (context, profile) {
      if (!context.state.user_ref) console.log('_ref not login')
      let uid = context.state.user_ref.uid
      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(uid).update(profile)
        .then(() => resolve())
        .catch(error => console.log(error))
      })
    },

    // Upload user photot avatar
    // Will upload the photo to storage first, once get back the download url, then update users database with this link
    // the property name must be 'photoURL'
    // NOTE: user must login
    uploadUserAvatar (context) {
      if (!context.state.user_ref) console.log('user not login')
      let uid = context.state.user_ref.uid,
          file = context.rootState.flimage

      return new Promise((resolve, reject) => {
        firebase.storage().ref('users').child(uid).child('avatar').put(file)
        .then(snapshot => {
          let avatarUrl = snapshot.metadata.downloadURLs[0]
          return firebase.database().ref('users').child(uid).update({
            photoURL: avatarUrl
          })
        })
        .then(() => resolve())
        .catch(error => console.log(error))
      })
    },

    // Fetch specific user database entry
    // Return a promise with a user db snapshot
    fetchUser (context, uid) {
      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(uid).once('value')
        // export the value of the snapshot
        .then(user_snap => resolve(user_snap.val()))
        .catch(error => console.log(error))
      })
    },

    // sync current user - 用
    watchUser (context, user) {
      let user_ref,
          user_auth = user
        

      firebase.database().ref('users').child(user_auth.uid).on('value', snapshot => {
        
        user_ref = snapshot.val()
        console.log(user_ref)
        user_ref.emailVerified = user_auth.emailVerified
        user_ref.metadata = user_auth.metadata

        context.commit('signInUser', {user: user_auth, user_ref: user_ref})

      })
    },

    // stop sync - 用
    // call when user sign out
    stopUserWatch (context, user) {
      firebase.database().ref('users').child(user.uid).off('value')
    },

    // User status watcher
    // used in app created hook
    initUserWatch (context) {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          context.dispatch('watchUser', user)
          // context.dispatch('watchNotification', user)
        } else {
          context.commit('signOutUser')
        }
      })
    },




    /* 
     *-------- Load User Groups --------
    */

    // fetch user created groups - 用
    // NOTE: if no created_groups in firebase, the groups.created will be []
    fetchCreatedGroups (context) {
      let groupKeys,
          user = firebase.auth().currentUser,
          uid = user.uid,
          promiseArr = []

      firebase.database().ref('users').child(uid).child('created_groups').once('value')
      .then(snapshot => {
        groupKeys = snapshot.val()

        for (let key in groupKeys) {
          promiseArr.push( context.dispatch('fetchGroup', key) )
        }

        Promise.all(promiseArr).then(results => {
          // sync groups to store
          context.commit('setSpecificUserGroups', { type: 'created', groups: results })
        })
      })

    },

    // fetch user registered groups - 用
    // NOTE: if no registered_groups in firebase, the groups.registered will be []
    fetchRegisteredGroups (context) {
      let groupKeys,
          user = firebase.auth().currentUser,
          uid = user.uid,
          promiseArr = []

      firebase.database().ref('users').child(uid).child('registered_groups').once('value')
      .then(snapshot => {
        groupKeys = snapshot.val()

        for (let key in groupKeys) {
          promiseArr.push( context.dispatch('fetchGroup', key) )
        }

        Promise.all(promiseArr).then(results => {
          // sync groups to store
          context.commit('setSpecificUserGroups', { type: 'registered', groups: results })
        })
      })

    },

    // fetch user pending groups - 用
    // NOTE: if no pending_groups in firebase, the groups.pending will be []
    fetchPendingGroups (context) {
      let groupKeys,
          user = firebase.auth().currentUser,
          uid = user.uid,
          promiseArr = []

      firebase.database().ref('users').child(uid).child('pending_groups').once('value')
      .then(snapshot => {
        groupKeys = snapshot.val()

        for (let key in groupKeys) {
          promiseArr.push( context.dispatch('fetchGroup', key) )
        }

        Promise.all(promiseArr).then(results => {
          // sync groups to store
          context.commit('setSpecificUserGroups', { type: 'pending', groups: results })
        })
      })

    },

    // fetch user invited groups - 用
    // NOTE: if no invited_groups in firebase, the groups.invited will be []
    fetchInvitedGroups (context) {
      let groupKeys,
          user = firebase.auth().currentUser,
          uid = user.uid,
          promiseArr = []

      firebase.database().ref('users').child(uid).child('invited_groups').once('value')
      .then(snapshot => {
        groupKeys = snapshot.val()

        for (let key in groupKeys) {
          promiseArr.push( context.dispatch('fetchGroup', key) )
        }

        Promise.all(promiseArr).then(results => {
          // sync groups to store
          context.commit('setSpecificUserGroups', { type: 'invited', groups: results })
        })
      })

    },
    
    // // Fetch user related meetups once when sign in
    // // - check meetup uid for created meetup
    // // - check meetup subscribers for registered meetup
    // fetchUserGroups (context, user) {
    //   let userGroups = {
    //         created: [],
    //         registered: [],
    //         pending: [],
    //         invited: []
    //       }

    //   if (!user) {
    //     user = firebase.auth().currentUser
    //   }

    //   console.log('fetching groups for curr_user')

    //   return new Promise((resolve, reject) => {
    //     firebase.database().ref('groups').once('value')
    //     .then(snapshots => {
    //       snapshots.forEach(snapshot => {
    //         let group = snapshot.val()
    //         group.key = snapshot.key

    //         // fetch created groups
    //         if (user.uid === group.uid) {
    //           userGroups.created.push(group)
    //         }

    //         // fetch registed groups
    //         if (group.registeredMembers) {
    //           let registered = Object.keys(group.registeredMembers).find(key => {
    //             return key === user.uid
    //           })
    //           if (registered) {
    //             userGroups.registered.push(group)
    //           }
    //         }

    //         // fetch pending groups
    //         if (group.pendingMembers) {
    //           let pending = Object.keys(group.pendingMembers).find(key => {
    //             return key === user.uid
    //           })
    //           if (pending) {
    //             userGroups.pending.push(group)
    //           }
    //         }

    //         // fetch invited groups
    //         if (group.pendingInvitedMembers) {
    //           let pendindInv = Object.keys(group.pendingInvitedMembers).find(key => {
    //             return key === user.uid
    //           })

    //           if (pendindInv) {
    //             userGroups.invited.push(group)
    //           }
    //         }
    //       })
    //       console.log(userGroups)
    //       resolve(userGroups)
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    //   })
    // },



    // Fetch user groups with pending member - 用
    // For fast database query, follow this routine
    // notification -> uid -> new_member -> group_key -> fetch group -> pending_member
    fetchUserGroupsWithPendingMember (context) {
      let user = firebase.auth().currentUser,
          uid = user.uid,
          db_ref = `notifications/${uid}/new_member/`,
          groupKeys,
          promiseArr = []

      return new Promise ((resolve, reject) => {

        firebase.database().ref(db_ref).once('value')
        .then(snapshot => {
          groupKeys = snapshot.val()

          for (let key in groupKeys) {
            promiseArr.push( context.dispatch('fetchGroup', key) )
          }

          Promise.all(promiseArr).then(groups => {
            console.log(groups)
            context.commit('setSpecificUserGroups', { type: 'pending_member', groups: groups })
            resolve(groups)
          })
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })

      })
    },

    // Fetch user groups of invitation - 用
    // For fast database query, follow this routine
    // notification -> uid -> new_invitation -> group_key -> fetch group
    fetchUserGroupsOfNewInvitation (context) {
      let user = firebase.auth().currentUser,
          uid = user.uid,
          db_ref = `notifications/${uid}/new_invitation/`,
          groupKeys,
          promiseArr = []

      return new Promise ((resolve, reject) => {

        firebase.database().ref(db_ref).once('value')
        .then(snapshot => {
          groupKeys = snapshot.val()

          for (let key in groupKeys) {
            promiseArr.push( context.dispatch('fetchGroup', key) )
          }

          Promise.all(promiseArr).then(groups => {
            console.log(groups)
            context.commit('setSpecificUserGroups', { type: 'invited', groups: groups })
            resolve(groups)
          })
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })

      })
    },



    /* 
     * --------- User Notifications ------------
     */

    // Watch for User notification
    watchNotification (context, user) {
      
      if (!user) {
        user = firebase.auth().currentUser
      }

      firebase.database().ref('notifications/new_friend').child(user.uid).on('value', snapshot => {
        let notifications = snapshot.val(),
            array = []
        
        if (!notifications) {
          Vue.delete(context.state.notifications.newFriend, 0)
        } else {
          context.commit('setPopupMsg', {
            type: 'warning',
            title: '你有新的通知',
            content: '请前往账户信息的消息中心查看'
          })
        }

        for (let key in notifications) {
          array.push(notifications[key])
        }

        context.commit('setNewFriendNotification', array)
      })

      firebase.database().ref('notifications/new_member').child(user.uid).on('value', function(snapshot) {
        let notifications = snapshot.val(),
            array = []

        if (!notifications) {
          Vue.delete(context.state.notifications.newMember, 0)
        } else {
          context.commit('setPopupMsg', {
            type: 'warning',
            title: '你有新的通知',
            content: '请前往账户信息的消息中心查看'
          })
        }

        for (let meetup_key in notifications) {
          let obj = {
                key: meetup_key,
                newMember: []
              }

          for (let key in notifications[meetup_key]) {
            obj.newMember.push(notifications[meetup_key][key])
          }
          array.push(obj)
        }

        context.commit('setNewMemberNotification', array)
      })

      firebase.database().ref('notifications/new_message').child(user.uid).on('value', snapshot => {
        let messages = snapshot.val(),
            array = []

        if (!messages) {
          Vue.delete(context.state.notifications.newMessage, 0)
        } else {
          context.commit('setPopupMsg', {
            type: 'warning',
            title: '你有新的通知',
            content: '请前往账户信息的消息中心查看'
          })
        }

        for (let key in messages) {
          messages[key].key = key
          array.push(messages[key])
        } 

        context.commit('setNewMessageNotification', array)
      })

      firebase.database().ref('notifications/new_invitation').child(user.uid).on('value', snapshot => {
        let meetups = snapshot.val(),
            array = []

        if (!meetups) {
          Vue.delete(context.state.notifications.newInvitation, 0)
        }

        for (let key in meetups) {
          array.push(key)
        }

        context.commit('setNewInvitationNotification', array)
      })
    },

    // stop listen to notification change
    // used when sign out
    stopNotificationWatch (context) {
      let user = context.state.user_ref || firebase.auth().currentUser

      firebase.database().ref('notifications/new_friend').child(user.uid).off('value')
      firebase.database().ref('notifications/new_member').child(user.uid).off('value')
      firebase.database().ref('notifications/new_message').child(user.uid).off('value')
      firebase.database().ref('notifications/new_invitation').child(user.uid).off('value')
    },

    /* 
      Add user as friend
      ------------------
      Procedure:
      Step 1: Sender sends friend request, a new_friend notification generated
      Step 2: Notify person(receiver) receive the new_friend notification
      Step 3: Receiver decide either to accept or reject the request
      Step 4: Remove this new_friend notification
    */

    // Send request to add as friend
    // a pendingFriend node will be created under sender's user node, will be removed user receiver process the request
    sendFriendRequest (context, target_uid) {
      let sender = context.state.user_ref

      if (!sender) {
        sender = firebase.auth().currentUser
      }

      firebase.database().ref('notifications/new_friend').child(target_uid).push({
        uid: sender.uid,
        nickname: sender.nickname,
        photoURL: sender.photoURL
      })
      .then(() => {
        return firebase.database().ref('users').child(sender.uid).child('pendingFriends').child(target_uid).set(true)
      })
      .then(() => {
        context.commit('setPopupMsg', {
          type: 'success',
          title: '已发送好友请求',
          content: '等待对方确认后, 你们就可以一起愉快的玩耍啦!'
        })
      })
      .catch(error => {
        context.commit('setPopupMsg', {
          type: 'error',
          title: '好友请求失败',
          content: error
        })
        console.log(error)
      })
    },

    // Receiver confirm the request
    // Step 1: add the sender to friends node under receiver's user node
    // Step 2: remove the request notification
    // Step 3: send back a notification message back to the sender, inform the approval
    confirmFriendRequest (context, target_user) {
      // need a format for the message
      let target_uid = target_user.uid,
          type = 'new_friend',
          status = 'approved'

      context.dispatch('addFriend', target_user)
      context.dispatch('removeFriendRequest', target_uid)
      context.dispatch('sendNotificationMessage', {target_uid, type, status})
    },

    // Receiver decline the request
    // Step 1: remove the request notification
    // Step 2: send back a notification message back to the sender, inform the rejection
    rejectFriendRequest (context, target_user) {
      let target_uid = target_user.uid,
          type = 'new_friend',
          status = 'rejected'

      context.dispatch('removeFriendRequest', target_uid)
      context.dispatch('sendNotificationMessage', {target_uid, type, status})
    },

    // Remove the friend request
    // Once the receiver process the request, remove this notification from db
    removeFriendRequest (context, target_uid) {
      let receiver = context.state.user_ref

      if (!receiver) {
        receiver = firebase.auth().currentUser
      }

      firebase.database().ref('notifications/new_friend').child(receiver.uid).once('value')
      .then(snapshot => {
        let notifications = snapshot.val()

        for (let key in notifications) {
          if (notifications[key].uid === target_uid) {
            firebase.database().ref('notifications/new_friend').child(receiver.uid).child(key).remove()
          }
        }
      })
    },

    // Send request to join meetup
    sendJoinRequest (context, meetup) {
      let sender = context.state.user_ref
      firebase.database().ref('notifications/new_member').child(meetup.uid).child(meetup.key).push({
        uid: sender.uid,
        nickname: sender.nickname,
        photoURL: sender.photoURL
      })
      .then(() => {
        return firebase.database().ref('users').child(sender.uid).child('pendingMeetups').child(meetup.key).set(true)
      })
      .then(() => {
        return firebase.database().ref('meetups').child(meetup.key).child('pendingMembers').child(sender.uid).set(true)
      })
      .then(() => {
        context.commit('setPopupMsg', {
          type: 'success',
          title: '已发小组请求',
          content: '等待对方确认后, 你们就可以一起愉快的玩耍啦!'
        })
      })
      .catch(error => {
        context.commit('setPopupMsg', {
          type: 'error',
          title: '请求发送失败',
          content: '请稍后再试'
        })
        console.log(error)
      })
    },

    confirmMemberRequest (context, {meetup_key, target_user}) {
      let target_uid = target_user.uid,
          type = 'new_member',
          status = 'approved'

      // add member to meetup registeredMember
      console.log('confirmed member request')
      context.dispatch('registerMeetup', {meetup_key, target_user})
      // send a message to requester
      context.dispatch('sendNotificationMessage', {target_uid, type, status})
      // remove meetup from requester pendingMeetup
      context.dispatch('removePendingMember', {target_uid, meetup_key})
      // remove notification
      context.dispatch('removeMemberRequest', {target_uid, meetup_key})
    },

    rejectMemberRequest (context, {meetup_key, target_user}) {
      let target_uid = target_user.uid,
          type = 'new_member',
          status = 'rejected'

      context.dispatch('sendNotificationMessage', {target_uid, type, status})
      // remove meetup from requester pendingMeetup
      context.dispatch('removePendingMember', {target_uid, meetup_key})
      // remove notification
      context.dispatch('removeMemberRequest', {target_uid, meetup_key})
    },

    removeMemberRequest (context, {target_uid, meetup_key}) {
      let currUser = context.state.user_ref
          
      firebase.database().ref('notifications/new_member').child(currUser.uid).child(meetup_key).once('value')
      .then(snapshot => {
        let notifications = snapshot.val()

        for (let key in notifications) {
          if (notifications[key].uid === target_uid) {
            console.log('here')
            firebase.database().ref('notifications/new_member').child(currUser.uid).child(meetup_key).child(key).remove()
          }
        }
      })
      .catch(error => console.log(error))
    },

    removePendingMember (context, {target_uid, meetup_key}) {
      firebase.database().ref('users').child(target_uid).child('pendingMeetups').child(meetup_key).remove()
      .then(() => {
        firebase.database().ref('meetups').child(meetup_key).child('pendingMembers').child(target_uid).remove()
      })
      .catch(error => console.log(error))
    },



    // send invitation to selected friend when creating meetup
    // crete new_invitation in notifications db
    // create pendingInvitedMembers in meetups db
    // create pendingInvitedMeetups in target_user db
    sendGroupInvitation (context, {target_user, meetup_key}) {
      let target_uid = target_user.uid
      firebase.database().ref('notifications/new_invitation').child(target_uid).child(meetup_key).set(true)
      .then(() => {
        return firebase.database().ref('meetups').child(meetup_key).child('pendingInvitedMembers').child(target_uid).push(target_user)
      })
      .then(() => {
        return firebase.database().ref('users').child(target_uid).child('pendingInvitedMeetups').child(meetup_key).set(true)
      })
    },

    // confirm group invitation
    confirmGroupInvitation (context, {target_user, meetup_key}) {
      // target_user is the created of that meetup
      let target_uid = target_user.uid,
          type = 'new_invitation',
          status = 'approved'

      let currUser = context.state.user_ref || firebase.auth().currentUser,
          curr_uid = currUser.uid

      context.dispatch('registerMeetup', {meetup_key: meetup_key, target_user: currUser})
      // send a message to requester
      context.dispatch('sendNotificationMessage', {target_uid, type, status})
      // remove meetup from requester pendingMeetup
      context.dispatch('removeFromPendingInvitedMember', {curr_uid, meetup_key})
      // remove notification
      context.dispatch('removeGroupInvitationRequest', {curr_uid, meetup_key})
    },

    // reject group invitation
    rejectGroupInvitation (context, {target_user, meetup_key}) {
      let target_uid = target_user.uid,
          type = 'new_invitation',
          status = 'rejected'

      let currUser = context.state.user_ref || firebase.auth().currentUser,
          curr_uid = currUser.uid

      // send a message to requester
      context.dispatch('sendNotificationMessage', {target_uid, type, status})
      // remove meetup from requester pendingMeetup
      context.dispatch('removeFromPendingInvitedMember', {curr_uid, meetup_key})
      // remove notification
      context.dispatch('removeGroupInvitationRequest', {curr_uid, meetup_key})
    },
    
    // remove pending invitation from 
    // -- pendingInvitedMembers in meetups db
    // -- pendingInvitedMeetups in target_user db
    // from curr_user !!
    removeFromPendingInvitedMember (context, {curr_uid, meetup_key}) {
      firebase.database().ref('users').child(curr_uid).child('pendingInvitedMeetups').child(meetup_key).remove()
      .then(() => {
        firebase.database().ref('meetups').child(meetup_key).child('pendingInvitedMembers').child(curr_uid).remove()
      })
      .catch(error => console.log(error))
    },

    // remove notification message from curr_user
    removeGroupInvitationRequest (context, {curr_uid, meetup_key}) {          
      firebase.database().ref('notifications/new_invitation').child(curr_uid).child(meetup_key).remove()
      .catch(error => console.log(error))
    },



    // add friend
    // request receiver(currUser) add sender(target) as friend
    // then add currUser to sender's friend list
    // then delete currUser from sender's pendingFriend list
    addFriend (context, target) {
      let friend = {
            uid: target.uid,
            nickname: target.nickname,
            photoURL: target.photoURL,
            sex: target.sex
          },
          currUser = context.state.user_ref,
          me = {
            uid: currUser.uid,
            nickname: currUser.nickname,
            photoURL: currUser.photoURL,
            sex: currUser.sex
          }

      firebase.database().ref('users').child(currUser.uid).child('friends').child(target.uid).set(friend)
      .then(() => {
        return firebase.database().ref('users').child(target.uid).child('friends').child(currUser.uid).set(me)
      })
      .then(() => {
        firebase.database().ref('users').child(target.uid).child('pendingFriends').child(currUser.uid).remove()
      })
      .catch(error => console.log(error))
    },

    fetchFriends (context, user) {

      if (!user) {
        user = firebase.auth().currentUser
      }

      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(user.uid).child('friends').once('value')
        .then(friends_snap => {
          let friends = [],
              friendList = friends_snap.val()

          for (let key in friendList) {
            friends.push(friendList[key])
          }

          resolve(friends)
        })
        .catch(error => console.log(error))
      })
    },

    // delete current user friend
    removeFriend (context, target_uid) {
      let curr_uid = context.state.user_ref.uid,
          type = 'delete_friend',
          status = 'deleted'

      if (!curr_uid) {
        context.commit('setPopupMsg', {
          type: 'error',
          title: '删除好友失败',
          content: '请重新登录'
        })
        return
      }

      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(curr_uid).child('friends').child(target_uid).remove()
        .then(() => {
          // show popupMsg
          context.commit('setPopupMsg', {
            type: 'success',
            title: '已删除好友',
            content: '此用户将从你的好友名单里去除'
          })
          return firebase.database().ref('users').child(target_uid).child('friends').child(curr_uid).remove()
        })
        .then(() => {
          // send notification to target_uid
          return context.dispatch('sendNotificationMessage', {target_uid, type, status})
        })
        .then(() => resolve())
      })
    },

    // watch Friend list
    watchFriendList (context, user) {

      if (!user) {
        user = firebase.auth().currentUser
      }

      firebase.database().ref('users').child(user.uid).child('friends').on('value', friends_snap => {
        let friends = [],
            friendList = friends_snap.val()

        if (!friendList && context.state.friends.length) {
          Vue.delete(context.state.friends, 0)
        }

        for (let key in friendList) {
          friends.push(friendList[key])
        }
        context.state.friends = friends
      })
    }

  }
}

export default Users