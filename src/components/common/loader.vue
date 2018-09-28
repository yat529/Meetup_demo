<template>
  <transition
  v-on:enter="loaderEnter"
  v-on:leave="loaderLeave">
    <div class="loader" v-if="loading">
      <div id="loader-font-1" class="loader-font">米</div>
      <div id="loader-font-2" class="loader-font">团</div>
    </div>
  </transition>
</template>

<script>
/* eslint-disable */
export default {
  computed: {
    loading () {
      return this.$store.state.loading
      // return true
    }
  },

  methods: {
    loaderEnter (el, done) {
      Velocity(el, {
        // width: '100%',
        backgroundColor: '#6480E6',
        opacity: 1
      }, {
        easing: 'ease',
        duration: 0,
        complete: done
      })
    },

    loaderLeave (el, done) {
      Velocity(el, {
        // width: '0%',
        background: '#ffffff',
        opacity: 0
      }, {
        easing: 'ease',
        duration: 300,
        complete: done
      })
    }
  }
}
</script>

<style lang="scss">
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
  opacity: 1;
  text-align: center;
  margin: auto;
  z-index: 99;
}
.circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loader-font {
  font-size: 30px;
  font-weight: 500;
  color: #ffffff;
}

#loader-font-1 {
  animation: grow1 1.5s cubic-bezier(1,.16,.55,.9) infinite;
}
#loader-font-2 {
  animation: grow2 1.5s cubic-bezier(1,.16,.55,.9) infinite;
  animation-delay: 600ms;
}

@keyframes grow1 {
  0% {
    transform: scale(1, 1) rotate(0deg);
  }
  50% {
    transform: scale(1.3, 1.3) translate(-4px);
  }
  100% {
    transform: scale(1, 1);
  }
}
@keyframes grow2 {
  0% {
    transform: scale(1, 1) rotate(0deg);
  }
  30% {
    transform: scale(1.3, 1.3) translate(4px);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>
