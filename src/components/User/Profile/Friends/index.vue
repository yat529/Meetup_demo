<template>
  <div>
    <AppViewHeader ref="cusAppHeader"
      :headerInfo="headerInfo"
      v-on:changeTab="getCurrentTab"></AppViewHeader>

    <div id="profile_friend" class="cus-app-view-body">
      <transition name="slide" mode="out-in">
      <div class="section-wrapper cus-p-20" v-if="tabIndex === 1">
        <UserList v-on:submit="viewUser"></UserList>
      </div>
      
      <div class="section-wrapper cus-p-20 fill-height" v-else-if="tabIndex === 2">
        <SearchPage v-on:submit="viewUser"></SearchPage>
      </div>
      </transition>
    </div>

  </div>
</template>


<script>
/* eslint-disable */
import AppViewHeader from '@/components/common/header_tab'
import UserList from './userList_search'
import SearchPage from './searchPage'

export default {
  components: {
    AppViewHeader,
    UserList,
    SearchPage
  },

  data () {
    return {
      headerInfo: {
        title: '我的好友',
        subtitle: '查看和管理你的好友',
        tabs: [
          {
            label: '好友列表',
            active: true
          }, 
          {
            label: '寻找好友',
            active: false
          }
        ]
      },
      tabIndex: 1,
    }
  },

  methods: {

    getCurrentTab (tab) {
      console.log(tab)
      this.tabIndex = tab
    },

    viewUser (uid) {
      console.log(uid)
    }

  },

  created () {
    this.$store.commit('setLoading', true)

    // fetch user
    setTimeout(() => {
      this.$store.commit('setLoading', false)
    }, 2000)
  }
}
</script>

<style lang="scss">

</style>

