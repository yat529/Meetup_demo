/* eslint-disable */
import * as firebase from 'firebase'

const meetup = {
  state: {},
  getters: {},
  mutations: {},
  actions: {
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

    // check meetup uid for created meetup
    // check meetup subscribers for registered meetup
    fetchUserMeetups (context, user) {
      let userMeetups = {
            created: [],
            registered: []
          }

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
            if (meetup.subscribers) {
              let registered = Object.keys(meetup.subscribers).find(key => {
                return key === user.uid
              })
              if (registered) {
                userMeetups.registered.push(meetup)
              }
            }
          })
          resolve(userMeetups)
        })
        .catch(error => {
          console.log(error)
        })
      })
    },

    // Create meetup
    // 
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
        .then(() => resolve())
        .catch(error => {
          console.log(error)
        })
      })
    },


    deleteMeetup (context, meetup) {
      let uid = context.state.userModule.user
          key = meetup.key

      // delete image in storage if exists
      if (meetup.imageURLs) {
        firebase.storage().ref('meetups').child(key).delete()
        .then(() => {
          console.log('image file deleted')
        })
        .catch(error => {
          console.log(error)
        })
      }

      return new Promise((resolve, reject) => {
        // delete entry in database
        firebase.database().ref('meetups').child(key).remove()
        .then(() => {
          return firebase.database().ref('users').child(uid).child('createdMeetups').child(key).remove()
        })
        .then(() => {
          console.log('meetup deleted')
          resolve()
        })
        .catch((error) => {
          console.log(error)
        })
      })
    },


  }
}

export default meetup