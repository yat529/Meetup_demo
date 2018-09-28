<template>
  <v-container v-if="user">
    <v-layout justify-center mb-2>
      <h1 class="primary--text title"><span style="margin-right: 5px">哈啰,</span>{{ user.nickname }}</h1>
    </v-layout>
    <v-layout justify-center mb-0>
      <div class="avatar mb-3" :style="getUserAvatar"></div>
    </v-layout>

    <!-- tabs -->
    <v-layout row wrap justify-center mb-3 v-if="!isMobile">
      <v-badge overlap v-model="showNotificationCount">
        <span slot="badge">{{ notificationCount }}</span>
        <v-btn flat large round dark color="primary" to="/profile/dashboard">消息中心</v-btn>
      </v-badge>
      <v-btn flat large round dark color="primary" to="/profile/friends">朋友列表</v-btn>
      <v-btn flat large round dark color="primary" to="/profile/meetups">我的小组</v-btn>
    </v-layout>

    <v-layout row wrap justify-center mb-3 v-else>
      <v-badge overlap v-model="showNotificationCount">
        <span slot="badge">{{ notificationCount }}</span>
        <v-btn flat round dark color="primary" to="/profile/dashboard">消息</v-btn>
      </v-badge>
      <v-btn flat round dark color="primary" to="/profile/friends">朋友</v-btn>
      <v-btn flat round dark color="primary" to="/profile/meetups">小组</v-btn>
    </v-layout>

    <transition name="slide" mode="out-in">
    <router-view :isMobile="isMobile"></router-view>
    </transition>

  </v-container>
</template>
<script>
/* eslint-disable */
import * as firebase from 'firebase'

export default {
  components: {
    // 
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 
    }
  },
  methods: {
    // 
  },
  computed: {
    user () {
      return this.$store.state.userModule.user_ref
    },
    getUserAvatar () {
      return `background-image: url("${ this.user.photoURL }")`
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
  // watch: {
  //   user (newVal, oldVal) {
  //     if (newVal) {
  //       if (!newVal.nickname) {
  //         this.$router.push('/profile/init')
  //       }
  //     }
  //   }
  // },
  created () {
    this.$store.dispatch('watchFriendList', this.user)
  }
}
</script>
<style lang="scss">
// .meetups {
//   .card-wrapper {
//     width: 288px;
//     margin: 20px;
//     border-radius: 15px !important;
//   }

//   .card-item {
//     position: relative;
//     box-shadow: 0 5px 15px -11px rgba(0, 0, 0, 0.4);
//     border-radius: 15px !important;
//   }

//   .date-wrapper {
//     position: absolute;
//     top: 10px;
//     left: 10px;
//     width: 70px;
//     border-radius: 10px;
//     overflow: hidden;
//     z-index: 2;
    
//     .date,
//     .day {
//       width: 70px;
//       height: 20px;
//       line-height: 20px;
//       font-size: 12px;
//       text-align: center;
//     }

//     .date {
//       background: #fff;
//     }

//     .day {
//       background: #000000;
//       color: #fff;
//       font-size: 12px;
//     }
//   }

//   .card-item-image {
//     border-radius: 15px 15px 0 0 !important;
//   }

//   .info_name,
//   .info_desc {
//     overflow: hidden;
//     display: -webkit-box;
//     -webkit-box-orient: vertical;
//   }

//   .info_name {
//     height: 50px;
//     font-size: 1.2rem;
//     -webkit-line-clamp: 2;
//   }

//   .info_desc {
//     height: 60px;
//     font-size: 1rem;
//     line-height: 20px;
//     -webkit-line-clamp: 3;
//   } 

//   .avatar {
//     width: 65px;
//     height: 65px;
//     border: 4px solid #fff;
//     border-radius: 50%;
//     background-position: center;
//     background-size: cover;
//     box-shadow: 0 1px 10px -6px rgba(0, 0, 0, 0.5)
//   }
//   .placeholder {
//     height: 400px;
//     background: #eeeeee;
//     border-radius: 15px;
//   }
// }

.avatar {
  width: 65px;
  height: 65px;
  border: 2px solid #eeeeee;
  border-radius: 50%;
  background-position: center;
  background-size: cover;
  box-shadow: 0 1px 10px -6px rgba(0, 0, 0, 0.5)
}

.placeholder {
  height: 400px;
  background: #eeeeee;
  border-radius: 15px;
}

</style>
