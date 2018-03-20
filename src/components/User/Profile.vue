<template>
  <v-container class="meetups">
    <h3 class="title mt-3 mb-3 primary--text">My Meetups</h3>
    <v-layout row wrap class="mb-5">
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
          <v-card-actions>
            <v-btn flat color="orange">Edit</v-btn>
            <v-btn flat color="orange" @click="deleteMeetup(item)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <h3 class="title mb-3 primary--text">My Registered Meetups</h3>
    <v-layout row wrap class="mb-5">
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
          <v-card-actions>
            <v-btn flat color="orange" @click="unregisterMeetup(item)">Unregister</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {}
  },
  methods: {
    deleteMeetup (item) {
      this.$store.dispatch('deleteMeetup', item)
    },
    unregisterMeetup (item) {
      this.$store.dispatch('unregisterMeetup', item)
    }
  },
  computed: {
    createdMeetups () {
      return this.$store.state.createdMeetups
    },
    registeredMeetups () {
      return this.$store.state.registeredMeetups
    }
  },
  created () {
    // this.$store.dispatch('initProfilePage')
  }
}
</script>
<style lang="scss">
.meetups {
  .content {
    height: 65px;
    overflow: hidden;
  }
}
</style>
