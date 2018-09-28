/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import { store } from '../store'
import * as firebase from 'firebase'

// Import Page Components
// import Home from '@/components/Home'

// import Meetups from '@/components/Meetup/Meetups'
import Create from '@/components/Group/Create'
import Group from '@/components/Group'
// import CreateMeetup from '@/components/Meetup/CreateMeetup'
// import LoadedMeetup from '@/components/Meetup/Meetup'

// Group Information Page
// import Group from '@/components/Meetup/Group'

// Profile init Page
import ProfileInit from '@/components/User/init'

// Profile Page
import Profile from '@/components/User/Profile'
// import ProfileUpdate from '@/components/User/update'
import ProfileDashboard from '@/components/User/Profile/Dashboard'
import ProfileFriends from '@/components/User/Profile/Friends'
import ProfileGroups from '@/components/User/Profile/Groups'
import ProfileGroup from '@/components/User/Group'
// import ProfileGroupSchedule from '@/components/User/Group/Detail_Schedule'

// import ProfileCreatedMeetup from '@/components/User/createdMeetup'
// import ProfileRegisteredMeetup from '@/components/User/registeredMeetup'
// import ProfilePendingMeetup from '@/components/User/pendingMeetup'

// User Public Page
import UserPublicPage from '@/components/User/Public'

import Signup from '@/components/User/Signup'
import Signin from '@/components/User/Signin'
import Management from '@/components/User/Management'

// Account Page
import Account from '@/components/User/Account'
import PersonalInfo from '@/components/User/Account/personalInfo'
import AccountManagement from '@/components/User/Account/accountManagement'

// Test components
import Test from '@/components/User/Group/test'

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
      redirect: '/profile'
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    // {
    //   path: '/meetups',
    //   name: 'Meetups',
    //   component: Meetups
    // },
    {
      path: '/groups/:id',
      name: 'Group',
      component: Group
    },
    {
      path: '/create_mitwan',
      name: 'Create',
      component: Create,
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
          path: 'groups',
          component: ProfileGroups,
          // redirect: '/profile/groups/created',
          // children: [
          //   {
          //     path: 'created',
          //     component: ProfileCreatedMeetup
          //   },
          //   {
          //     path: 'registered',
          //     component: ProfileRegisteredMeetup
          //   },
          //   {
          //     path: 'pending',
          //     component: ProfilePendingMeetup
          //   },
          // ]
        },
        {
          path: 'groups/:id',
          name: 'ProfileGroup',
          component: ProfileGroup
        }
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
    // {
    //   path: '/home',
    //   name: 'Home',
    //   component: Home
    // },
    // account management
    {
      path: '/account',
      name: 'Account',
      component: Account,
      redirect: '/account/personal_information',
      beforeEnter: routerGuard,
      children: [
        {
          path: 'personal_information',
          component: PersonalInfo
        },
        {
          path: 'account_management',
          component: AccountManagement
        }
      ]
    },
    // handle external links
    {
      path: '/usermgmt',
      name: 'Management',
      component: Management
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
