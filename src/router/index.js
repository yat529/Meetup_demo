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
// Profile Page
import Profile from '@/components/User/Profile'
import ProfileInit from '@/components/User/init'
import ProfileUpdate from '@/components/User/update'
import ProfileDashboard from '@/components/User/dashboard'
import ProfileFriends from '@/components/User/friendList'
import ProfileCreatedMeetup from '@/components/User/createdMeetup'
import ProfileRegisteredMeetup from '@/components/User/registeredMeetup'
import ProfilePendingMeetup from '@/components/User/pendingMeetup'
// User Public Page
import UserPublicPage from '@/components/User/Public'

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
      redirect: '/meetups'
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
      redirect: '/profile/dashboard',
      children: [
        {
          path: 'dashboard',
          component: ProfileDashboard
        },
        {
          path: 'friends',
          component: ProfileFriends
        },
        {
          path: 'createdmeetup',
          component: ProfileCreatedMeetup
        },
        {
          path: 'registeredmeetup',
          component: ProfileRegisteredMeetup
        },
        {
          path: 'pendingmeetup',
          component: ProfilePendingMeetup
        },
      ],
      beforeEnter: routerGuard
    },
    {
      path: '/profile/init',
      name: 'ProfileInit',
      component: ProfileInit,
      beforeEnter: routerGuard
    },
    {
      path: '/user/:id',
      name: 'UserPublicPage',
      component: UserPublicPage,
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
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
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
