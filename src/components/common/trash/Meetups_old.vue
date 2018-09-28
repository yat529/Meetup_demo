<template>
  <v-container px-0 py-0>
    <v-layout row wrap justify-center align-center py-2 mb-0 :class="isMobile ? 'cus-border-bottom' : ''">
      <v-btn flat round dark color="primary" to="/profile/meetups/created">创建</v-btn>
      <v-btn flat round dark color="primary" to="/profile/meetups/registered">加入</v-btn>
      <v-btn flat round dark color="primary" to="/profile/meetups/pending">待审核</v-btn>
    </v-layout>

    <transition name="slide" mode="out-in">
    <router-view :isMobile="isMobile"></router-view>
    </transition>
    
  </v-container>
</template>

<script>
/* eslint-disable */
export default {
  components: {
    // 
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.cus-border-bottom {
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}
.height-fix {
  height: 250px;
}

// transition css
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease-in-out;
}

.slide-enter {
  transform: translateX(50%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-50%);
  opacity: 0;
}
</style>
