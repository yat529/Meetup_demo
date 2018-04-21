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
              <i class="fas fa-mars" :class="user.sex === 'male' ? 'blue--text' : ''" v-if="user.sex === 'male'"></i>
              <i class="fas fa-venus" :class="user.sex === 'female' ? 'pink--text' : ''" v-if="user.sex === 'female'"></i>
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

        <div class="actions px-4">
          <!-- send add friend request -->
          <v-layout align-center justify-center v-if="showAddFriend">
            <div>
            <v-btn round color="primary" dark v-if="!sendRequest&&!isPendingFriend" @click.stop="sendFriendRequest">
              <v-icon left small>far fa-handshake</v-icon>
              加为好友
            </v-btn>
            <v-btn round color="green" dark depressed v-else-if="sendRequest || isPendingFriend" @click.stop="close">
              <v-icon left small>far fa-check-circle</v-icon>
              已发送好友请求
            </v-btn>
            </div>
            <v-spacer v-if="showRemoveMember"></v-spacer>
            <!-- remove from group -->
            <div v-if="showRemoveMember">
            <v-btn round color="primary" dark v-if="!deleted" @click.stop="to_delete">
              <v-icon left small>far fa-thumbs-down</v-icon>
              移除小组
            </v-btn>
            <v-btn round color="red" dark v-else-if="deleted" @click.stop="confirm_delete('MEMBER')">
              <v-icon left small>far fa-check-circle</v-icon>
              确认
            </v-btn>
            </div>
          </v-layout>
          <!-- redirect to user page -->
          <v-layout align-center justify-center v-else-if="showRedirect">
              <!-- redirect to user page -->
              <v-btn round color="primary" dark @click.stop="redirect(user)">
                <v-icon left small>fas fa-sign-out-alt</v-icon>
                看主页
              </v-btn>
              <v-spacer></v-spacer>
              <!-- remove friend -->
              <div v-if="!showRemoveMember">
              <v-btn round color="primary" dark v-if="!deleted" @click.stop="to_delete">
                <v-icon left small>far fa-thumbs-down</v-icon>
                成为路人
              </v-btn>
              <v-btn round color="red" dark v-else-if="deleted" @click.stop="confirm_delete('FRIEND')">
                <v-icon left small>far fa-check-circle</v-icon>
                确认
              </v-btn>
              </div>
              <!-- remove from group -->
              <div v-if="showRemoveMember">
              <v-btn round color="primary" dark v-if="!deleted" @click.stop="to_delete">
                <v-icon left small>far fa-thumbs-down</v-icon>
                移除小组
              </v-btn>
              <v-btn round color="red" dark v-else-if="deleted" @click.stop="confirm_delete('MEMBER')">
                <v-icon left small>far fa-check-circle</v-icon>
                确认
              </v-btn>
              </div>
          </v-layout>
          <!-- confirm friend request -->
          <v-layout align-center justify-center v-else-if="showConfirmFriend">
            <v-btn round color="primary" dark v-if="!checked && !rejected" @click.stop="to_confirm">通过好友请求</v-btn>
            <v-spacer v-if="!checked && !rejected"></v-spacer>
            <v-btn round color="primary" dark v-if="!checked && !rejected" @click.stop="to_reject">拒绝请求</v-btn>
            <!-- if accept -->
            <v-btn round color="green lighten-2" dark depressed v-if="checked && !rejected" @click.stop="confirm_add('FRIEND')">
              <v-icon left small>far fa-check-circle</v-icon>
              完成
            </v-btn>
            <!-- if reject -->
            <v-btn round color="amber" dark depressed v-if="rejected && !checked" @click.stop="confirm_reject('FRIEND')">
              <v-icon left small>fas fa-exclamation-circle</v-icon>
              确认
            </v-btn>
          </v-layout>
          <v-layout align-center justify-center v-else-if="showConfirmMember">
            <v-btn round color="primary" dark v-if="!checked && !rejected" @click.stop="to_confirm">加为组员</v-btn>
            <v-spacer v-if="!checked && !rejected"></v-spacer>
            <v-btn round color="primary" dark v-if="!checked && !rejected" @click.stop="to_reject">拒绝请求</v-btn>
            <!-- if accept -->
            <v-btn round color="green lighten-2" dark depressed v-if="checked && !rejected" @click.stop="confirm_add('MEMBER')">
              <v-icon left small>far fa-check-circle</v-icon>
              完成
            </v-btn>
            <!-- if reject -->
            <v-btn round color="amber" dark depressed v-if="rejected && !checked" @click.stop="confirm_reject('MEMBER')">
              <v-icon left small>fas fa-exclamation-circle</v-icon>
              确认
            </v-btn>
          </v-layout>
        </div>
      </div> <!-- card -->
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
/* 

PROPS默认值:
showAddFriend为, 默认为true
showConfirmFriend, 默认为false
showConfirmMember, 默认为false

非好友状态下 
加朋友, -- showAddFriend为!isFriend, showPending为!pendingFriend
待定 -- showAddFriend为!isFriend, showPending为pendingFriend
看主页 -- 待添加
好友状态下 
不显示 -- showAddFriend为isFriend
看主页 -- 待添加

在PROFILE页面下的NAMECARD
非好友状态下
确认朋友, -- 在朋友请求里(nameCard组件) showConfirmFriend为true, showAddFriend为false
确认小组, -- 在小组请求里(waitinglist组件) showConfirmMember为true, showAddFriend为false, showConfirmFriend为false,
看主页 -- 待添加
好友状态
确认小组, -- 在小组请求里(waitinglist组件) showConfirmMember为true, showAddFriend为false, showConfirmFriend为false,
看主页 -- 待添加

加了好友后的区别
发起活动时可以直接邀请
共同协作活动内容,计划
聊天功能
*/


