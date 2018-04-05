<template>
  <v-container class="usermodal-wrapper" fill-height fluid px-0 py-0>
    <div class="overlay"></div>
    <v-layout justify-center align-center>
      <div class="user-card">
        <div class="uc-close" @click.stop="close">
          <i class="fas fa-times-circle"></i>
        </div>
        <div class="header primary">
          <div class="avatar" v-if="user" :style="getAvatarBgUrl(user)"></div>
        </div>
        <div class="uc-body">
          <div class="name" v-if="user">{{ user.nickname }}</div>
          <div class="meta">
            <div class="sex">
              <i class="fas fa-mars"></i>
              <!-- <i class="fas fa-venus" v-if="user.sex === 'female'"></i> -->
            </div>
            <div class="resi">纽约, 美国</div>
          </div>
          <div class="uc-content">
            <div class="poi">
              <div class="tag">美食</div>
              <div class="tag">音乐</div>
              <div class="tag">旅游</div>
              <div class="tag">电影</div>
            </div>
            <div class="meetups">
              <!-- <div class="item"></div>
              <div class="item"></div>
              <div class="item"></div> -->
            </div>
          </div>
          
        </div>

        <div class="actions">
          <!-- 路人状态显示 -->
          <button class="uc-button" v-if="showAddFriend" @click.stop="add_friend">加为好友</button>
          <button class="uc-button" v-if="showAddMember" @click.stop="add_member">加为组员</button>
          <button class="uc-button" v-if="showInvite" @click.stop="invite_member">邀请加入</button>
          <!-- 好友状态显示 -->
          <button class="uc-button" v-if="isFriend" @click.stop="remove_friend">解除关系</button>
          
        </div>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    userBrief: {
      type: Object
    },
    // 6 types of button
    showAddFriend: {
      type: Boolean,
      default: false
    },
    showAddMember: {
      type: Boolean,
      default: false
    },
    showInvite: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      user: {},
      isFriend: false
    }
  },
  computed: {
    
  },
  methods: {
    add_friend () {
      this.$emit('addFriend')
    },
    add_member () {
      this.$emit('addMember')
    },
    remove_friend () {
      this.$emit('removeFriend')
    },
    invite_member () {
      this.$emit('inviteMember')
    },
    close () {
      this.$emit('close')
    },
    getAvatarBgUrl (user) {
      return `background-image: url("${ user.avatar || user.photoURL}")`
    },
  },
  created () {
    this.$store.dispatch('fetchUser', this.userBrief)
    .then(user_snap => {
      this.user = user_snap
    })
  }
}
</script>

<style lang="scss">
.usermodal-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;

  .overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: rgba(216, 216, 216, 0.548);
  }

  .user-card {
    position: relative;
    width: 400px;
    height: 550px;
    background: #ffffff;
    border-radius: 15px;
    box-shadow: 0 3px 15px -7px rgba(0, 0, 0, 0.4);
    z-index: 2;

    .uc-close {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 35px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      font-size: 25px;
      color: darken(#a1887f, 10%);
      cursor: pointer;
      z-index: 3;

      &:hover {
        color: darken(#a1887f, 20%);
      }
    }

    .header {
      position: relative;
      height: 100px;
      border-radius: 15px 15px 0 0;
      
      .avatar {
        position: absolute;
        top: 100%;
        left: 50%;
        width: 85px;
        height: 85px;
        border: 3px solid #ffffff;
        border-radius: 50%;
        background-position: center;
        background-size: cover;
        background-color: #ffffff;
        transform: translate(-50%, -50%);
        box-shadow: 0 3px 10px -4px rgba(0, 0, 0, 0.5);
        z-index: 2;
      }
    }

    .uc-body {
      position: relative;
      padding: 55px 0 25px 0;
      width: 100%;
      height: 450px;
      border-radius: 0 0 15px 15px;
      background: #eeeeee;

      .name {
        font-size: 23px;
        font-weight: 500;
        text-align: center;
      }

      .meta {
        width: 100%;
        margin-bottom: 10px;
        text-align: center;

        .sex,
        .resi {
          display: inline-block;
          height: 25px;
          line-height: 25px;
          font-size: 13px;
          font-weight: 400;
          vertical-align: middle;
        }
        .sex {
          font-size: 16px;
        }
        .resi {
          margin-left: 10px;
        }
      }

      .uc-content {
        width: 100%;
        height: 300px;

        .poi {
          display: flex;
          flex-flow: row wrap;
          padding: 5px 20px;
          width: 100%;
          height: 50px;
          justify-content: center;
          align-items: center;

          .tag {
            display: block;
            flex: 0 0 auto;
            padding: 3px 10px;
            margin-right: 8px;
            margin-bottom: 8px;
            font-size: 13px;
            font-weight: 400;
            text-align: center;
            border-radius: 15px;
            color: #ffffff;
            background: rosybrown;
          }
        }

        .meetups {
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 220px;
          background: #ffffff;

          .item {
          }
        }
      }
    }

    .actions {
      display: flex;
      position: absolute;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      bottom: 0;
      width: 100%;
      height: 70px;
      background: #eeeeee;
      border-radius: 0 0 15px 15px;
      z-index: 3;

      .uc-button {
        display: block;
        padding: 5px 25px;
        font-size: 15px;
        font-weight: 500;
        color: #ffffff;
        border-radius: 20px;
        background: #a1887f;
        transition: background-color 0.2s;
        cursor: pointer;

        &:hover {
          background: darken(#a1887f, 10%);
        }
      }
    }
  }
  
}

</style>
