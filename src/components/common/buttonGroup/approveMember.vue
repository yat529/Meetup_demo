<template>
<div v-if="showApproveMember">
  <!-- step 1: make decision -->
  <v-layout row wrap v-if="!confirmApproveMember && !confirmRejectMember">
    <v-btn small dark round color="primary" @click="confirmApproveMember = true">
      <v-icon left small>far fa-check-circle</v-icon>
      通过
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn small dark round color="primary" @click="confirmRejectMember = true">
      <v-icon left small>far fa-times-circle</v-icon>
      拒绝
    </v-btn>
  </v-layout>

  <!-- step 2a: if confirm to approve friend request-->
  <v-layout row wrap v-else-if="confirmApproveMember && !confirmRejectMember">
    <v-btn small dark round color="green lighten-3" v-if="!confirmFinished" @click="approveMember">
      <v-icon left small>far fa-check-circle</v-icon>
      确认通过
    </v-btn>
    <v-btn small dark round color="green lighten-3" v-if="confirmFinished" @click="finish">
      <v-icon left small>far fa-check-circle</v-icon>
      完成
    </v-btn>
  </v-layout>

  <!-- step 2b: if confirm to reject friend request-->
  <v-layout row wrap v-else-if="!confirmApproveMember && confirmRejectMember">
    <v-btn small dark round color="red" v-if="!confirmFinished" @click="rejectMember">
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
    showApproveMember: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      confirmApproveMember: false,
      confirmRejectMember: false,
      confirmFinished: false,
    }
  },
  methods: {
    approveMember () {
      this.$emit('approveMember')
      this.confirmFinished = true
    },
    rejectMember () {
      this.$emit('rejectMember')
      this.confirmFinished = true
    },
    finish () {
      this.$emit('finish')
    },

  }
}
</script>

