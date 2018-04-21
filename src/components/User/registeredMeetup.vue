<template>
  <v-container px-0 py-0 v-if="registeredMeetups">
    <v-layout row class="mb-5">
      <v-container class="placeholder mt-4" v-if="!registeredMeetups.length">
        <v-layout justify-center align-center fill-height>
          <v-btn flat large color="primary" @click="redirectToMeetups">加入一个MEETUP</v-btn>
        </v-layout>
      </v-container>
      <CardCarousel v-else
      :cards="registeredMeetups" 
      :hasPlaceholder="true" 
      phText="加入新的MEETUP" 
      v-on:redirect="redirectToMeetups"></CardCarousel>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
import CardCarousel from '@/components/common/cardCarousel'

export default {
  components: {
    CardCarousel
  },
  computed: {
    registeredMeetups () {
      return this.$store.state.userModule.meetups.registered
    },
  },
  methods: {
    redirectToMeetups () {
      this.$router.push('/meetups')
    },
  }
}
</script>

