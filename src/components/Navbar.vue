<template>
  <div>
    <v-navigation-drawer v-model="showSideNav" temporary app>
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

    <v-toolbar id="nav-cus" dark flat>
      <v-toolbar-side-icon class="hidden-md-and-up" @click.stop="showSideNav = !showSideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="nav-title" :class="isMobile ? 'center-on-mobile' : ''">
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

      <!-- Avatar -->
      <Avatar class="nav-avatar" :user="user" :showName="false" v-show="hasAvatar"></Avatar>
    </v-toolbar>
  </div>
</template>

<script>
/* eslint-disable */ 
import Avatar from '@/components/common/avatar'

export default {
  components: {
    Avatar
  },

  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      showSideNav: false
    }
  },

  computed: {
    siteName () {
      return this.$store.state.siteName
    },
    menuItems () {
      return this.$store.getters.menuItems
    },
    user () {
      return this.$store.state.userModule.user_ref
    },
    hasAvatar () {
      if (this.user) {
        return this.user.photoURL || false
      }
    },
    signedIn () {
      return this.$store.state.userModule.user !== null
    },
    notificationCount () {
      let notifications = this.$store.state.userModule.notifications,
          count = 0

      for (let key in notifications) {
        count += notifications[key].length
      }
      return count
    },
  },

  methods: {
    signOutUser () {
      this.$store.dispatch('signOutUser')
        .then(() => {
          this.$router.push('/signin')
        })
    },
  }
}
</script>


<style lang="scss">
#nav-cus {
  position: fixed;
  background-image: linear-gradient(to left, #7167D5, #53A0FD);
  z-index: 4;

  .nav-title {
    position: relative;

    &.center-on-mobile {
      position: absolute;
      margin: 0 !important;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .nav-avatar {
    position: relative;
    margin-right: 17px;
    width: 35px;

    .member-avatar {
      width: 35px;
      height: 35px;
      margin: 0 !important;
    }
  }
}
</style>

