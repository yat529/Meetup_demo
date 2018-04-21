<template>
  <v-layout justify-center align-center v-if="showRegisterMeetup">
    <v-btn small round color="primary" v-if="!isPending && !isMember" @click="register">加入</v-btn>
    <v-btn small round flat dark color="amber" v-else-if="isPending">
      <v-icon left small>far fa-question-circle</v-icon>
      待审核
    </v-btn>
    <v-btn small round flat dark color="green lighten-3" v-else-if="isMember">
      <v-icon left small>far fa-check-circle</v-icon>
      已加入
    </v-btn>
  </v-layout>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    showRegisterMeetup: {
      type: Boolean,
      default: false
    },
    registered: {
      type: Boolean,
      default: false
    },
    pending: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isMember: this.registered,
      isPending: this.pending
    }
  },
  methods: {
    register () {
      this.isPending = true,
      this.$emit('register')
    }
  }
}
</script>

<style lang="scss">
</style>


