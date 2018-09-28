<template>
  <v-container class="user-public-page" mt-4 v-if="targetUser.uid">
    <v-layout class="user-information-wrapper" row wrap justify-center>
      <div class="user-photo mr-5" :style="userAvatarBg"></div>
      <v-flex xs6>
        <div class="user-name primary--text mb-2">
          {{ targetUser.nickname }}
          <div class="user-sex">
            <i class="fas fa-mars" :class="targetUser.sex === 'male' ? 'blue--text' : ''" v-if="targetUser.sex === 'male'"></i>
            <i class="fas fa-venus" :class="targetUser.sex === 'female' ? 'pink--text' : ''" v-else-if="targetUser.sex === 'female'"></i>
          </div>
          <div class="user-badges"></div>
        </div>
        
        <div class="user-favorites-cates mb-2">
          <div class="item primary--text" v-for="(item, index) in favorite" :key="index">
            {{ item }}
          </div>
        </div>
        <div class="user-active-status"></div>
      </v-flex>
    </v-layout>
    <!-- tabs -->
    <v-layout mb-3 row wrap justify-center align-center>
      <v-btn flat large round dark color="primary" :class="tab === 1 ? 'btn--active' : ''" @click="tab = 1">
        参与的小组
      </v-btn>
      <v-btn flat large round dark color="primary" :class="tab === 2 ? 'btn--active' : ''" @click="tab = 2">
        发起的小组
      </v-btn>
      <v-btn flat large round dark color="primary" :class="tab === 3 ? 'btn--active' : ''" @click="tab = 3">
        朋友列表
      </v-btn>
    </v-layout>
    
    <!-- joined meetups -->
    <v-container px-0 py-0 v-if="tab === 1">
      <v-layout row>
        <v-container class="placeholder" v-if="!registeredMeetups.length">
          <v-layout justify-center align-center fill-height>
            <v-btn flat large color="primary">暂无参加的小组</v-btn>
          </v-layout>
        </v-container>
        <CardCarousel v-else
        :cards="registeredMeetups" 
        :hasPlaceholder="false"></CardCarousel>
      </v-layout>
    </v-container>
    <!-- created meetups -->
    <v-container px-0 py-0 v-if="tab === 2">
      <v-layout row>
        <v-container class="placeholder" v-if="!createdMeetups.length">
          <v-layout justify-center align-center fill-height>
            <v-btn flat large color="primary">暂时没有发起小组</v-btn>
          </v-layout>
        </v-container>
        <CardCarousel v-else
        :cards="createdMeetups" 
        :hasPlaceholder="false"></CardCarousel>
      </v-layout>
    </v-container>
    <!-- friends -->
    <v-container px-0 py-0 v-if="tab === 3">
      <UserCards :users="friends" v-if="friends.length"
      :showRedirectAndAddFriend="true"></UserCards>
      <v-layout class="placeholder" justify-center align-center fill-height v-else>
        <v-btn flat large color="primary">暂无好友</v-btn>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
/* eslint-disable */
// import CardCarousel from '@/components/common/cardCarousel'
// import UserCards from '@/components/common/userCards'

export default {
  // components: {
  //   CardCarousel,
  //   UserCards
  // },
  
  data () {
    return {
      target_uid: '',
      targetUser: {},
      currUser: {},
      friends: [],
      registeredMeetups: [],
      createdMeetups: [],
      favorite: ['美食', '电影', '旅行'],
      tab: 1
    }
  },
  computed: {
    userAvatarBg () {
      return `background-image: url("${ this.targetUser.photoURL }")`
    },
  },
  methods: {
    // 
  },
  watch: {
    currUser (newVal, oldVal) {
      console.log('user obj updated', newVal)
    }
  },
  created () {
    this.target_uid = this.$route.params.id    
    this.currUser = this.$store.state.userModule.user_ref

    this.$store.dispatch('fetchUser', this.target_uid)
    .then(user_snap => {
      this.targetUser = user_snap

      let registeredMeetups = this.targetUser.registeredMeetups,
          createdMeetups = this.targetUser.createdMeetups,
          friends = this.targetUser.friends

      if (registeredMeetups) {
        for(let key in registeredMeetups) {
          this.$store.dispatch('fetchMeetup', key)
          .then(meetup => {
            meetup.key = key
            this.registeredMeetups.push(meetup)
          })
        }
      }
      else if (createdMeetups) {
        for(let key in createdMeetups) {
          this.$store.dispatch('fetchMeetup', key)
          .then(meetup => {
            meetup.key = key
            this.createdMeetups.push(meetup)
          })
        }
      }
      
      if (friends) {
        for(let key in friends) {
          this.$store.dispatch('fetchUser', key)
          .then(user => {
            this.friends.push(user)
          })
        }
      }
    })
  }
}
</script>


<style lang="scss">
.user-public-page {

  .user-information-wrapper {
    padding: 15px 25px;
    margin-bottom: 15px;
  }

  .placeholder {
    width: 100%;
    height: 250px;
    border-radius: 15px;
    background: #eeeeee;
  }

  .user-photo {
    width: 120px;
    height: 120px;
    border: 5px solid #ffffff;
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    box-shadow: 0 2px 15px -8px rgba(0, 0, 0, 0.4);
  }

  .user-name {
    font-size: 23px;
    font-weight: 500;

    .user-sex {
      display: inline-block;
      margin-left: 10px;
      font-size: 23px;
    }
  }

  .user-favorites-cates {
    overflow: hidden;

    .item {
      display: inline-block;
      padding: 2px 10px;
      margin-right: 15px;
      margin-bottom: 15px;
      border-radius: 10px;
      font-size: 13px;
      background: #eeeeee;
    }
  }
}
</style>
