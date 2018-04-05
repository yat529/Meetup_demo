<template>
  <v-container class="meetups" v-if="user">
    <v-layout justify-center>
      <h1 class="primary--text mt-3 mb-1"><span style="margin-right: 5px">Hi,</span>{{ user.nickname }}</h1>
    </v-layout>
    <v-layout justify-center>
      <div class="avatar mb-3" :style="getUserAvatar"></div>
    </v-layout>
    <h3 class="title mt-3 mb-3 primary--text">我的仪表盘</h3>
    <DashBoard :created="createdMeetups" :registered="registeredMeetups"></DashBoard>
    <!-- <v-container>
      <v-layout class="dash-content mt-5" row wrap justify-center align-center>
        <div v-show="dashbord === 1">
          <h3>{{ userNotifications.newFriend.length ? '好友申请' : '没有新的好友申请'}}</h3>
          <div class="request-list">
            <UserAvatar class="seats" :user="request.from" v-for="(request, index) in userNotifications.newFriend" :key="index"></UserAvatar>
          </div>
        </div>
        <v-container px-0 py-0 v-show="dashbord === 2">
          <h3 class="text-xs-center">{{ newMemberRequestCount ? '成员申请' : '没有新的成员申请'}}</h3>
          <v-layout class="mt-4">
            <v-flex v-for="(meetup, key) in userNotifications.newMember" :key="key">
              <v-layout row wrap>
                <v-flex xs12 md6>
                  <v-card class="request-card" flat>
                    <v-card-media :src="getMeetupImage(key)" height="200px"></v-card-media>
                    <v-card-title primary-title>ASD</v-card-title>
                  </v-card>
                </v-flex>
                <v-flex xs12 md6>
                  <v-layout justify-center align-center>
                    <UserAvatar :user="new_member" :meetupKey="key" v-for="(new_member, index) in meetup" :key="index"></UserAvatar>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-layout>
    </v-container> -->

    <h3 class="title mt-3 mb-3 primary--text">我发起的MEETUP</h3>
    <v-layout row class="mb-5">
      <v-container class="placeholder mt-4" v-if="!createdMeetups.length">
        <v-layout justify-center align-center fill-height>
          <v-btn flat large color="primary" @click="redirectToCreate">发起新的Meetup</v-btn>
        </v-layout>
      </v-container>
      <CardCarousel :cards="createdMeetups" :hasPlaceholder="true" phText="发起新的Meetup" v-on:redirect="redirectToCreate"></CardCarousel>
    </v-layout>

    <h3 class="title mb-3 primary--text">我加入的MEETUP</h3>
    <v-layout row class="mb-5">
      <v-container class="placeholder mt-4" v-if="!registeredMeetups.length">
        <v-layout justify-center align-center fill-height>
          <v-btn flat large color="primary" @click="redirectToMeetups">加入一个MEETUP</v-btn>
        </v-layout>
      </v-container>
      <CardCarousel :cards="registeredMeetups" :hasPlaceholder="true" phText="加入新的MEETUP" v-on:redirect="redirectToMeetups"></CardCarousel>
    </v-layout>

  </v-container>
</template>
<script>
/* eslint-disable */
import * as firebase from 'firebase'
import DashBoard from './dashboard'
import UserAvatar from '@/components/common/avatar'
// import Seats from '@/components/common/seats'
import CardButton from '@/components/common/button'
import CardCarousel from '@/components/common/cardCarousel'

export default {
  components: {
    DashBoard,
    UserAvatar,
    CardButton,
    CardCarousel
  },
  data () {
    return {
      // user: {},
      createdMeetups: [],
      registeredMeetups: []
    }
  },
  methods: {
    redirectToCreate () {
      this.$router.push('/addmeetup')
    },
    redirectToMeetups () {
      this.$router.push('/meetups')
    },
    deleteMeetup (item) {
      this.$store.dispatch('deleteMeetup', item)
    },
    isUserRegistered (item) {
      if (!this.$store.state.userModule.user) return false
      if (!item.registeredMembers) return false
      let uid = this.$store.state.userModule.user.uid
      return Object.keys(item.registeredMembers).find(key => {
        return key === uid
      }) ?
      true :
      false
    },
    // getMeetupImage (meetup_key) {
    //   if (this.createdMeetups) {
    //     let match = this.createdMeetups.find(meetup => {
    //       return meetup.key === meetup_key
    //     })
        
    //     if (match) {
    //       return match.imageURLs[Object.keys(match.imageURLs)[0]]
    //     }
    //   }
    // }
  },
  computed: {
    user () {
      return this.$store.state.userModule.user_ref
    },
    getUserAvatar () {
      return `background-image: url("${ this.user.photoURL }")`
    },
    
  },
  created () {
    this.$store.dispatch('fetchUserMeetups', this.user)
    .then(userMeetups => {
      this.createdMeetups = userMeetups.created
      this.registeredMeetups = userMeetups.registered
    })
  }
}
</script>
<style lang="scss">
.meetups {
  .card-wrapper {
    width: 288px;
    margin: 20px;
    border-radius: 15px !important;
  }

  .card-item {
    position: relative;
    box-shadow: 0 5px 15px -11px rgba(0, 0, 0, 0.4);
    border-radius: 15px !important;
  }

  .date-wrapper {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 70px;
    border-radius: 10px;
    overflow: hidden;
    z-index: 2;
    
    .date,
    .day {
      width: 70px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      text-align: center;
    }

    .date {
      background: #fff;
    }

    .day {
      background: #000000;
      color: #fff;
      font-size: 12px;
    }
  }

  .card-item-image {
    border-radius: 15px 15px 0 0 !important;
  }

  .info_name,
  .info_desc {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }

  .info_name {
    height: 50px;
    font-size: 1.2rem;
    -webkit-line-clamp: 2;
  }

  .info_desc {
    height: 60px;
    font-size: 1rem;
    line-height: 20px;
    -webkit-line-clamp: 3;
  } 

  .avatar {
    width: 65px;
    height: 65px;
    border: 4px solid #fff;
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
}



//   .request-list {
//     display: block;
//     position: relative;
//     width: 100%;
// //   }
// // }

// .request-card {
//   border-radius: 15px;
//   box-shadow: 0 5px 15px -11px rgba(0, 0, 0, 0.4);
// }

</style>
