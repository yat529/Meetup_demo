import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    // data from firebase
    loadedMeetups: [
      {
        imageUrl: 'https://az616578.vo.msecnd.net/files/2016/03/11/635932734909157496651194192_nyc-letters.jpg',
        id: 'a',
        title: 'Meetup in NYC',
        date: '2018-3-21',
        description: 'Located two hours south of Sydney in the Southern Highlands of New South Wales, ...'
      },
      {
        imageUrl: 'http://architectureimg.com/wp-content/uploads/2016/12/bridges-early-morning-queensboro-bridge-nyc-new-york-city-usa-manhattan-buildings-lights-river-desktop-backgrounds.jpg',
        id: 'b',
        title: 'Meetup in NYC',
        date: '2018-3-23',
        description: 'Located two hours south of Sydney in the Southern Highlands of New South Wales, ...'
      }
    ],
    user: {
      id: 'nighthawk',
      registeredMeetups: ['a']
    }
  },
  getters: {
    // loadedMeetups and sort
    loadedMeetups (state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    // featuredMeetups, first 5 of loadedMeetups
    featuredMeetups (state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    },
    // load single meetup
    loadedMeetup (state) {
      return meetupId => {
        return state.loadedMeetups.find(meetup => {
          return meetup.id === meetupId
        })
      }
    }
  },
  mutations: {
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
      console.log('date inserted')
    }
  },
  actions: {
    createMeetup (context, payload) {
      const meetup = {
        id: payload.id,
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date
      }
      context.commit('createMeetup', meetup)
    }
  }
})
