/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import { store } from '../store'
import * as firebase from 'firebase'

// Import Page Components
import Home from '@/components/Home'
import Meetups from '@/components/Meetup/Meetups'
import CreateMeetup from '@/components/Meetup/CreateMeetup'
import LoadedMeetup from '@/components/Meetup/Meetup'
import Profile from '@/components/User/Profile'
import ProfileInit from '@/components/User/init'
import Signup from '@/components/User/Signup'
import Signin from '@/components/User/Signin'

// Config Router Guard
let routerGuard = function (to, from, next) {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      next('/signin')
    } else {
      next()
    }
  })
}

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/meetups',
      name: 'Meetups',
      component: Meetups
    },
    {
      path: '/meetup/:id',
      name: 'LoadedMeetup',
      component: LoadedMeetup
    },
    {
      path: '/addmeetup',
      name: 'CreateMeetup',
      component: CreateMeetup,
      beforeEnter: routerGuard
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: routerGuard
    },
    {
      path: '/profile/init',
      name: 'ProfileInit',
      component: ProfileInit,
      beforeEnter: routerGuard
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    }
  ],
  mode: 'history'
})

// router.beforeEach((to, from, next) => {
//   if (!firebase.auth().currentUser) {
//     next('/signin')
//   } else {
//     next()
//   }
// })
