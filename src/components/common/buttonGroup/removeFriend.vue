<template>
  <v-layout justify-center align-center v-if="showRemoveFriend">
    <v-btn small round dark color="primary" v-if="!confirmRemoveFriend" @click="confirmRemoveFriend = true">
      <v-icon left small>far fa-thumbs-down</v-icon>
      成为路人
    </v-btn>
    <v-btn small round dark color="green lighten-3" v-else-if="confirmRemoveFriend" @click="removeFriend">
      <v-icon left small>far fa-check-circle</v-icon>
      确认
    </v-btn>
  </v-layout>
</template>

<script>
export default {
  props: {
    showRemoveFriend: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      confirmRemoveFriend: false
    }
  },
  methods: {
    removeFriend () {
      this.$emit('removeFriend')
    }
  }
}
</script>
