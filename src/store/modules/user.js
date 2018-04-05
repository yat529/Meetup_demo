/* eslint-disable */
import Vue from 'vue'
import * as firebase from 'firebase'

const Users = {
  state: {
    // local cache user
    user: null, // firebase user obj
    user_ref: null, // ref obj to firebase users database
    // user_basic: null, // basic info catch
    notifications: {
      newFriend: [],
      newMember: {},
      newMessage: []
    },

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

    // setUserNotification (state, {notification, type}) {
    //   let userNotifications = state.notifications

    //   // // check for duplicated notification
    //   // for (let key in userNotifications) {
    //   //   let exist = userNotifications[key].find(item => {
    //   //     return item.from.uid === notification.from.uid
    //   //   })
    //   //   if (exist) {
    //   //     console.log('notification already exits')
    //   //     return
    //   //   }
    //   // }

    //   switch (type) {
    //     case 'NEW_FRIEND':
    //       userNotifications.newFriend.push(notification)
    //       break
    //     case 'NEW_MEMBER':
    //       userNotifications.newMember.push(notification)
    //       break
    //     case 'NEW_MESSAGE':
    //       userNotifications.newMessage.push(notification)
    //       break
    //   }
    // },

    // resetUserNotification (state, type) {
    //   switch (type) {
    //     case 'NEW_FRIEND':
    //       state.notifications.newFriend = []
    //       break
    //     case 'NEW_MEMBER':
    //       state.notifications.newMember = []
    //       break
    //     case 'NEW_MESSAGE':
    //       state.notifications.newMessage = []
    //       break
    //   }
    // }
  },
  actions: {
    // Create user account
    // Sign up account ONLY happens when user choose to signup with email and password
    // once finish, return new promise with resolved user object
    createUser (context, user) {
      return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(user => resolve(user))
        .catch(error => {
          console.log(error)
        })
      })
    },

    // Create user database entry
    // When user choose to signup with email and password, a seperate user data will need to
    // record in the Users database, which provide a uniform user data format with the OAuth
    // users
    createDBUserEntry (context, user) {
      let userDBProfile = {}
      // user.providerData is an array with only one item
      user.providerData.forEach(profile => {
        Object.keys(profile).forEach(key => {
          userDBProfile[key] = user.providerData[0][key]
        })
        // NOTE: overwrite uid property
        // default uid from providerData is the email address, change to user.uid
        userDBProfile.uid = user.uid
      })
      // return a void promise
      return firebase.database().ref('users').child(userDBProfile.uid).set(userDBProfile)
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
        .catch(error => console.log(error))
      })
    },

    // Signout from firebase
    // local session cache cleared, return a promise
    signOutUser (context) {
      return new Promise((resolve, reject) => {
        firebase.auth().signOut()
        .then(() => resolve())
        .catch(error => console.log(error))
      })
    },

    // Update user profile
    // Used to update the users database
    // NOTE: user must be logged in
    updateUserProfile (context, profile) {
      if (!context.state.user) console.log('user not login')
      let uid = context.state.user.uid
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
      if (!context.state.user) console.log('user not login')
      let uid = context.state.user.uid,
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

    // Fetch the user database entry
    // Return a promise with a user db snapshot
    fetchUser (context, user) {
      let uid = user.uid
      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(uid).once('value')
        // export the value of the snapshot
        .then(user_snap => resolve(user_snap.val()))
        .catch(error => console.log(error))
      })
    },

    // User status watcher
    // used in app created hook
    watchUser (context) {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          context.dispatch('fetchUser', user)
          .then(user_ref => {
            context.commit('signInUser', {user, user_ref})
            context.dispatch('watchNotification', user_ref.uid)
          })
        } else {
          context.commit('signOutUser')
        }
      })
    },


    // Watch for User notification
    watchNotification (context, uid) {
      firebase.database().ref('notifications/new_friend').child(uid).on('value', snapshot => {
        let notifications = snapshot.val(),
            array = []

        if (!notifications) {
          Vue.delete(context.state.notifications.newFriend, 0)
        }

        for (let key in notifications) {
          array.push(notifications[key])
        }

        context.state.notifications.newFriend = array
      })

      firebase.database().ref('notifications/new_member').child(uid).on('value', snapshot => {
        let notifications = snapshot.val(),
            user_notifications = context.state.notifications.newMember

        if (!notifications) {
          for (let key in user_notifications) {
            Vue.delete(user_notifications, key)
          }
        }

        console.log('new_member', notifications)

        for (let meetup_key in notifications) {
          let arr = []
          for (let key in notifications[meetup_key]) {
            arr.push(notifications[meetup_key][key])
          }
          Vue.set(user_notifications, meetup_key, arr)
        }
      })
    },

    // Fetch notification
    fetchNotifications (context, uid) {
      return new Promise((resolve, reject) => {
        firebase.database().ref('notifications').child(uid).once('value')
        .then(snapshot => resolve(snapshot.val()))
        .catch(error => console.log(error))
      })
    },


    // Send request to add as friend
    sendFriendRequest (context, target_uid) {
      let sender = context.state.user_ref
      return firebase.database().ref('notifications/new_friend').child(target_uid).push({
        uid: sender.uid,
        nickname: sender.nickname,
        photoURL: sender.photoURL
      })
    },

    // Send request to join meetup
    sendJoinRequest (context, meetup) {
      let sender = context.state.user_ref
      return firebase.database().ref('notifications/new_member').child(meetup.uid).child(meetup.key).push({
        uid: sender.uid,
        nickname: sender.nickname,
        photoURL: sender.photoURL
      })
    },

    // // Send message to other user
    // sendNewMessage (context, target_uid) {
    //   let sender = context.state.user_ref
    //   return firebase.database().ref('notifications').child(target_uid).push({
    //     type: 'NEW_MESSAGE',
    //     from: {
    //       uid: sender.uid,
    //       nickname: sender.nickname,
    //       photoURL: sender.photoURL
    //     },
    //     content: ''
    //   })
    // },


    confirmFriendRequest (context, target_uid) {
      let currUser = context.state.user_ref
      // add to firend list
      // remove notification
      context.dispatch('removeFriendRequest', target_uid)
    },

    removeFriendRequest (context, target_uid) {
      let currUser = context.state.user_ref
      // remove notification
      firebase.database().ref('notifications/new_friend').child(currUser.uid).once('value')
      .then(snapshot => {
        let notifications = snapshot.val()

        for (let key in notifications) {
          if (notifications[key].uid === target_uid) {
            firebase.database().ref('notifications').child(currUser.uid).child(key).remove()
          }
        }
      })
    },

    confirmMemberRequest (context, {target_uid, meetup_key}) {
      // add member to meetup registeredMember
      
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

  }
}

export default Users