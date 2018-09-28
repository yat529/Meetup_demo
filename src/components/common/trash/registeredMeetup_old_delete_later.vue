<template>
  <v-container px-0 py-0 v-if="registeredMeetups">
    <v-layout row>
      <v-container class="placeholder mt-4" :class="isMobile ? 'height-fix' : ''" v-if="!registeredMeetups.length">
        <v-layout justify-center align-center fill-height>
          <v-btn flat large color="primary" @click="redirectToMeetups">加入一个MEETUP</v-btn>
        </v-layout>
      </v-container>
      <CardCarousel v-else
      :cards="registeredMeetups" 
      :hasPlaceholder="true" 
      :isMobile="isMobile"
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
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
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

