<template>
  <div class="avatar-wrapper" v-if="user" @click="click">
    <div class="member-avatar" :style="userAvatarBg"></div>
    <p class="member-name" v-show="showName">{{ user.nickname }}</p>
    <!-- optional slot -->
    <slot></slot>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  props: {
    user: {
      type: Object
    },
    showName: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    userAvatarBg () {
      return `background-image: url("${ this.user.photoURL }")`
    },
  },
  methods: {
    click () {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.avatar-wrapper {
  position: relative;
  width: 60px;
  cursor: pointer;

  .member-avatar {
    display: block;
    position: relative;;
    margin: 0 auto 5px auto;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 3px solid #eeeeee;
    background-position: center;
    background-size: cover;
    background-color: #ffffff;
  }

  .member-name {
    position: relative;
    margin-bottom: 0px;
    width: 100%;
    text-align: center;
    font-size: 12px;
    line-height: 20px;
  }
}
</style>

