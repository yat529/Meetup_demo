<template>
  <div ref="appBody" v-if="friends.length">

    <InfoBar 
      v-show="showInfoBar"
      v-on:close="closeInfoBar"></InfoBar>

    <UserList :users="friends" ref="pendingMemberlist"
      v-on:submit="submitSelectedUsers"></UserList>

  </div>

  <NoResultPage v-else
    noResultText="暂时没有好友邀请"
    v-on:btnClick="btnClick"></NoResultPage>
</template>

<script>
/* eslint-disable */
import UserList from '../userList'
import InfoBar from '../infoBar'
import NoResultPage from '@/components/common/noResultPage'

export default {
  components: {
    UserList,
    InfoBar,
    NoResultPage
  },

  props: {
    friends: {
      type: Array,
      default () {
        return [
          {
            name: 'Name 1',
            gender: 'female',
            age: 22,
            uid: 1
          },
          {
            name: 'Name 2',
            gender: 'male',
            age: 25,
            uid: 2
          },
          {
            name: 'Name 3',
            gender: 'female',
            age: 23,
            uid: 3
          }
        ]
      }
    }
  },

  data () {
    return {
      showInfoBar: true,
      users: this.friends,
      selectedUsers: [],
    }

  },

  methods: {
    submitSelectedUsers (list) {
      this.selectedUsers = list
      console.log(this.selectedUsers)
    },

    closeInfoBar () {
      this.showInfoBar = false
    },

    btnClick () {
      console.log('click btn')
    },
    
    // transition
    beforeListEnter (el) {
      el.style.opacity = 0
    },

    listEnter (el, done) {
      Velocity(el, { opacity: 1 }, {
        duration: 600,
        easing: 'ease',
        complete: done
      })
    },

    listLeave (el, done) {
      let $parentView = this.$utils.findParent(el, 'profile_dashboard')

      this.$utils.animateScrollTo($parentView, $parentView, 600)
      Velocity(el, { 
        translateX: '100px',
        opacity: 0
        }, 
        {
        duration: 600,
        delay: 200,
        easing: 'ease',
        complete: done
      })
    },
  }
}
</script>
