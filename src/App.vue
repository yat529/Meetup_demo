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
          <v-list-tile-content>Sign Out</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar class="primary nav" dark flat>
      <v-toolbar-side-icon class="hidden-md-and-up" @click.stop="sideNav = !sideNav"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/home" tag="span" style="cursor: pointer">{{ title }}</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- Topbar Menu Buttons -->
      <v-btn class="hidden-sm-and-down" v-for="item in menuItems" :key="item.title" router :to="item.link" flat>
        <v-icon left>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-btn>
      <v-btn class="hidden-sm-and-down" v-if="signedIn" flat @click="signOutUser">
        <v-icon left>face</v-icon>
        Sign out
      </v-btn>
    </v-toolbar>

    <v-content>
      <loader v-if="loading"></loader>
      <!-- <keep-alive> -->
        <router-view/>
      <!-- </keep-alive> -->
      
    </v-content>

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
    signOutUser () {
      this.$store.dispatch('signOutUser')
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
      return this.$store.state.userModule.user !== null
    },
    loading () {
      return this.$store.state.loading
    }
  },
  created () {
    this.$store.dispatch('watchUser')
  }
}
</script>
<style lang="scss">
</style>
