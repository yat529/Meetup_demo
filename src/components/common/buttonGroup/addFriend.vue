<template>
  <v-layout justify-center align-center v-if="showAddFriend">
    <v-btn small round dark color="primary" v-if="!pendingFriend" @click="addFriend">加为好友</v-btn>
    <v-btn small round dark color="green lighten-3" v-else-if="pendingFriend">
      <v-icon left small>far fa-check-circle</v-icon>
      已发送好友请求
    </v-btn>
  </v-layout>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    showAddFriend: {
      type: Boolean,
      default: false
    },
    isPendingFriend: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      pendingFriend: this.isPendingFriend
    }
  },
  methods: {
    addFriend () {
      this.pendingFriend = true
      this.$emit('addFriend')
    }
  }
}
</script>

