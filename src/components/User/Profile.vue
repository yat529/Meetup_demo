<template>
  <v-container class="meetups" v-if="user">
    <v-layout justify-center>
      <h1 class="primary--text mt-3 mb-1"><span style="margin-right: 5px">Hi,</span>{{ user.nickname }}</h1>
    </v-layout>
    <v-layout justify-center>
      <div class="avatar mb-3" :style="getUserAvatar"></div>
    </v-layout>
    <h3 class="title mt-3 mb-3 primary--text">My Meetups</h3>
    <v-layout row wrap class="mb-5">
      <v-layout class="placeholder" justify-center align-center v-if="!createdMeetups.length">
        <v-btn flat large color="primary" @click="redirectToCreate">Create a meetup</v-btn>
      </v-layout>
      <v-flex xs12 sm6 md4 xl3 v-for="item in createdMeetups" :key="item.id" class="px-2 py-2">
        <v-card>
          <v-card-media :src="item.imageUrl" height="200px">
          </v-card-media>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0 primary--text">{{ item.title }}</h3>
              <div class="mb-2">{{ item.date | DateFilter}}</div>
              <div class="content">{{ item.description }}</div>
            </div>
          </v-card-title>
          <!-- <v-card-actions>
            <v-btn flat color="orange" @click="loadMeetup(item)">Edit</v-btn>
            <v-btn flat color="orange" @click="deleteMeetup(item)">Delete</v-btn>
          </v-card-actions> -->
          <CardButton :item="item" v-on:edit="loadMeetup(item)" v-on:more="loadMeetup(item)"></CardButton>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 md4 xl3 v-if="createdMeetups.length < 3 && createdMeetups.length" class="px-2 py-2">
        <v-card flat height="418px">
          <v-layout justify-center align-center fill-height>
            <v-btn flat large color="primary" @click="redirectToCreate">
              <v-icon dark left>add_circle_outline</v-icon>
              add more
            </v-btn>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <h3 class="title mb-3 primary--text">My Registered Meetups</h3>
    <v-layout row wrap class="mb-5">
      <v-layout class="placeholder" justify-center align-center v-if="!registeredMeetups.length">
        <v-btn flat large color="primary" @click="redirectToMeetups">Register a meetup</v-btn>
      </v-layout>
      <v-flex xs12 sm6 md4 xl3 v-for="item in registeredMeetups" :key="item.id" class="px-2 py-2">
        <v-card>
          <v-card-media :src="item.imageUrl" height="200px">
          </v-card-media>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0 primary--text">{{ item.title }}</h3>
              <div class="mb-2">{{ item.date | DateFilter}}</div>
              <div class="content">{{ item.description }}</div>
            </div>
          </v-card-title>
          <!-- <v-card-actions>
            <v-btn flat color="orange" @click="loadMeetup(item)">more</v-btn>
            <v-btn flat color="orange" @click="unregisterMeetup(item)">Unregister</v-btn>
          </v-card-actions> -->
          <CardButton :item="item" v-on:unregister="unregisterMeetup(item)" v-on:more="loadMeetup(item)"></CardButton>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
/* eslint-disable */
import CardButton from '@/components/common/button'
export default {
  components: {
    CardButton
  },
  methods: {
    deleteMeetup (item) {
      this.$store.dispatch('deleteMeetup', item)
    },
    unregisterMeetup (item) {
      this.$store.dispatch('unregisterMeetup', item)
    },
    loadMeetup (item) {
      this.$store.commit('loadMeetup', item)
      this.$router.push('/meetup/' + item.key)
    },
    redirectToCreate () {
      this.$router.push('/addmeetup')
    },
    redirectToMeetups () {
      this.$router.push('/meetups')
    }
  },
  computed: {
    createdMeetups () {
      return this.$store.state.createdMeetups
    },
    registeredMeetups () {
      return this.$store.state.registeredMeetups
    },
    user () {
      return this.$store.state.user_basic
    },
    getUserAvatar () {
      return `background-image: url("${ this.user.avatar }")`
    }
  },
  created () {
    this.$store.commit('clearLoadedMeetUp')
  }
}
</script>
<style lang="scss">
.meetups {
  .content {
    height: 65px;
    overflow: hidden;
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
