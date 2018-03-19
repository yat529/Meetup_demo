<template>
  <v-container fluid>
    <!-- carousel -->
    <v-layout row wrap>
      <v-carousel>
        <v-carousel-item v-for="item in featuredMeetups" :src="item.imageUrl" :key="item.id"></v-carousel-item>
      </v-carousel>
    </v-layout>
    <!-- hero buttons -->
    <v-layout row wrap class="mt-2">
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large router to="/meetups" class="info">Explore Meetups</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large router to="/addmeetup" class="info">Create Meetup</v-btn>
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
  computed: {
    meetups() {},
    featuredMeetups() {
      return this.$store.getters.featuredMeetups
    }
  }
}
</script>

<style lang="scss">

</style>
