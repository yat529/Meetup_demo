<template>
<div v-if="showApproveFriend">
  <!-- step 1: make decision -->
  <v-layout row wrap v-if="!confirmApproveFriend && !confirmRejectFriend">
    <v-btn small dark round color="primary" @click="confirmApproveFriend = true">
      <v-icon left small>far fa-check-circle</v-icon>
      通过
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn small dark round color="primary" @click="confirmRejectFriend = true">
      <v-icon left small>far fa-times-circle</v-icon>
      拒绝
    </v-btn>
  </v-layout>

  <!-- step 2a: if confirm to approve friend request-->
  <v-layout row wrap v-else-if="confirmApproveFriend && !confirmRejectFriend">
    <v-btn small dark round color="green lighten-3" v-if="!confirmFinished" @click="approveFriend">
      <v-icon left small>far fa-check-circle</v-icon>
      确认通过
    </v-btn>
    <v-btn small dark round color="green lighten-3" v-if="confirmFinished" @click="finish">
      <v-icon left small>far fa-check-circle</v-icon>
      完成
    </v-btn>
  </v-layout>

  <!-- step 2b: if confirm to reject friend request-->
  <v-layout row wrap v-else-if="!confirmApproveFriend && confirmRejectFriend">
    <v-btn small dark round color="red" v-if="!confirmFinished" @click="rejectFriend">
      <v-icon left small>far fa-times-circle</v-icon>
      确认拒绝
    </v-btn>
    <v-btn small dark round color="green lighten-3" v-if="confirmFinished" @click="finish">
      <v-icon left small>far fa-check-circle</v-icon>
      完成
    </v-btn>
  </v-layout>
</div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    showApproveFriend: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      confirmApproveFriend: false,
      confirmRejectFriend: false,
      confirmFinished: false,
    }
  },
  methods: {
    approveFriend () {
      this.$emit('approveFriend')
      this.confirmFinished = true
    },
    rejectFriend () {
      this.$emit('rejectFriend')
      this.confirmFinished = true
    },
    finish () {
      this.$emit('finish')
    },

  }
}
</script>

