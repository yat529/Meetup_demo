<template>
  <v-flex v-if="showLoadMeetup">
    <v-btn small round color="primary" v-if="!isMobile" @click="load">更多</v-btn>
    <v-btn icon small round color="primary" v-else @click="load">
      <v-icon small>fas fa-ellipsis-h</v-icon>
    </v-btn>
  </v-flex>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    showLoadMeetup: {
      type: Boolean,
      default: false
    },
    isMobile: {
      type: Boolean,
      default: true
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


