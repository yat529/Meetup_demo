import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    // data from firebase
    loadedMeetups: [
      // {
      //   imageUrl: 'https://az616578.vo.msecnd.net/files/2016/03/11/635932734909157496651194192_nyc-letters.jpg',
      //   id: 'a',
      //   title: 'Meetup in NYC',
      //   date: '2018-03-21 12:10',
      //   description: 'Located two hours south of Sydney in the Southern Highlands of New South Wales, ...'
      // },
      // {
      //   imageUrl: 'http://architectureimg.com/wp-content/uploads/2016/12/bridges-early-morning-queensboro-bridge-nyc-new-york-city-usa-manhattan-buildings-lights-river-desktop-backgrounds.jpg',
      //   id: 'b',
      //   title: 'Meetup in NYC',
      //   date: Date.now(),
      //   description: 'Located two hours south of Sydney in the Southern Highlands of New South Wales, ...'
      // }
    ],
    createdMeetups: [],
    registeredMeetups: [],
    loadedMeetup: null,
    user: null,
    loading: false,
    error: null,
    successLogin: false,
    successLogout: false,
    errorAlet: false,
    // fileloader related
    flimage: null
  },
  getters: {
    // loadedMeetups and sort
    loadedMeetups (state) {
      console.log('data loaded')
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    // featuredMeetups, first 5 of loadedMeetups
    featuredMeetups (state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    },
    // // load meetups for current user - display on the profile page
    // myCreatedMeetups (state) {
    //   // loop througn loadedMeetups, and find the meetups with uid equal to user.uid
    //   if (state.user) {
    //     return state.loadedMeetups.filter(meetup => meetup.uid === state.user.uid)
    //   }
    // },
    // myRegisteredMeetups (state) {
    //   // loop througn loadedMeetups, and find the meetups with uid equal to user.uid
    //   if (state.user) {
    //     return state.loadedMeetups.filter(meetup => meetup.uid === state.user.uid)
    //   }
    // },
    // menu items - vary by sign in status
    menuItems (state) {
      // when not login
      let menuItems = [
        { icon: 'supervisor_account', title: 'View Meetups', link: '/meetups' },
        { icon: 'face', title: 'Sign up', link: '/signup' },
        { icon: 'lock_open', title: 'Sign in', link: '/signin' }
      ]
      // if login
      if (state.user) {
        menuItems = [
          { icon: 'supervisor_account', title: 'View Meetups', link: '/meetups' },
          { icon: 'room', title: 'Create Meetup', link: 'addmeetup' },
          { icon: 'person', title: 'Profile', link: '/profile' }
        ]
      }
      return menuItems
    }
  },
  mutations: {
    // local meetups
    cacheMeetup (state, meetup) {
      state.loadedMeetups.push(meetup)
      console.log('data cached')
    },
    cacheRegisteredMeetups (state, meetup) {
      let uid = state.user.uid
      if (meetup.registeredMembers && meetup.registeredMembers[uid]) {
        state.registeredMeetups.push(meetup)
      }
    },
    cacheCreatedMeetups (state, meetup) {
      let uid = state.user.uid
      if (meetup.uid === uid) {
        state.createdMeetups.push(meetup)
      }
    },
    clearUserMeetupsCache (state) {
      state.createdMeetups = []
      state.registeredMeetups = []
      console.log('data cache cleared')
    },
    // local single meetup
    createMeetup (state, payload) {
      state.createdMeetups.push(payload)
      state.loadedMeetups.push(payload)
      console.log('meetup created')
    },
    updateMeetup (state, payload) {
      let target = state.loadedMeetups.find(meetup => meetup.key === payload.key)
      if (target) {
        Object.keys(payload).forEach(key => {
          if (target[key]) target[key] = payload[key]
        })
      }
    },
    deleteMeetup (state, payload) {
      state.createdMeetups.forEach((meetup, index) => {
        if (meetup.key === payload.key) {
          state.createdMeetups.splice(index, 1)
        }
      })
      state.loadedMeetups.forEach((meetup, index) => {
        if (meetup.key === payload.key) {
          state.loadedMeetups.splice(index, 1)
        }
      })
    },
    loadMeetup (state, payload) {
      state.loadedMeetup = state.loadedMeetups.find(meetup => meetup.key === payload.key)
    },
    registerMeetup (state, payload) {
      state.registeredMeetups.push(payload)
    },
    unregisterMeetup (state, payload) {
      state.registeredMeetups.forEach((meetup, index) => {
        if (meetup.key === payload.key) {
          state.registeredMeetups.splice(index, 1)
        }
      })
    },
    // local user cache
    signUserIn (state, user) {
      // user.registeredMeetups = []
      state.user = user
      console.log('user logged in')
    },
    signUserOut (state) {
      state.user = null
      console.log('user signed out')
    },
    addUserCreatedMeetup (state, payload) {
      if (!state.user.createdMeetups) {
        state.user.createdMeetups = []
      }
      state.user.createdMeetups.push(payload)
    },
    deleteUserCreatedMeetup (state, payload) {
      if (state.user.createdMeetups) {
        state.user.createdMeetups.splice(state.user.createdMeetups.indexOf(payload), 1)
      }
    },
    addUserRegisteredMeetup (state, payload) {
      if (!state.user.registeredMeetups) {
        state.user.registeredMeetups = []
      }
      state.user.registeredMeetups.push(payload)
    },
    deleteUserRegisteredMeetup (state, payload) {
      if (state.user.registeredMeetups) {
        state.user.registeredMeetups.splice(state.user.registeredMeetups.indexOf(payload), 1)
      }
    },
    addMeetupRegisteredMember (state, payload) {
      let uid = state.user.uid
      let targetMeetup = state.loadedMeetups.find(meetup => meetup.key === payload)
      if (!targetMeetup.registeredMembers) {
        targetMeetup.registeredMembers = {}
      }
      // console.log(targetMeetup)
      targetMeetup.registeredMembers[uid] = true
    },
    deleteMeetupRegisteredMember (state, payload) {
      let uid = state.user.uid
      let targetMeetup = state.loadedMeetups.find(meetup => meetup.key === payload)
      if (targetMeetup.registeredMembers && targetMeetup.registeredMembers[uid]) {
        delete targetMeetup.registeredMembers[uid]
      }
    },
    // local fileloader cache
    setFileLoaderCache (state, payload) {
      state.flimage = payload
    },
    clearFileLoaderCache (state) {
      state.flimage = null
    },
    // other state info
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    showSuccessLoginAlert (state, payload) {
      state.successLogin = payload
    },
    showSuccessLogoutAlert (state, payload) {
      state.successLogout = payload
    },
    showErrorAlet (state, payload) {
      state.errorAlet = payload
    },
    clearAlert (state) {
      state.successLogin = false
      state.successLogout = false
      state.errorAlet = false
    }
  },
  actions: {
    createMeetup (context, newMeetup) {
      let key, file, fileExt, imageUrl
      let meetup = {
        title: newMeetup.title,
        location: newMeetup.location,
        description: newMeetup.description,
        date: newMeetup.date,
        uid: context.state.user ? context.state.user.uid : undefined
      }

      context.commit('setLoading', true)
      firebase.database().ref('meetups').push(meetup)
        .then(reference => {
          key = reference.key
          // parse the file ext
          file = context.state.flimage
          let name = file.name
          fileExt = name.slice(name.lastIndexOf('.'))
          // upload the file
          return firebase.storage().ref('meetups/images').child(key + fileExt).put(file)
        })
        .then(snapshot => {
          // get the image url in firebase storage
          imageUrl = snapshot.metadata.downloadURLs[0]
          return firebase.database().ref('/meetups').child(key).update({
            imageExt: fileExt,
            imageUrl: imageUrl
          })
        })
        .then(() => {
          // updated createdMeetups in users entry
          return firebase.database().ref('/users').child(meetup.uid).child('createdMeetups').child(key).set(true)
        })
        .then(() => {
          // add property to meetup obj
          meetup.key = key
          meetup.imageExt = fileExt
          meetup.imageUrl = imageUrl
          context.commit('createMeetup', meetup)
          context.commit('addUserCreatedMeetup', key)
          context.commit('setLoading', false)
          // clear fileloader cache
          context.commit('clearFileLoaderCache')
          // able to chain promise in component methods
          return new Promise((resolve, reject) => {
            resolve()
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    deleteMeetup (context, meetup) {
      let uid = context.state.user.uid
      let key = meetup.key
      console.log(key)
      context.commit('setLoading', true)
      // delete image in storage if exists
      if (meetup.imageUrl) {
        let imageRef = key + meetup.imageExt
        firebase.storage().ref('meetups/images').child(imageRef).delete()
          .then(() => {
            console.log('image file deleted')
          })
          .catch(error => {
            console.log(error)
          })
      }
      // delete entry in database
      firebase.database().ref('meetups').child(key).remove()
        .then(() => {
          return firebase.database().ref('users').child(uid).child('createdMeetups').child(key).remove()
        })
        .then(() => {
          context.commit('deleteMeetup', meetup)
          context.commit('deleteUserCreatedMeetup', key)
          context.commit('setLoading', false)
          console.log('meetup deleted')
        })
        .catch((error) => {
          console.log(error)
        })
    },
    registerMeetup (context, meetup) {
      let uid = context.state.user.uid
      let key = meetup.key
      context.commit('setLoading', true)
      firebase.database().ref('meetups').child(key).child('registeredMembers').child(uid).set(true)
      .then(() => {
        return firebase.database().ref('users').child(uid).child('registeredMeetups').child(key).set(true)
      })
      .then(() => {
        context.commit('registerMeetup', meetup)
        context.commit('addUserRegisteredMeetup', key)
        context.commit('addMeetupRegisteredMember', key)
        context.commit('setLoading', false)
        return new Promise((resolve, reject) => {
          resolve()
        })
      })
      .catch(error => {
        console.log(error)
      })
    },
    unregisterMeetup (context, meetup) {
      let uid = context.state.user.uid
      let key = meetup.key
      context.commit('setLoading', true)
      firebase.database().ref('meetups').child(key).child('registeredMembers').child(uid).remove()
      .then(() => {
        return firebase.database().ref('users').child(uid).child('registeredMeetups').child(key).remove()
      })
      .then(() => {
        context.commit('unregisterMeetup', meetup)
        context.commit('deleteUserRegisteredMeetup', key)
        context.commit('deleteMeetupRegisteredMember', key)
        context.commit('setLoading', false)
        return new Promise((resolve, reject) => {
          resolve()
        })
      })
      .catch(error => {
        console.log(error)
      })
    },
    // load meetups from firebase, return a promise
    loadMeetupsOnce (context) {
      return new Promise((resolve, reject) => {
        firebase.database().ref('meetups').once('value')
        .then(snapshots => {
          snapshots.forEach(snapshot => {
            let meetup = snapshot.val()
            meetup.key = snapshot.key
            context.commit('cacheMeetup', meetup)
          })
          resolve()
        })
        .catch(error => {
          console.log(error)
        })
      })
    },
    loadUserMeetupsOnce (context) {
      return new Promise((resolve, reject) => {
        firebase.database().ref('meetups').once('value')
        .then(snapshots => {
          snapshots.forEach(snapshot => {
            let meetup = snapshot.val()
            context.commit('cacheRegisteredMeetups', meetup)
            context.commit('cacheCreatedMeetups', meetup)
          })
          resolve()
        })
        .catch(error => {
          console.log(error)
        })
      })
    },
    onAccSignUp (context, user) {
      context.commit('clearError')
      context.commit('clearAlert')
      context.commit('setLoading', true)
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(user => {
          // context.commit('initUser', user)
          return firebase.database().ref('users').child(user.uid).set({
            email: user.email
          })
        })
        .then(ref => {
          context.commit('setLoading', false)
          context.commit('showSuccessLoginAlert', true)
        })
        .catch(error => {
          console.log(error)
          context.commit('setError', error)
          context.commit('setLoading', false)
          context.commit('showErrorAlet', true)
        })
    },
    onUserLogIn (context, user) {
      context.commit('clearError')
      context.commit('clearAlert')
      context.commit('setLoading', true)

      return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(user => {
          context.commit('signUserIn', user)
          context.commit('setLoading', false)
          context.commit('showSuccessLoginAlert', true)
          context.dispatch('loadUserMeetupsOnce')
          resolve()
        })
        .catch(error => {
          console.log(error)
          context.commit('setError', error)
          context.commit('setLoading', false)
          context.commit('showErrorAlet', true)
        })
      })
    },
    onUserSignOut (context, router) {
      context.commit('clearError')
      context.commit('clearAlert')
      context.commit('setLoading', true)

      return new Promise((resolve, reject) => {
        firebase.auth().signOut()
          .then(() => {
            context.commit('signUserOut')
            context.commit('clearUserMeetupsCache')
            context.commit('setLoading', false)
            context.commit('showSuccessLogoutAlert', true)
            resolve()
          })
          .catch(error => {
            console.log(error)
            context.commit('setError', error)
            context.commit('showErrorAlet', true)
            reject(error)
          })
      })
    },
    // when meetups page load
    initPage (context) {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          context.commit('setLoading', true)
          context.commit('signUserIn', user)
          if (!context.state.registeredMeetups.length && !context.state.createdMeetups.length) {
            context.dispatch('loadUserMeetupsOnce')
              .then(() => context.commit('setLoading', false))
          }
        }
        if (!context.state.loadedMeetups.length) {
          context.commit('setLoading', true)
          context.dispatch('loadMeetupsOnce')
            .then(() => context.commit('setLoading', false))
        }
      })
    }
  }
})
