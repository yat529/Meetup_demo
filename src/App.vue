<template>
  <v-app>
    <v-navigation-drawer v-model="sideNav" temporary app>
      <v-list>
        <!-- list item -->
        <v-list-tile v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ item.title }}</v-list-tile-content>
        </v-list-tile>
        <!-- end -->
        <!-- Sign out -->
        <v-list-tile v-if="signedIn" @click="signOutUser">
          <v-list-tile-action>
            <v-icon>face</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>登出</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar class="primary nav" dark flat>
      <v-toolbar-side-icon class="hidden-md-and-up" @click.stop="sideNav = !sideNav"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/home" tag="span" style="cursor: pointer">{{ siteName }}</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- Topbar Menu Buttons -->
      <v-btn class="hidden-sm-and-down" v-for="item in menuItems" :key="item.title" router :to="item.link" flat>
        <v-icon left>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-btn>
      <v-btn class="hidden-sm-and-down" flat v-show="notificationCount > 0" v-if="signedIn" to="/profile/dashboard">
        <v-icon small left>fas fa-bell</v-icon>
        {{ notificationCount }}
      </v-btn>
      <v-btn class="hidden-sm-and-down" v-if="signedIn" flat @click="signOutUser">
        <v-icon left>face</v-icon>
        登出
      </v-btn>
    </v-toolbar>

    <v-content>
      <loader v-if="loading"></loader>
      <router-view/>
    </v-content>

    
    <popUp></popUp>

  </v-app>
</template>

<script>
/* eslint-disable */ 
// import * as firebase from 'firebase'
import loader from '@/components/common/loader'
import popUp from '@/components/common/popup'

export default {
  name: 'App',
  components: {
    loader,
    popUp
  },
  data () {
    return {
      sideNav: false,
    }
  },
  methods: {
    signOutUser () {
      this.$store.dispatch('signOutUser')
        .then(() => {
          this.$router.push('/signin')
        })
    }
  },
  computed: {
    siteName () {
      return this.$store.state.siteName
    },
    menuItems () {
      return this.$store.getters.menuItems
    },
    signedIn () {
      return this.$store.state.userModule.user !== null
    },
    loading () {
      return this.$store.state.loading
    },
    notificationCount () {
      let notifications = this.$store.state.userModule.notifications,
          count = 0

      for (let key in notifications) {
        count += notifications[key].length
      }
      return count
    },
    showNotificationCount () {
      return this.notificationCount > 0
    },
  },
  created () {
    this.$store.dispatch('initUserWatch')
  }
}
</script>
<style lang="scss">

</style>
