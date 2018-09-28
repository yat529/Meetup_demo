<template>
  <v-container>
    <v-btn round color="primary" @click="verifyEmail">验证邮件</v-btn>
  </v-container>

</template>

<script>
/* eslint-disable */ 
export default {
  props: {
    verifiedEmail: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // verified: false,
    }
  },
  methods: {
    verifyEmail () {
      this.$emit('verifyEmail')
    }
  }
}
</script>
