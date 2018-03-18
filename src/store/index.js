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
    user: null,
    loadedMeetup: null,
    loading: false,
    error: null,
    successAlert: false,
    errorAlet: false
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
    // load meetups for current user - display on the profile page
    myMeetups (state) {
      // loop througn loadedMeetups, and find the meetups with uid equal to user.uid
      if (state.user) {
        return state.loadedMeetups.filter(meetup => meetup.uid === state.user.uid)
      }
    },
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
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
      console.log('date inserted')
    },
    clearMeetups (state) {
      state.loadedMeetups = []
    },
    updateUserMeetups (state, payload) {
      if (state.user.registeredMeetups) {
        state.user.registeredMeetups.push(payload)
      } else {
        state.user.registeredMeetups = []
        state.user.registeredMeetups.push(payload)
      }
    },
    loadMeetup (state, payload) {
      state.loadedMeetup = state.loadedMeetups.find(meetup => meetup.id === payload.id)
    },
    initUser (state, newUser) {
      newUser.registeredMeetups = []
      state.user = newUser
      console.log('new user meetup initiated')
    },
    signUserIn (state, user) {
      user.registeredMeetups = []
      state.user = user
      console.log('user logged in')
    },
    signUserOut (state) {
      state.user = null
      console.log('user signed out')
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    },
    showSuccessAlert (state, payload) {
      state.successAlert = payload
    },
    showErrorAlet (state, payload) {
      state.errorAlet = payload
    },
    clearAlert (state) {
      state.successAlert = false
      state.errorAlet = false
    }
  },
  actions: {
    createMeetup (context, payload) {
      let meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date,
        uid: context.state.user ? context.state.user.uid : undefined
      }
      context.commit('setLoading', true)
      firebase.database().ref('meetups').push(meetup)
        .then(reference => {
          // console.log(reference)
          meetup.id = reference.key
          // update userMeetups lists
          context.commit('updateUserMeetups', reference.key)
          context.commit('createMeetup', meetup)
          context.commit('setLoading', false)
        })
        .catch(error => {
          console.log(error)
        })
    },
    loadMeetups (context) {
      if (!context.state.loadedMeetups.length) {
        firebase.database().ref('meetups').once('value')
          .then(snapshots => {
            snapshots.forEach(snapshot => {
              let meetup = snapshot.val()
              meetup.id = snapshot.key
              context.commit('createMeetup', meetup)
            })
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    loadMeetup (context, payload) {
      context.commit('loadMeetup', payload)
    },
    onAccSignUp (context, user) {
      context.commit('clearError')
      context.commit('clearAlert')
      context.commit('setLoading', true)
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(user => {
          context.commit('initUser', user)
          context.commit('setLoading', false)
          context.commit('showSuccessAlert', true)
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
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(user => {
          context.commit('signUserIn', user)
          context.commit('setLoading', false)
          context.commit('showSuccessAlert', true)
        })
        .catch(error => {
          console.log(error)
          context.commit('setError', error)
          context.commit('setLoading', false)
          context.commit('showErrorAlet', true)
        })
    },
    onUserSignOut (context) {
      context.commit('clearError')
      context.commit('clearAlert')
      context.commit('setLoading', true)
      firebase.auth().signOut()
        .then(() => {
          context.commit('signUserOut')
          context.commit('setLoading', false)
        })
        .catch(error => {
          console.log(error)
          context.commit('setError', error)
          context.commit('showErrorAlet', true)
        })
    },
    logUserIn (context, user) {
      context.commit('signUserIn', user)
    },
    initPage (context) {
      context.commit('setLoading', true)
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          context.dispatch('logUserIn', user)
        }
        context.dispatch('loadMeetups')
        context.commit('setLoading', false)
      })
    }
  }
})
