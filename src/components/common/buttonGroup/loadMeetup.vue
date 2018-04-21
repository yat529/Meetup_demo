<template>
  <v-layout justify-center align-center v-if="showLoadMeetup">
    <v-btn small round color="primary" @click="load">更多</v-btn>
  </v-layout>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    showLoadMeetup: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    load () {
      this.$emit('load')
    }
  }
}
</script>

<style lang="scss">
</style>


