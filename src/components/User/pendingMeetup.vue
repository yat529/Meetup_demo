<template>
  <v-container px-0 py-0 v-if="pendingMeetups">
    <v-layout row class="mb-5">
      <v-container class="placeholder mt-4" v-if="!pendingMeetups.length">
        <v-layout justify-center align-center fill-height>
          <v-btn flat large color="primary">没有待审核的MEETUP</v-btn>
        </v-layout>
      </v-container>
      <CardCarousel v-else :cards="pendingMeetups"></CardCarousel>
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
    pendingMeetups () {
      return this.$store.state.userModule.meetups.pending
    },
  },
}
</script>

