<template>
  <v-container fluid px-0 py-0>
    <v-layout row class="header" v-if="item.uid">
      <v-container px-4>
        <v-layout row wrap justify-center align-center>
          <v-flex xs12 md7>
            <div class="date-info">
              <div class="date">
                <v-icon class="icon">far fa-calendar-alt</v-icon>
                {{ item.date }}
              </div>
              <div class="time">
                <v-icon class="icon">far fa-clock</v-icon>
                {{ item.time }}
              </div>
            </div>
            <h1>{{ item.title }}</h1>
            <v-container class="user-info px-0 py-0">
              <v-layout>
                <div class="organizer">
                  <div class="avatar" :style="avatarBgUrl"></div>
                  <div class="name">{{ item.organizer.nickname }}</div>
                </div>
                <div class="status">
                  <CardButton :item="item" 
                    v-on:register="registerMeetup(item)" 
                    v-on:unregister="unregisterMeetup(item)" 
                    v-on:remove="deleteMeetup(item)"
                    :initState="isUserRegistered(item)"
                    :noMore="true" :showDelete="true" :showClose="false"></CardButton>
                </div>
              </v-layout>
            </v-container>
          </v-flex>
          <v-flex xs12 md5>
            <!-- <div>          
              <div class="address">{{item.location.address}}</div>
              <div class="map">
                <loadLocationMap :item="item"></loadLocationMap>
              </div>
            </div> -->
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 class="meetup" v-if="item.uid">
        <v-card flat>
          <!-- image -->
          <v-card-media :src="getImgUrl(item)" height="500px" class="mb-3">
          </v-card-media>
          <!-- card body -->
          <v-container>
            <v-layout row class="orgnizer px-2 py-2 mb-3">
              <v-flex xs12 sm2 class="text-xs-center">
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
                <Seats :group="item.registeredMembers" :max="item.size"></Seats>
              </v-flex>
            </v-layout>

            <!-- <v-layout row class="location px-2 py-2 mb-3">
              <v-flex xs12 sm2 class="text-xs-center">
                <h3 class="primary--text mb-1">Location</h3>
              </v-flex>
              <v-flex xs12 sm10>
                <div class="map">
                  <loadLocationMap :item="item"></loadLocationMap>
                </div>
              </v-flex>
            </v-layout> -->

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
                <!-- <CardButton :item="item" 
                v-on:register="registerMeetup(item)" 
                v-on:unregister="unregisterMeetup(item)" 
                v-on:remove="deleteMeetup(item)" 
                v-on:close="closeMeetup" 
                :noMore="true" :showDelete="true"></CardButton> -->
              </v-flex>
            </v-layout>
          </v-container>
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
      item: {},
      otherInfo: '',
    }
  },
  methods: {
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
    closeMeetup () {
      this.$router.go(-1)
    },
    editMeetup (item) {},
    deleteMeetup (item) {
      this.$store.dispatch('deleteMeetup', item)
      .then(() => {
        this.closeMeetup()
      })
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
  },
  computed: {
    avatarBgUrl () {
      let photoURL = this.item.organizer.photoURL
      return `background-image: url("${ photoURL }")`
    }
  },
  created () {
    // cache loadedMeetup
    let key = this.$route.params.id
    this.$store.dispatch('fetchMeetup', key)
    .then(snapshot => {
      this.item = snapshot
      this.item.key = key
      console.log(this.item)
    })

  }
}
</script>
<style lang="scss" scoped>
.header {
  position: relative;
  width: 100%;
  height: 400px;
  background: rgba(255, 255, 255, 0.5);
  border-top: 1px solid #ffffff;

  h1 {
    margin-bottom: 20px;
  }

  .date-info {
    margin-bottom: 15px;
    overflow: hidden;

    .date,
    .time {
      display: inline-block;
      padding: 10px 15px 10px 0;
      margin-right: 10px;
      line-height: 25px;
      font-size: 18px;

      .icon {
        display: inline-block;
        margin-right: 10px;
        line-height: 25px;
        vertical-align: top;
      }
    }
  }

  .user-info {
    .organizer {
      position: relative;
      text-align: center;
      overflow: hidden;

      .avatar {
        float: left;
        position: relative;
        margin-right: 10px;
        margin: 0;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 3px solid #eeeeee;
        background-position: center;
        background-size: cover;
        vertical-align: top;
      }

      .name {
        float: left;
        position: relative;
        padding: 0 15px;
        margin: 0 15px 0 0;
        height: 30px;
        line-height: 30px;
        font-size: 15px;
        font-weight: bold;
        vertical-align: top;
        
        &::after {
          content: "发起人";
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: 30px;
          line-height: 30px;
          font-size: 13px;
          font-weight: normal;
        }
      }
    }
    .status {
      align-self: center;
    }
  }

  .address-info {
    position: relative;

    .address {
      padding: 5px 10px;
    }

    .map {
      position: relative;
      height: 300px;
    }
  }
}

</style>
