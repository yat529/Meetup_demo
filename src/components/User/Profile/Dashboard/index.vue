<template>
  <div>
    <AppViewHeader ref="cusAppHeader"
      :headerInfo="headerInfo"
      v-on:changeTab="getCurrentTab"></AppViewHeader>

    <div id="profile_dashboard" class="cus-app-view-body">
      <transition name="slide" mode="out-in">
      <PendingMember class="section-wrapper cus-p-20" v-if="tabIndex === 0"
      :groups="groupsWithPendingMember"></PendingMember>

      <PendingGroup class="section-wrapper cus-p-20" v-else-if="tabIndex === 1"
      :groups="groupsOfNewInvitation"></PendingGroup>
      
      <PendingFriend class="section-wrapper cus-p-20" v-else-if="tabIndex === 2"></PendingFriend>
      </transition>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
import AppViewHeader from '@/components/common/header_tab'
import PendingMember from './pendingMember'
import PendingGroup from './pendingGroup'
import PendingFriend from './pendingFriend'

// users.pendingMembers = {
//   nickname: '',
//   photoURL: '',
//   gender: '',
//   location: '',
// }

// user.pendingFriends = {
//   nickname: '',
//   photoURL: '',
//   gender: '',
//   location: '',
// }

// user.pendingInvitation = {
//   id: ''
// }

// notification/uuid/type/content

// fetch groups with pending members => format members into array, then feed to PendingMember Component
// --> fetch group id from notification newMember
// --> fetch pendingMember from meetup using id
// fetch pending Invitation => format into array, then feed to PendingGroup
// fetch pending friend request => format into array, then feed to PendingFriend
// fetch notifications => format into array, then feed to NotificationList
// --> fetch group id from approved groups
// --> fetch meetups to get group info

export default {
  components: {
    AppViewHeader,
    PendingMember,
    PendingGroup,
    PendingFriend
  },

  data () {
    return {
      headerInfo: {
        title: '消息中心',
        subtitle: '查看你的米团动态和消息',
        tabs: [
          {
            label: '成员',
            active: true
          }, 
          {
            label: '小组',
            active: false
          }, 
          {
            label: '朋友',
            active: false
          }, 
        ]
      },
      tabIndex: 0,
    }
  },

  computed: {

    groupsWithPendingMember () {
      let groups = this.$store.state.userModule.groups
      if(groups) {
        return groups.pending_member
      }
    },

    groupsOfNewInvitation () {
      let groups = this.$store.state.userModule.groups
      if(groups) {
        return groups.invited
      }
    },
  },

  methods: {
    getCurrentTab (tab) {
      this.tabIndex = tab - 1
    }
  },

  created () {
    let promiseArr = []

    this.$store.commit('setLoading', true)

    promiseArr = [
      this.$store.dispatch('defaultLoading'),
      this.$store.dispatch('fetchUserGroupsWithPendingMember'),
      this.$store.dispatch('fetchUserGroupsOfNewInvitation'),
      this.$store.dispatch('fetchInvitedGroups')
    ]

    Promise.all(promiseArr).then(results => {
      this.$store.commit('setLoading', false)
    })
  }

}
</script>


