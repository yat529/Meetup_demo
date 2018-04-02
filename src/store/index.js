/* eslint-disable */ 
import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

// import modules
import user from './modules/user.js'
import meetup from './modules/meetup.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    userModule: user,
    meetupModule: meetup
  },
  state: {
    // local cache data from firebase
    // loadedMeetups: [],
    // createdMeetups: [],
    // registeredMeetups: [],
    // loadedMeetup: null,
    // state
    // loading: false,
    // error: null,
    // successLogin: false,
    // successLogout: false,
    // errorAlet: false,
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
    // // loadedMeetups and sort
    // loadedMeetups (state) {
    //   console.log('data loaded')
    //   return state.loadedMeetups.sort((meetupA, meetupB) => {
    //     return meetupA.date > meetupB.date
    //   })
    // },
    // // featuredMeetups, first 5 of loadedMeetups
    // featuredMeetups (state, getters) {
    //   return getters.loadedMeetups.slice(0, 5)
    // },
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
      let uid = state.userModule.user
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
      let uid = state.userModule.user
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
      if (!state.userModule.user_ref.createdMeetups) {
        state.userModule.user_ref.createdMeetups = {}
      }
      state.userModule.user_ref.createdMeetups[payload] = true
    },
    deleteUserCreatedMeetup (state, payload) {
      if (state.userModule.user_ref.createdMeetups[payload]) {
        // state.userModule.user_ref.createdMeetups.splice(state.userModule.user_ref.createdMeetups.indexOf(payload), 1)
        delete state.userModule.user_ref.createdMeetups[payload]
      }
    },
    addUserRegisteredMeetup (state, payload) {
      // info add to user_basic obj
      // payload is meetup key
      if (!state.userModule.user_ref.registeredMeetups) {
        // leave it as array for now...
        state.userModule.user_ref.registeredMeetups = {}
      }
      state.userModule.user_ref.registeredMeetups[payload] = true
    },
    deleteUserRegisteredMeetup (state, payload) {
      // payload is meetup key
      if (state.userModule.user_ref.registeredMeetups[payload]) {
        // state.userModule.user_ref.registeredMeetups.splice(state.userModule.user_ref.registeredMeetups.indexOf(payload), 1)
        delete state.userModule.user_ref.registeredMeetups[payload]
      }
    },
    // register user to local cache of meetup
    addMeetupRegisteredMember (state, payload) {
      // payload is meetup key
      let targetMeetup
      let user = {
        uid: state.userModule.user,
        nickname: state.userModule.user_ref.nickname,
        avatar: state.userModule.user_ref.avatar,
        sex: state.userModule.user_ref.sex
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
      let uid = state.userModule.user
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
    // 
  }
})