export default {
  props: {
    targetUid: {
      type: String
    },
    meetupKey: {
      type: String
    },
    showAddFriend: {
      type: Boolean,
      default: true
    },
    showConfirmFriend: {
      type: Boolean,
      default: false
    },
    showConfirmMember: {
      type: Boolean,
      default: false
    },
    showRedirect: {
      type: Boolean,
      default: false
    },
    showRemoveMember: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      user: {},
      checked: false,
      rejected: false,
      deleted: false,
      sendRequest: false
    }
  },
  computed: {
    currUser () {
      return this.$store.state.userModule.user_ref
    },
    isPendingFriend () {
      let pendingFriends = this.user.pendingFriends,
          uid = this.currUser.uid

      if (pendingFriends && uid) {
        return Object.keys(pendingFriends).includes(uid)
      }
    },
  },
  methods: {
    sendFriendRequest () {
      this.$store.dispatch('sendFriendRequest', this.user.uid)
      .then(() => {
        this.sendRequest = true
        console.log('request sent')
      })
    },
    add_friend () {
      this.$emit('addFriend')
      this.$store.dispatch('confirmFriendRequest', this.user)
    },
    reject_friend () {
      this.$store.dispatch('rejectFriendRequest', this.user)
    },
    add_member () {
      this.$emit('addMember')
      this.$store.dispatch('confirmMemberRequest', {
        meetup_key: this.meetupKey,
        target_user: this.user
      })
    },
    reject_member () {
      this.$store.dispatch('rejectMemberRequest', {
        meetup_key: this.meetupKey,
        target_user: this.user
      })
    },
    close () {
      this.$emit('close')
    },
    to_confirm () {
      this.checked = true
    },
    to_reject () {
      this.rejected = true
    },
    to_delete () {
      this.deleted = true
    },
    confirm_add (type) {
      if (type === 'FRIEND') {
        this.add_friend()
      } else if (type === 'MEMBER') {
        this.add_member()
      }
      this.close()
    },
    confirm_reject (type) {
      this.$emit('reject')
      if (type === 'FRIEND') {
        this.$store.dispatch('removeFriendRequest', this.targetUid)
      } else if (type === 'MEMBER') {
        this.reject_member()
      }
      this.close()
    },
    confirm_delete (type) {
      if (type === 'FRIEND') {
        console.log('delete user')
        this.$store.dispatch('removeFriend', this.user)
      } else if (type === 'MEMBER') {
        console.log('remove user')
        this.$store.dispatch('unregisterMember', {
          target_user: this.user,
          meetup_key: this.meetupKey
        })
      }
      this.close()
    },
    redirect (user) {
      this.$router.push('/user/' + user.uid)
    },
    getAvatarBgUrl (user) {
      return `background-image: url("${ user.avatar || user.photoURL}")`
    },
  },
  created () {
    this.$store.dispatch('fetchUser', this.targetUid)
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
  z-index: 10;

  .overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 1;
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
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 60px;
      background: #eeeeee;
      border-radius: 0 0 15px 15px;
      z-index: 3;
    }
  }
  
}

</style>
