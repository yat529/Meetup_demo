<template>
  <v-btn round dark small color="primary" v-if="showRedirect" @click="redirect">
    主页
  </v-btn>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    showRedirect: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    redirect () {
      this.$emit('redirect')
    }
  }
}
</script>

