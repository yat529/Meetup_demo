<template>
  <v-btn small round dark color="primary" v-if="showClose" @click="close">
    返回
  </v-btn>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    showClose: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

