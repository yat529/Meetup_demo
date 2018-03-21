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
            <v-flex xs12 sm2 class="text-xs-center">
              <div class="avatar" :style="avatarBgUrl"></div>
              <p class="primary--text">{{ organizer.nickname }}</p>
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
              <div class="seat" v-for="member in item.registeredMembers" :key="member.uid">
                <div class="avatar" :style="getAvatarBgUrl(member)"></div>
                <p class="member-name">{{ member.nickname }}</p>
              </div>
            </v-flex>
          </v-layout>

          <v-layout row class="location px-2 py-2 mb-3">
            <v-flex xs12 sm2 class="text-xs-center">
              <h3 class="primary--text mb-1">Location</h3>
            </v-flex>
            <v-flex xs12 sm10>
              <div class="map"></div>
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
              <v-btn flat color="orange" v-if="registered" @click="unregisterMeetup(item)">Unregistered</v-btn>
              <v-btn flat color="orange" v-if="!registered&&!isOrganizer" @click="registerMeetup(item)">Join</v-btn>
              <v-btn flat color="orange" v-if="isOrganizer" @click="editMeetup(item)">Edit</v-btn>
              <v-btn flat color="orange" v-if="isOrganizer" @click="deleteMeetup(item)">Delete</v-btn>
              <v-btn flat color="orange" @click="closeMeetup()">Close</v-btn>
            </v-flex>
          </v-layout>
          
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {
      location: '',
      otherInfo: '',
    }
  },
  methods: {
    registerMeetup (item) {
      this.$store.dispatch('registerMeetup', item)
    },
    unregisterMeetup (item) {
      this.$store.dispatch('unregisterMeetup', item)
    },
    closeMeetup () {
      this.$router.go(-1)
      this.$store.commit('clearLoadedMeetUp')
    },
    editMeetup (item) {},
    deleteMeetup (item) {

    },
    getAvatarBgUrl (item) {
      let avatarUrl = item.avatar
      return `background-image: url("${ avatarUrl }")`
    }
  },
  computed: {
    item () {
      return this.$store.state.loadedMeetup
    },
    avatarBgUrl () {
      let avatarUrl = this.item.organizer.avatar
      return `background-image: url("${ avatarUrl }")`
    },
    organizer () {
      return this.item.organizer
    },
    registered () {
      let key = this.item.key
      return this.$store.state.user_basic.registeredMeetups[key]
    },
    isOrganizer () {
      return this.$store.state.user.uid === this.item.uid
    }
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

  .seats {
    overflow: hidden;
    .seat {
      float: left;
      margin-left: 15px;
      margin-bottom: 15px;

      .avatar {
        display: inline-block;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 3px solid #eeeeee;
        background-position: center;
        background-size: cover;
      }

      .member-name {
        text-align: center;
      }
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
