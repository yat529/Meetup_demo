<template>
  <v-container class="tabView" :class="isMobile ? '' : 'extra-px'" v-if="user">
    <v-layout justify-start mb-4>
      <h1 class="primary--text title px-3">我的账户</h1>
    </v-layout>

    <!-- tabs -->
    <v-layout row wrap justify-center mb-3>
      <v-btn flat large round dark color="primary" to="/account/personal_information">个人信息</v-btn>
      <v-btn flat large round dark color="primary" to="/account/account_management">账户管理</v-btn>
    </v-layout>

    <!-- view -->
    <transition name="slide" mode="out-in">
    <router-view style="position: relative" :isMobile="isMobile" :user="user"></router-view>
    </transition>

  </v-container>
</template>

<script>
export default {
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    user () {
      return this.$store.state.userModule.user_ref
    }
  }
}
</script>

<style lang="scss">
.tabView {
  position: absolute;
  top: 0;
  left: 0;
  // bottom: 0;
  width: 100%;
}
</style>


