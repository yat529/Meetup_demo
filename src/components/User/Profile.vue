<template>
  <v-container class="meetups" v-if="user">
    <v-layout justify-center>
      <h1 class="primary--text mt-3 mb-1"><span style="margin-right: 5px">Hi,</span>{{ user.nickname }}</h1>
    </v-layout>
    <v-layout justify-center>
      <div class="avatar mb-3" :style="getUserAvatar"></div>
    </v-layout>
    <h3 class="title mt-3 mb-3 primary--text">My Dashboard</h3>
    <v-layout row wrap class="mb-5">
      <v-layout class="placeholder" justify-center align-center>
        <v-flex xs4 px-3></v-flex>
        <v-flex xs4 px-3></v-flex>
        <v-flex xs4 px-3></v-flex>
      </v-layout>
    </v-layout>
    <h3 class="title mt-3 mb-3 primary--text">我发起的MEETUP</h3>
    <v-layout row class="mb-5">
      <v-container class="placeholder" v-if="!createdMeetups.length">
        <v-layout justify-center align-center fill-height>
          <v-btn flat large color="primary" @click="redirectToCreate">发起新的Meetup</v-btn>
        </v-layout>
      </v-container>
      <div v-for="item in createdMeetups" :key="item.key" class="card-wrapper">
          <v-card flat class="card-item">
            <!-- <div class="date-wrapper">
              <div class="date">
                {{ getMonth(item) }} {{ getDate(item) }}
              </div>
              <div class="day">{{ getDay(item) }}</div>
            </div> -->
            
            <v-card-media :src="getImgUrl(item)" height="200px" class="card-item-image">
            </v-card-media>
            <v-card-title primary-title class="pb-1">
              <h3 class="mb-1 primary--text info_name">{{ item.title }}</h3>
            </v-card-title>
            <v-card-text class="pt-0">
              <div class="info_desc">{{ item.description }}</div>
            </v-card-text>

            <CardButton :item="item" :showDelete="false" :initState="isUserRegistered(item)"
            v-on:register="registerMeetup(item)" 
            v-on:unregister="unregisterMeetup(item)" 
            v-on:more="loadMeetup(item)"
            ></CardButton>
          </v-card>
      </div>
      <div class="card-wrapper" v-if="registeredMeetups.length">
        <v-card flat height="410px" class="card-item">
          <v-layout justify-center align-center fill-height>
            <v-btn flat large color="primary" @click="redirectToMeetups">
              <v-icon dark left>add_circle_outline</v-icon>
              发起新的Meetup
            </v-btn>
          </v-layout>
        </v-card>
      </div>
    </v-layout>

    <h3 class="title mb-3 primary--text">我加入的MEETUP</h3>
    <v-layout row class="mb-5">
      <v-container class="placeholder" v-if="!registeredMeetups.length">
        <v-layout justify-center align-center fill-height>
          <v-btn flat large color="primary" @click="redirectToMeetups">加入一个MEETUP</v-btn>
        </v-layout>
      </v-container>
      <div v-for="item in registeredMeetups" :key="item.key" class="card-wrapper">
          <v-card flat class="card-item">
            <!-- <div class="date-wrapper">
              <div class="date">
                {{ getMonth(item) }} {{ getDate(item) }}
              </div>
              <div class="day">{{ getDay(item) }}</div>
            </div> -->
            
            <v-card-media :src="getImgUrl(item)" height="200px" class="card-item-image">
            </v-card-media>
            <v-card-title primary-title class="pb-1">
              <h3 class="mb-1 primary--text info_name">{{ item.title }}</h3>
            </v-card-title>
            <v-card-text class="pt-0">
              <div class="info_desc">{{ item.description }}</div>
            </v-card-text>

            <CardButton :item="item" :showDelete="false" :initState="isUserRegistered(item)"
            v-on:register="registerMeetup(item)" 
            v-on:unregister="unregisterMeetup(item)" 
            v-on:more="loadMeetup(item)"
            ></CardButton>
          </v-card>
      </div>
      <div class="card-wrapper" v-if="registeredMeetups.length">
        <v-card flat height="410px" class="card-item">
          <v-layout justify-center align-center fill-height>
            <v-btn flat large color="primary" @click="redirectToMeetups">
              <v-icon dark left>add_circle_outline</v-icon>
              加入其它
            </v-btn>
          </v-layout>
        </v-card>
      </div>
    </v-layout>

  </v-container>
</template>
<script>
/* eslint-disable */
import * as firebase from 'firebase'
import CardButton from '@/components/common/button'
export default {
  components: {
    CardButton
  },
  data () {
    return {
      createdMeetups: {},
      registeredMeetups: {}
    }
  },
  methods: {
    // unregisterMeetup (item) {
      //   this.$store.dispatch('unregisterMeetup', item)
    // },
    // loadMeetup (item) {
      //   this.$store.commit('loadMeetup', item)
    //   this.$router.push('/meetup/' + item.key)
    // },
    redirectToCreate () {
      this.$router.push('/addmeetup')
    },
    redirectToMeetups () {
      this.$router.push('/meetups')
    },
    loadMeetup (item) {
      this.$router.push('/meetup/' + item.key)
    },
    registerMeetup (item) {
      if (this.$store.state.userModule.user) {
        this.$store.dispatch('registerMeetup', item)
      } else {
        this.$router.push('/signin')
      }
    },
    unregisterMeetup (item) {
      this.$store.dispatch('unregisterMeetup', item)
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
    getImgUrl (item) {
      return item.imageURLs[Object.keys(item.imageURLs)[0]]
    },
    getMonth (item) {
      const Month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
      let index = new Date(item.date).getMonth()
      return Month[index]
    },
    getDate (item) {
      return new Date(item.date).getDate() + 1
    },
    getDay (item) {
      // const Day = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
      const Day = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
      let index = new Date(item.date).getDay()
      // let index = new Date('2018-04-01').getDay()
      console.log(index)
      return Day[index]
    }
  },
  computed: {
    user () {
      return this.$store.state.userModule.user_ref
    },
    getUserAvatar () {
      return `background-image: url("${ this.user.photoURL }")`
    }
  },
  mounted () {
    if (this.user) {
      this.$store.dispatch('fetchUserMeetups', this.user)
      .then(userMeetups => {
        this.createdMeetups = userMeetups.created
        this.registeredMeetups = userMeetups.registered
      })
    }
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
    height: 200px;
    background: #eeeeee;
  }
}
</style>
