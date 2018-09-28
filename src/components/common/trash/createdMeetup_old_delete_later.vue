<template>
  <v-container px-0 py-0 v-if="createdMeetups">
    <v-layout row>
      <v-container class="placeholder mt-4" :class="isMobile ? 'height-fix' : ''" v-if="!createdMeetups.length">
        <v-layout justify-center align-center fill-height>
          <v-btn flat large color="primary" @click="redirectToCreate">发起新的Meetup</v-btn>
        </v-layout>
      </v-container>
      <CardCarousel v-else
      :cards="createdMeetups" 
      :hasPlaceholder="true" 
      :isMobile="isMobile"
      phText="发起新的Meetup" 
      v-on:redirect="redirectToCreate"></CardCarousel>
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
    createdMeetups () {
      return this.$store.state.userModule.meetups.created
    },
  },
  methods: {
    redirectToCreate () {
      this.$router.push('/addmeetup')
    },
  }
}
</script>

