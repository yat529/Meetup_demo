<template>
  <transition name="slide">
  <div class="popup-wrapper white" v-if="popupMsg&&showPopup">
    <v-btn icon small class="close mx-1 my-1" @click="showPopup = false">
      <v-icon small light color="brown lighten-4">far fa-times-circle</v-icon>
    </v-btn>
    <v-layout fill-height justify-center align-center>
      <v-flex xs3 d-flex justify-center>
        <v-icon large color="green lighten-2" v-if="popupMsg.type === 'success'">far fa-check-circle</v-icon>
        <v-icon large color="red lighten-1" v-else-if="popupMsg.type === 'error'">far fa-times-circle</v-icon>
        <v-icon large color="amber lighten-1" v-else-if="popupMsg.type === 'warning'">fas fa-exclamation-circle</v-icon>
      </v-flex>
      <v-flex xs9>
        <p class="body-2 primary--text mb-1 title">{{ popupMsg.title }}</p>
        <p class="caption primary--text mb-0 content">{{ popupMsg.content }}</p>
      </v-flex>
    </v-layout>
  </div>
  </transition>
</template>

<script>
/* eslint-disable */
export default {
  data () {
    return {
      showPopup: false
    }
  },
  computed: {
    popupMsg () {
      return this.$store.state.userModule.popupMsg
    }
  },
  watch: {
    popupMsg: { 
      handler (newVal, oldVal) {
        let that = this
        if (newVal.type) {
          that.showPopup = true
          setTimeout(() => {
            that.showPopup = false
            that.$store.commit('clearPopupMsg')
          }, 3000)
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
  .popup-wrapper {
    position: fixed;
    right: 30px;
    bottom: 30px;
    width: 330px;
    height: 80px;
    background: #eeeeee;
    border-radius: 10px;
    box-shadow: 0 2px 15px -7px rgba(0, 0, 0, 0.4);
    z-index: 99;

    .close {
      position: absolute;
      top: 0px;
      right: 0px;
    }

    .title,
    .content {
      padding-right: 32px;
    }
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.25s cubic-bezier(0.32, 0.26, 0.36, 1.25);
  }

  .slide-enter,
  .slide-leave-to {
    opacity: 0;
    transform: translateX(50%);
  }

  .slide-enter-to,
  .slide-leave {
    opacity: 1;
  }

</style>
