<template>
  <div class="infobar-title">
    <v-icon class="primary--text">fas fa-exclamation-circle</v-icon>
    <p>{{ infoText }}</p>
    <v-icon class="primary--text" @click="close">fas fa-times</v-icon>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    infoText: {
      stype: String,
      default: '3个通知'
    }
  },

  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
// Global
.infobar-title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  height: 40px;
  margin-bottom: 15px;
  background: #ffffff;
  border-radius: 5px;

  &::after {
    content: "";
    position: absolute;
    bottom: 3px;
    left: 50%;
    width: 97%;
    height: 20px;
    transform: translateX(-50%);
    background: #ffffff;
    box-shadow: 0 2px 20px -5px rgba(0, 0, 0, 0.5);
    z-index: -1;
  }

  .icon {
    font-size: 18px;

    &:first-child {
      margin-left: 15px;
    }
    &:last-child {
      margin-right: 15px;
    }
  }

  p {
    flex: 1;
    margin: 0;
    margin-left: 10px;
    text-align: left;
  }
}
</style>


