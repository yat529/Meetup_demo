<template>
  <div class="seats" v-if="group">
    <!-- <div class="seat" v-for="member in group" :key="member.key">
      <div class="avatar" :style="getAvatarBgUrl(member)"></div>
      <p class="member-name">{{ member.nickname }}</p>
    </div> -->
    <UserAvatar class="seat" :user="member" v-for="member in group" :key="member.key"></UserAvatar>
    <div class="vacant-wrapper" v-html="vacancy"></div>
    
  </div>
</template>

<script>
/* eslint-disable */
import UserAvatar from './avatar'
import * as firebase from 'firebase'
export default {
  components: {
    UserAvatar
  },
  props: {
    group: {
      type: Object
    },
    max: {
      type: Number
    }
  },
  data () {
    return {
      size: this.max
    }
  },
  methods: {
    getAvatarBgUrl (member) {
      return `background-image: url("${ member.avatar }")`
    }
  },
  computed: {
    vacancy () {
      let taken = Object.keys(this.group).length || 0
      let vacancy = this.size - taken
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
  // overflow: auto;

  .seat {
    float: left;
    margin-right: 15px;
    // position: relative;
    // width: 50px;
    // height: 50px;
    // margin-right: 10px;
    // margin-bottom: 25px;

    // .avatar {
    //   position: absolute;
    //   top: 0;
    //   left: 50%;
    //   width: 50px;
    //   height: 50px;
    //   border-radius: 50%;
    //   border: 3px solid #eeeeee;
    //   background-position: center;
    //   background-size: cover;
    //   transform: translateX(-50%);
    // }

    .empty {
      // position: absolute;
      // top: 0;
      // left: 50%;
      // width: 50px;
      // height: 50px;
      // border-radius: 50%;
      // border: 3px solid #eeeeee;
      // transform: translateX(-50%);
      position: relative;;
      margin: 0 auto 10px auto;
      width: 50px;
      height: 50px;
      background: #c0c0c0;
      border-radius: 50%;
      border: 3px solid #eeeeee;
    }

    // .member-name {
    //   position: relative;
    //   top: 100%;
    //   text-align: center;
    // }
  }
  .vacant-wrapper {
    overflow: auto;
  }
}
</style>
