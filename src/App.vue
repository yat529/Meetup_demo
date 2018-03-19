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
      </v-list>
    </v-navigation-drawer>

    <v-toolbar class="primary" dark>
      <v-toolbar-side-icon class="hidden-md-and-up" @click.stop="sideNav = !sideNav"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">{{ title }}</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- Topbar Menu Buttons -->
      <v-btn class="hidden-sm-and-down" v-for="item in menuItems" :key="item.title" router :to="item.link" flat>
        <v-icon left>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-btn>
      <v-btn class="hidden-sm-and-down" v-if="signedIn" flat @click="signOut">
        <v-icon left>face</v-icon>
        Sign out
      </v-btn>
    </v-toolbar>

    <v-content>
      <loader v-if="loading"></loader>
      <router-view/>
    </v-content>

    <!-- <v-footer app class="primary" dark>
      <v-layout row class="text-xs-center">
        <v-flex >
          <span>Meetup &copy; 2017</span>
        </v-flex>
      </v-layout>
    </v-footer> -->
  </v-app>
</template>

<script>
// import * as firebase from 'firebase'
import loader from '@/components/common/loader'

export default {
  name: 'App',
  components: {
    loader
  },
  data () {
    return {
      sideNav: false,
      title: 'MeetUp'
    }
  },
  methods: {
    signOut () {
      this.$store.dispatch('onUserSignOut')
        .then(() => {
          this.$router.push('/signin')
        })
    }
  },
  computed: {
    menuItems () {
      return this.$store.getters.menuItems
    },
    signedIn () {
      return this.$store.state.user !== null
    },
    loading () {
      return this.$store.state.loading
    }
  },
  created () {
    // firebase.auth().onAuthStateChanged(user => {
    //   if (user) {
    //     this.$store.dispatch('logUserIn', user)
    //   }
    // })
    // this.$store.dispatch('loadMeetups')
    this.$store.dispatch('initPage')
  }
}
</script>
<style lang="scss">

</style>
