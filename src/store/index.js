/* eslint-disable */ 
import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

// import modules
import user from './modules/user.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    userModule: user
  },
  state: {
    // local cache data from firebase
    loadedMeetups: [],
    createdMeetups: [],
    registeredMeetups: [],
    loadedMeetup: null,
    // state
    loading: false,
    error: null,
    successLogin: false,
    successLogout: false,
    errorAlet: false,
    // fileloader related
    flimage: null,
    flimageTempUrl: null,
    // google map related
    gmLocation: {
      address: '',
      LatLng: {
        lat: undefined,
        lng: undefined
      }
    }
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
    // menu items - vary by sign in status
    menuItems (state) {
      // when not login
      let menuItems = [
        { icon: 'supervisor_account', title: 'View Meetups', link: '/meetups' },
        // { icon: 'face', title: 'Sign up', link: '/signup' },
        { icon: 'lock_open', title: 'Sign in', link: '/signin' }
      ]
      // if login
      if (state.userModule.user) {
        menuItems = [
          { icon: 'supervisor_account', title: 'View Meetups', link: '/meetups' },
          { icon: 'room', title: 'Create Meetup', link: '/addmeetup' },
          { icon: 'person', title: 'Profile', link: '/profile' }
        ]
      }
      return menuItems
    }
  },
  mutations: {
    // format meetup from firebase to match with local cache format
    formatMeetup (state, meetup) {
      let obj = {}
      let registeredMembers = []
      Object.keys(meetup).forEach(key => {
        if (key === 'registeredMembers') {
          Object.keys(meetup[key]).forEach(item => {
            registeredMembers.push(meetup[key][item])
          })
        }
        Vue.set(obj, key, meetup[key])
      })
      Vue.set(obj, 'registeredMembers', registeredMembers)
      state.loadedMeetup = obj
    },
    // local meetups
    cacheMeetups (state, meetup) {
      let obj = {}
      let registeredMembers = []
      Object.keys(meetup).forEach(key => {
        if (key === 'registeredMembers') {
          Object.keys(meetup[key]).forEach(item => {
            registeredMembers.push(meetup[key][item])
          })
        }
        Vue.set(obj, key, meetup[key])
      })
      Vue.set(obj, 'registeredMembers', registeredMembers)
      state.loadedMeetups.push(obj)
      console.log('data cached')
    },
    cacheRegisteredMeetups (state, meetup) {
      let uid = state.user.uid
      let obj = {}
      let registeredMembers = []
      if (meetup.registeredMembers && meetup.registeredMembers[uid]) {
        Object.keys(meetup).forEach(key => {
          if (key === 'registeredMembers') {
            Object.keys(meetup[key]).forEach(item => {
              registeredMembers.push(meetup[key][item])
            })
          }
          Vue.set(obj, key, meetup[key])
        })
        Vue.set(obj, 'registeredMembers', registeredMembers)
        state.registeredMeetups.push(obj)
      }
    },
    cacheCreatedMeetups (state, meetup) {
      let uid = state.user.uid
      let obj = {}
      let registeredMembers = []
      if (meetup.uid === uid) {
        Object.keys(meetup).forEach(key => {
          if (key === 'registeredMembers') {
            Object.keys(meetup[key]).forEach(item => {
              registeredMembers.push(meetup[key][item])
            })
          }
          Vue.set(obj, key, meetup[key])
        })
        Vue.set(obj, 'registeredMembers', registeredMembers)
        state.createdMeetups.push(obj)
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
    clearLoadedMeetUp (state) {
      state.loadedMeetup = null
    },
    registerMeetup (state, payload) {
      state.registeredMeetups.push(payload)
    },
    unregisterMeetup (state, payload) {
      // payload is meet up
      state.registeredMeetups.forEach((meetup, index) => {
        if (meetup.key === payload.key) {
          state.registeredMeetups.splice(index, 1)
        }
      })
    },
    
    addUserCreatedMeetup (state, payload) {
      // info add to user_basic obj
      if (!state.user_basic.createdMeetups) {
        state.user_basic.createdMeetups = {}
      }
      state.user_basic.createdMeetups[payload] = true
    },
    deleteUserCreatedMeetup (state, payload) {
      if (state.user_basic.createdMeetups[payload]) {
        // state.user_basic.createdMeetups.splice(state.user_basic.createdMeetups.indexOf(payload), 1)
        delete state.user_basic.createdMeetups[payload]
      }
    },
    addUserRegisteredMeetup (state, payload) {
      // info add to user_basic obj
      // payload is meetup key
      if (!state.user_basic.registeredMeetups) {
        // leave it as array for now...
        state.user_basic.registeredMeetups = {}
      }
      state.user_basic.registeredMeetups[payload] = true
    },
    deleteUserRegisteredMeetup (state, payload) {
      // payload is meetup key
      if (state.user_basic.registeredMeetups[payload]) {
        // state.user_basic.registeredMeetups.splice(state.user_basic.registeredMeetups.indexOf(payload), 1)
        delete state.user_basic.registeredMeetups[payload]
      }
    },
    // register user to local cache of meetup
    addMeetupRegisteredMember (state, payload) {
      // payload is meetup key
      let targetMeetup
      let user = {
        uid: state.user.uid,
        nickname: state.user_basic.nickname,
        avatar: state.user_basic.avatar,
        sex: state.user_basic.sex
      }

      // if user already opened a meetup
      if (state.loadedMeetup) {
        targetMeetup = state.loadedMeetup
      } else {
        targetMeetup = state.loadedMeetups.find(meetup => meetup.key === payload)
      }
      // if the meetup don't have a registered membet object ye
      if (!targetMeetup.registeredMembers) {
        // targetMeetup.registeredMembers = []
        Vue.set(targetMeetup, 'registeredMembers', [])
      } else {
        targetMeetup.registeredMembers.forEach((member, index) => {
          if (member.uid === user.uid) {
            return false
          }
        })
      }
      // add the current user to the meetup
      targetMeetup.registeredMembers.push(user)
    },
    deleteMeetupRegisteredMember (state, payload) {
      // payload is meetup key
      let uid = state.user.uid
      let targetMeetup = state.loadedMeetups.find(meetup => meetup.key === payload)
      if (targetMeetup.registeredMembers.length) {
        targetMeetup.registeredMembers.forEach((member, index) => {
          if (member.uid === uid) {
            targetMeetup.registeredMembers.splice(index, 1)
          }
        })
      }
    },
    
    // local fileloader cache
    setFileLoaderCache (state, payload) {
      state.flimage = payload.file
      state.flimageTempUrl = payload.fileTempUrl
    },
    clearFileLoaderCache (state) {
      state.flimage = null
      state.flimageTempUrl = null
    },
    // google map location cache
    setGoogleMapLocation (state, payload) {
      // state.gmLocation = payload
      state.gmLocation.name = payload.name
      state.gmLocation.address = payload.address
      state.gmLocation.address_details = payload.address_details
      state.gmLocation.LatLng.lat = payload.LatLng.lat
      state.gmLocation.LatLng.lng = payload.LatLng.lng
      console.log('running')
    },
    clearGoogleMapLocation (state) {
      state.gmLocation = null
      state.gmLocation = {
        name: '',
        address: '',
        address_details: {},
        LatLng: {
          lat: undefined,
          lng: undefined
        }
      }
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
        size: newMeetup.size,
        description: newMeetup.description,
        date: newMeetup.date,
        uid: context.state.user ? context.state.user.uid : undefined,
        organizer: {
          nickname: context.state.user_basic.nickname,
          avatar: context.state.user_basic.avatar,
          sex: context.state.user_basic.sex
        }
      }
      return new Promise((resolve, reject) => {
        context.commit('setLoading', true)
        return firebase.database().ref('meetups').push(meetup)
        .then(reference => {
          key = reference.key
          file = context.state.flimage
          imageUrl = context.state.flimageTempUrl || ''

          // check for uploaded file
          if (file) {
            let name = file.name
            fileExt = name.slice(name.lastIndexOf('.'))
            // upload the file
            return firebase.storage().ref('meetups/images').child(key + fileExt).put(file)
            .then(snapshot => {
              // get the image url in firebase storage
              imageUrl = snapshot.metadata.downloadURLs[0]
              firebase.database().ref('/meetups').child(key).update({
                imageExt: fileExt,
                imageUrl: imageUrl
              })
            })
            .then(() => {
              // updated createdMeetups in users entry
              firebase.database().ref('/users').child(meetup.uid).child('createdMeetups').child(key).set(true)
            })
          } else if (imageUrl) {
            firebase.database().ref('/meetups').child(key).update({
              imageExt: null,
              imageUrl: imageUrl
            })
            firebase.database().ref('/users').child(meetup.uid).child('createdMeetups').child(key).set(true)
          } else {
            firebase.database().ref('/users').child(meetup.uid).child('createdMeetups').child(key).set(true)
          }
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
          // clear google map location cache
          context.commit('clearGoogleMapLocation')
          // able to chain promise in component methods
          resolve()
        })
        .catch(error => {
          console.log(error)
        })
      })
    },
    deleteMeetup (context, meetup) {
      let uid = context.state.user.uid
      let key = meetup.key
      console.log(key)
      context.commit('setLoading', true)
      // delete image in storage if exists
      if (meetup.imageUrl && meetup.imageExt) {
        let imageRef = key + meetup.imageExt
        firebase.storage().ref('meetups/images').child(imageRef).delete()
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
          context.commit('deleteMeetup', meetup)
          context.commit('deleteUserCreatedMeetup', key)
          context.commit('setLoading', false)
          console.log('meetup deleted')
          resolve()
        })
        .catch((error) => {
          console.log(error)
        })
      })
    },
    registerMeetup (context, meetup) {
      // prepare the user info to be submitted
      let user = {
        uid: context.state.user.uid,
        nickname: context.state.user_basic.nickname,
        avatar: context.state.user_basic.avatar,
        sex: context.state.user_basic.sex
      }
      let key = meetup.key
      // console.log(key)

      return new Promise((resolve, reject) => {
        context.commit('setLoading', true)
        firebase.database().ref('meetups').child(key).child('registeredMembers').child(user.uid).set(user)
        .then(() => {
          return firebase.database().ref('users').child(user.uid).child('registeredMeetups').child(key).set(true)
        })
        .then(() => {
          context.commit('registerMeetup', meetup)
          context.commit('addUserRegisteredMeetup', key)
          context.commit('addMeetupRegisteredMember', key)
          context.commit('setLoading', false)
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

      return new Promise((resolve, reject) => {
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
          resolve()
        })
        .catch(error => {
          console.log(error)
        })
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
            context.commit('cacheMeetups', meetup)
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
            meetup.key = snapshot.key
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
    
    // when meetups page load
    initPage (context) {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          context.commit('signInUser', user)
        } else {
          context.commit('signOutUser')
        }

        if (!context.state.loadedMeetups.length) {
          context.commit('setLoading', true)
          context.dispatch('loadMeetupsOnce')
            .then(() => {
              context.commit('setLoading', false)
            })
        }
      })
    }
  }
})
