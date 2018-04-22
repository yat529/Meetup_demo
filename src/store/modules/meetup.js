/* eslint-disable */
import Vue from 'vue'
import * as firebase from 'firebase'

const meetup = {
  state: {
    type: ['public', 'personal', 'private'],
    typeCN: ['公开', '半公开', '私人'],
    category: [
      '美食', '运动', '学习', '聊天', '摄影', '游戏', '旅游', '休闲活动'
    ],
    tag: [

    ],
    loadedMeetup: {},
    
  },
  getters: {},
  mutations: {
    setLoadedMeetup (state, meetup) {
      state.loadedMeetup = meetup
    },
    resetLoadedMeetup (state, meetup) {
      state.loadedMeetup = {}
    }
  },
  actions: {

    /* 
      load Meetups for meetups page
    */
    // load meetups from firebase, return a promise
    fetchMeetups (context) {
      let meetups = []
      return new Promise((resolve, reject) => {
        firebase.database().ref('meetups').once('value')
        .then(snapshots => {
          snapshots.forEach(snapshot => {
            let meetup = snapshot.val()
            meetup.key = snapshot.key
            meetups.push(meetup)
          })
          resolve(meetups)
        })
        .catch(error => {
          console.log(error)
        })
      })
    },

    /* 
      Load Meetups for user profile page
    */
    
    // Fetch user related meetups once when sign in
    // - check meetup uid for created meetup
    // - check meetup subscribers for registered meetup
    fetchUserMeetups (context, user) {
      let userMeetups = {
            created: [],
            registered: [],
            pending: [],
            invited: []
          }

      if (!user) {
        user = firebase.auth().currentUser
      }

      console.log('fetching meetups for curr_user')

      return new Promise((resolve, reject) => {
        firebase.database().ref('meetups').once('value')
        .then(snapshots => {
          snapshots.forEach(snapshot => {
            let meetup = snapshot.val()
            meetup.key = snapshot.key

            // fetch created meetups
            if (user.uid === meetup.uid) {
              userMeetups.created.push(meetup)
            }

            // fetch registed meetups
            if (meetup.registeredMembers) {
              let registered = Object.keys(meetup.registeredMembers).find(key => {
                return key === user.uid
              })
              if (registered) {
                userMeetups.registered.push(meetup)
              }
            }

            // fetch pending meetups
            if (meetup.pendingMembers) {
              let pending = Object.keys(meetup.pendingMembers).find(key => {
                return key === user.uid
              })
              if (pending) {
                userMeetups.pending.push(meetup)
              }
            }

            // fetch invited meetups
            if (meetup.pendingInvitedMembers) {
              let pendindInv = Object.keys(meetup.pendingInvitedMembers).find(key => {
                return key === user.uid
              })

              if (pendindInv) {
                userMeetups.invited.push(meetup)
              }
            }
          })
          console.log(userMeetups)
          resolve(userMeetups)
        })
        .catch(error => {
          console.log(error)
        })
      })
    },

    // Watch created meetup
    // - 
    // watchUserCreatedMeetup (context) {
    //   let curr_user = context.rootState.userModule.user_ref || firebase.auth().currentUser,
    //       curr_uid = curr_user.uid

    //   firebase.database().ref('users').child(curr_uid).child('createdMeetups')
    // },



    // Create meetup
    createMeetup (context, meetup) {
      let key, file, fileExt, imageURL

      return new Promise((resolve, reject) => {
        // context.commit('setLoading', true)
        firebase.database().ref('meetups').push(meetup)
        .then(ref => {
          key = ref.key
          file = context.rootState.flimage
          imageURL = context.rootState.flimageTempUrl || ''

          // check for uploaded file
          if (file) {
            let filename = file.name
            // fileExt = filename.slice(filename.lastIndexOf('.'))
            // upload the file
            firebase.storage().ref('meetups/' + key + '/images').child(filename).put(file)
            .then(snapshot => {
              // get the image url in firebase storage
              imageURL = snapshot.metadata.downloadURLs[0]
              return firebase.database().ref('meetups/' + key).child('imageURLs').push(imageURL)
            })
          } 
          // if online image urls
          else if (!file && imageURL) {
            return firebase.database().ref('meetups/' + key).child('imageURLs').push(imageURL)
          }
        })
        .then(() => {
          return firebase.database().ref('users').child(meetup.uid).child('createdMeetups').child(key).set(true)
        })
        .then(() => {
          context.commit('setPopupMsg', {
            type: 'success',
            title: '小组创建成功',
            content: '你可以在账户信息页面中我发起的小组里查看'
          })
          resolve(key)
        })
        .catch(error => {
          context.commit('setPopupMsg', {
            type: 'error',
            title: '小组创建失败',
            content: error
          })
          console.log(error)
        })
      })
    },

    registerMeetup (context, {meetup_key, target_user}) {
      let userObj = {
        uid: target_user.uid,
        nickname: target_user.nickname,
        photoURL: target_user.photoURL,
        sex: target_user.sex
      }

      return new Promise((resolve, reject) => {
        firebase.database().ref('meetups').child(meetup_key).child('registeredMembers').child(target_user.uid).set(userObj)
        .then(() => {
          return firebase.database().ref('users').child(target_user.uid).child('registeredMeetups').child(meetup_key).set(true)
        })
        .then(() => {
          resolve()
        })
        .catch(error => {
          console.log(error)
        })
      })
    },

    unregisterMeetup (context, meetup) {
      let uid = context.rootState.userModule.user.uid,
          key = meetup.key

      return new Promise((resolve, reject) => {
        firebase.database().ref('meetups').child(key).child('registeredMembers').child(uid).remove()
        .then(() => {
          return firebase.database().ref('users').child(uid).child('registeredMeetups').child(key).remove()
        })
        .then(() => resolve())
        .catch(error => console.log(error))
      })
    },

    unregisterMember (context, {target_uid, meetup_key}) {
      // let uid = context.rootState.userModule.user.uid
      let type = 'delete_member',
          status = null

      return new Promise((resolve, reject) => {
        firebase.database().ref('meetups').child(meetup_key).child('registeredMembers').child(target_uid).remove()
        .then(() => {
          // show popupMsg
          context.commit('setPopupMsg', {
            type: 'success',
            title: '已移除成员',
            content: '此用户将从这个小组的人员名单里去除'
          })
          return firebase.database().ref('users').child(target_uid).child('registeredMeetups').child(meetup_key).remove()
        })
        .then(() => {
          // send notification to target_uid
          context.dispatch('sendNotificationMessage', {target_uid, type, status})
          resolve()
        })
        .catch(error => {
          context.commit('setPopupMsg', {
            type: 'error',
            title: '移除成员失败',
            content: error
          })
          console.log(error)
        })
      })
    },

    /* 
      Load Single Meetup Information
    */

    // Fetch single meetup
    fetchMeetup (context, meetup_key) {
      return new Promise((resolve, reject) => {
        firebase.database().ref('meetups').child(meetup_key).once('value')
        .then(snapshot => resolve(snapshot.val()))
        .catch(error => console.log(error))
      })
    },

    // Watch loaded meetup
    watchMeetup (context, meetup_key) {
      firebase.database().ref('meetups').child(meetup_key).on('value', data => {
        let loadedMeetup = data.val()
        loadedMeetup.key = data.key
        context.commit('setLoadedMeetup', loadedMeetup)
      })
    },

    // Stop watching meetup
    stopWatchMeetup (context, meetup_key) {
      firebase,database().ref('meetups').child(meetup_key).off('value', () => {
        console.log('stop watching meetup')
        context.commit('resetLoadedMeetup')
      })
    },


    /* 
      Update Meetup from Individual Components
    */

    // update date and time
    updateMeetupDateTime (context, {meetup_key, date, time}) {
      return firebase.database().ref('meetups').child(meetup_key).update({
        date: date,
        time: time
      })
      .catch(error => console.log(error))
    },
    // update location object
    updateMeetupAddress (context, {meetup_key, location}) {
      return firebase.database().ref('meetups').child(meetup_key).update({
        location: location
      })
      .catch(error => console.log(error))
    },
    // update title
    updateMeetupTitle (context, {meetup_key, title}) {
      return firebase.database().ref('meetups').child(meetup_key).update({
        title: title
      })
      .catch(error => console.log(error))
    },
    // update content
    updateMeetupContent (context, {meetup_key, description}) {
      return firebase.database().ref('meetups').child(meetup_key).update({
        description: description
      })
      .catch(error => console.log(error))
    },


    /* 
      Delete meetup
      NOTE: Four locations to delete
            1. Delete the meetup key from each registeredMember's registeredMeetups
            2. Delete the meetup key from organizer's createdMeetups
            3. Delete the meetup from meetups db
            4. Delete meetup image from storage
    */
    deleteMeetup (context, meetup_key) {
      let curr_user = context.rootState.userModule.user_ref || firebase.auth().currentUser

      return new Promise((resolve, reject) => {
        // delete from registeredMember's registeredMeetups
        firebase.database().ref('meetups').child(meetup_key).child('registeredMembers').once('value')
        .then(snapshot => {
          let targets = snapshot.val(),
              promiseArray = []

          if (targets) {
            for (let uid in targets) {
              let result = new Promise((resolve, reject) => {        
                firebase.database().ref('users').child(uid).child('registeredMeetups').child(meetup_key).remove()
                .then(() => {
                  // send notification
                  return context.dispatch('sendNotificationMessage', {
                    target_uid: uid, 
                    type: 'group_dismissed', 
                    status: 'deleted'
                  })
                  .then(() => {
                    resolve()
                  })
                  .catch(error => reject(error))
                })
              })
              promiseArray.push(result)
            }
          }
          return Promise.all(promiseArray)
        })
        // delete from organizer's createdMeetups
        .then(() => {
          return firebase.database().ref('users').child(curr_user.uid).child('createdMeetups').child(meetup_key).remove()
        })
        // delete from meetups db
        .then(() => {
          return firebase.database().ref('meetups').child(meetup_key).remove()
        })
        .then(() => {
          // delete image in storage if exists
          return firebase.storage().ref('meetups').child(meetup_key).delete()
        })
        // set popup msg
        .then(() => {
          context.commit('setPopupMsg', {
            type: 'success',
            title: '小组删除成功',
            content: '我们已将此小组从你的数据库中删除, 并通知了所有小组成员'
          })
          resolve()
        })
        .catch(error => console.log(error))
      })
    }
  }
}

export default meetup