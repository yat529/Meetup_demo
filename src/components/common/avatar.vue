<template>
  <div class="avatar-wrapper" v-if="user.uid">
    <div class="avatar" :style="getAvatarBgUrl(user)" @click.stop="showInfoCard = !showInfoCard"></div>
    <p class="member-name">{{ user.nickname }}</p>
    <div class="user-info-overlay" v-show="showInfoCard">
      <div class="user-info-card">
        <div class="header primary">
          <div class="avatar" :style="getAvatarBgUrl(user)"></div>
          <p class="member-name">
            {{ user.nickname }}
            <span class="sex">
              <i class="fas fa-mars" v-if="user.sex === 'male'"></i>
              <i class="fas fa-venus" v-if="user.sex === 'female'"></i>
            </span>
          </p>
        </div>
        <div class="body">
          <!-- add more -->
        </div>
        <v-layout px-3 py-3>
          <v-btn class="primary" flat small dark @click="sendRequest(user)">加为好友</v-btn>
          <v-spacer></v-spacer>
          <v-btn class="primary" flat small dark @click="confirmRequest(user)">通过请求</v-btn>
          <v-spacer></v-spacer>
          <v-btn class="primary" flat small dark @click.stop="showInfoCard = !showInfoCard">返回</v-btn>
        </v-layout>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: ['user', 'meetupKey'],
  data () {
    return {
      showInfoCard: false
    }
  },
  methods: {
    getAvatarBgUrl (user) {
      return `background-image: url("${ user.avatar || user.photoURL}")`
    },
    sendRequest (user) {
      this.$store.dispatch('sendFriendRequest', user.uid)
      .then(() => {
        console.log('request sent')
      })
    },
    confirmRequest (user) {
      console.log(user.uid, this.meetupKey)
      this.$store.dispatch('confirmMemberRequest', {target_uid: user.uid, meetup_key: this.meetupKey})
    }
  },
}
</script>

<style lang="scss">
.avatar-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  cursor: pointer;

  .user-info-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    overflow: hidden;

    .user-info-card {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 300px;
      height: 350px;
      background: #ffffff;
      // border-radius: 15px;
      transform: translate(-50%, -50%);
      // z-index: 2;

      .header {
        position: relative;
        width: 100%;
        height: 180px;
        background: #000000;
        overflow: hidden;

        .avatar {
          display: block;
          position: relative;
          width: 80px;
          height: 80px;
          margin: 35px auto 15px auto;
          border-radius: 50%;
          border: 3px solid #eeeeee;
          background-position: center;
          background-size: cover;
        }
        .member-name {
          position: relative;
          font-size: 15px;
          font-weight: 500;
          line-height: 20px;
          color: #ffffff;
          .sex {
            display: inline-block;
            margin-left: 5px;
            line-height: 20px;
            color: #ffffff
          }
        }
      }

      .body {
        height: 100px;
      }
    }
  }

  .avatar {
    display: block;
    position: relative;;
    margin: 0 auto 5px auto;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid #eeeeee;
    background-position: center;
    background-size: cover;
  }

  .member-name {
    position: relative;
    margin-bottom: 10px;
    width: 100%;
    text-align: center;
    font-size: 12px;
  }
}
</style>

