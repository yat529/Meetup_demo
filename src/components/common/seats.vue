<template>
  <div class="seats">
    <div class="seat" v-for="member in group" :key="member.key" v-if="group">
      <div class="avatar" :style="getAvatarBgUrl(member)"></div>
      <p class="member-name">{{ member.nickname }}</p>
    </div>
    <div class="vacant-wrapper" v-html="vacancy"></div>
    
  </div>
</template>

<script>
/* eslint-disable */
import * as firebase from 'firebase'
export default {
  props: {
    group: {
      type: Array
    },
    max: {
      type: Number
    }
  },
  methods: {
    getAvatarBgUrl (member) {
      return `background-image: url("${ member.avatar }")`
    }
  },
  computed: {
    vacancy () {
      let taken = this.group ? this.group.length : 0
      let vacancy = this.max - taken
      let html = ''
      for (let i = 0; i < vacancy; i++) {
        html += `<div class="seat" ><div class="empty"></div></div>`
      }
      return html
    }
  }
}
</script>

<style lang="scss">
.seats {
  overflow: auto;

  .seat {
    float: left;
    position: relative;
    width: 50px;
    height: 50px;
    margin-right: 15px;
    margin-bottom: 25px;

    .avatar {
      position: absolute;
      top: 0;
      left: 50%;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 3px solid #eeeeee;
      background-position: center;
      background-size: cover;
      transform: translateX(-50%);
    }

    .empty {
      position: absolute;
      top: 0;
      left: 50%;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 3px solid #eeeeee;
      background: #c0c0c0;
      transform: translateX(-50%);
    }

    .member-name {
      position: relative;
      top: 100%;
      text-align: center;
    }
  }
  .vacant-wrapper {
    overflow: auto;
  }
}
</style>
