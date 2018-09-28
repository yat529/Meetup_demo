<template>

  <div>
    <AppViewHeader ref="cusAppHeader"
      :headerInfo="headerInfo"
      v-on:changeTab="getCurrentTab"></AppViewHeader>

    <div id="profile_groups" class="cus-app-view-body">
      <transition name="slide" mode="out-in">
        <CreatedGroups v-if="tabIndex === 1" :createdGroups="createdGroups"></CreatedGroups>
        <JoinedGroups v-else-if="tabIndex === 2" :registeredGroups="registeredGroups"></JoinedGroups>
        <PendingGroups v-else-if="tabIndex === 3" :pendingGroups="pendingGroups"></PendingGroups>
      </transition>
    </div>
  </div>

</template>

<script>
/* eslint-disable */
import AppViewHeader from '@/components/common/header_tab'
import CreatedGroups from './Groups_Created'
import JoinedGroups from './Groups_Registered'
import PendingGroups from './Groups_Pending'

export default {
  components: {
    AppViewHeader,
    CreatedGroups,
    JoinedGroups,
    PendingGroups
  },

  data () {
    return {
      headerInfo: {
        title: '我的米团',
        subtitle: '查看和管理你的米团',
        tabs: [
          {
            label: '已创建',
            active: true
          }, 
          {
            label: '已加入',
            active: false
          }, 
          {
            label: '待审核',
            active: false
          }, 
        ]
      },
      tabIndex: 1
    }
  },

  methods: {
    getCurrentTab (tab) {
      console.log(tab)
      this.tabIndex = tab
    }
  },

  computed: {
    userGroups () {
      return this.$store.state.userModule.groups
    },

    createdGroups () {
      if(this.userGroups) {
        return this.userGroups.created
      }
    },

    registeredGroups () {
      if(this.userGroups) {
        return this.userGroups.registered
      }
    },

    pendingGroups () {
      if(this.userGroups) {
        return this.userGroups.pending
      }
    },
  },

  created () {
    let promiseArr = []

    this.$store.commit('setLoading', true)

    promiseArr = [
      this.$store.dispatch('defaultLoading'),
      this.$store.dispatch('fetchCreatedGroups'),
      this.$store.dispatch('fetchRegisteredGroups'),
      this.$store.dispatch('fetchPendingGroups'),
    ]

    Promise.all(promiseArr).then(results => {
      this.$store.commit('setLoading', false)
    })
    
  }
}
</script>

<style lang="scss">
// // Global
// .cus-p-20 {
//   padding: 20px;
// }
</style>


