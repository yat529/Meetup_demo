<template>
  <v-layout justify-center align-center v-if="showInviteFriend">
    <v-btn small round dark color="primary" v-if="!checked" @click="inviteFriend">邀请好友</v-btn>
    <v-btn small round dark color="green" v-else-if="checked" @click="close">
      <v-icon left small>far fa-check-circle</v-icon>
      确认
    </v-btn>
  </v-layout>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    showInviteFriend: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      checked: false
    }
  },
  methods: {
    inviteFriend () {
      this.checked = true
      this.$emit('inviteFriend')
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

