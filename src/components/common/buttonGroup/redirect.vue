<template>
  <v-btn round dark color="primary" v-if="showRedirect" @click="redirect">
    <v-icon left small>fas fa-sign-out-alt</v-icon>
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

