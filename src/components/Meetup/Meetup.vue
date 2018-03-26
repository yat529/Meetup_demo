<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 class="meetup" v-if="item">
        <v-card>
          <!-- toolbar header -->
          <v-toolbar dark color="" flat>
            <v-toolbar-title class="">{{ item.title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn flat>
              <v-icon left>schedule</v-icon>
              {{ item.date | DateFilter }}
            </v-btn>
            <v-btn icon>
              <v-icon>supervisor_account</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>more_vert</v-icon>
            </v-btn>
          </v-toolbar>
          <!-- image -->
          <v-card-media :src="item.imageUrl" height="500px" class="mb-3">
          </v-card-media>
          <!-- card body -->
          <v-layout row class="orgnizer px-2 py-2 mb-3">
            <v-flex xs12 sm2 class="text-xs-center" v-if="item.organizer">
              <div class="avatar" :style="avatarBgUrl"></div>
              <p class="primary--text">{{ item.organizer.nickname }}</p>
            </v-flex>
            <v-flex xs12 sm10>
              <h3 class="primary--text">Information</h3>
              <p>{{ item.description }}</p>
            </v-flex>
          </v-layout>

          <v-layout row class="seats px-2 py-2 mb-3">
            <v-flex xs12 sm2 class="text-xs-center">
              <h3 class="primary--text mb-1">Followers</h3>
            </v-flex>
            <v-flex xs12 sm10>
              <!-- <div class="seat" v-for="member in item.registeredMembers" :key="member.uid">
                <div class="avatar" :style="getAvatarBgUrl(member)"></div>
                <p class="member-name">{{ member.nickname }}</p>
              </div> -->
              <Seats :group="item.registeredMembers" :max="5"></Seats>
            </v-flex>
          </v-layout>

          <v-layout row class="location px-2 py-2 mb-3">
            <v-flex xs12 sm2 class="text-xs-center">
              <h3 class="primary--text mb-1">Location</h3>
            </v-flex>
            <v-flex xs12 sm10>
              <div class="map">
                <loadLocationMap :item="item"></loadLocationMap>
              </div>
            </v-flex>
          </v-layout>

          <v-layout row class="otherinfo px-2 py-2 mb-3">
            <v-flex xs12 sm2 class="text-xs-center">
              <h3 class="primary--text mb-1">More Info</h3>
            </v-flex>
            <v-flex xs12 sm10>
              <p>{{ item.otherInfo }}</p>
            </v-flex>
          </v-layout>

          <v-layout row class="px-2 py-2">
            <v-flex>
              <CardButton :item="item" v-on:register="registerMeetup(item)" v-on:unregister="unregisterMeetup(item)" v-on:remove="deleteMeetup(item)" v-on:close="closeMeetup" :noMore="true" :showDelete="true"></CardButton>
            </v-flex>
          </v-layout>
          
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
/* eslint-disable */
import * as firebase from 'firebase'
import Seats from '@/components/common/seats'
import CardButton from '@/components/common/button'
import loadLocationMap from '@/components/common/loadLocation'

export default {
  components: {
    Seats,
    CardButton,
    loadLocationMap
  },
  data() {
    return {
      otherInfo: '',
    }
  },
  methods: {
    registerMeetup (item) {
      this.$store.dispatch('registerMeetup', item)
        .then(() => {
          this.item = this.$store.state.loadedMeetup
          this.$forceUpdate()
        })
    },
    unregisterMeetup (item) {
      this.$store.dispatch('unregisterMeetup', item)
        .then(() => {
          this.item = this.$store.state.loadedMeetup
          this.$forceUpdate()
        })
      // console.log(item)
    },
    closeMeetup () {
      this.$router.go(-1)
      // this.$store.commit('clearLoadedMeetUp')
    },
    editMeetup (item) {},
    deleteMeetup (item) {
      this.$store.dispatch('deleteMeetup', item)
      .then(() => {
        this.closeMeetup()
      })
    }
  },
  computed: {
    avatarBgUrl () {
      if (!this.item || !this.item.organizer) return false
      let avatarUrl = this.item.organizer.avatar
      return `background-image: url("${ avatarUrl }")`
    },
    item () {
      // cache loadedMeetup
      let key = this.$route.params.id
      let item = this.$store.state.loadedMeetups.find(meetup => meetup.key === key)

      if (!item) {
        // load from firebase
        firebase.database().ref('meetups').child(key).once('value')
        .then(snapshot => {
          item = snapshot.val()
          this.$store.commit('formatMeetup', item)
        })
      } else {
        this.$store.commit('loadMeetup', item)
      }

      return item
    }
  },
  created () {
    // cache loadedMeetup
    // let key = this.$route.params.id
    // let item = this.$store.state.loadedMeetups.find(meetup => meetup.key === key)

    // if (!item) {
    //   // load from firebase
    //   firebase.database().ref('meetups').child(key).once('value')
    //   .then(snapshot => {
    //     let meetup = snapshot.val()
    //     this.$store.commit('formatMeetup', meetup)
    //     this.item = this.$store.state.loadedMeetup
    //   })
    // } else {
    //   this.$store.commit('loadMeetup', item)
    //   this.item = this.$store.state.loadedMeetup
    // }
  },
  destroyed () {
    // clear cache when closed
    this.$store.commit('clearLoadedMeetUp')
  }
}
</script>
<style lang="scss" scoped>
.meetup {
  .orgnizer {
    .avatar {
      display: inline-block;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 3px solid #eeeeee;
      background-position: center;
      background-size: cover;
    }
  }
  .location {
    .map {
      width: 100%;
      height: 300px;
      background: #eeeeee
    }
  }
}
</style>
