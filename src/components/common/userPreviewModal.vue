<template>
  <v-layout row justify-center>
    <v-dialog v-model="modal" persistent max-width="400">
      <!-- <v-btn color="primary" dark slot="activator">Open Dialog</v-btn> -->
      <div class="user-card" v-if="targetUser">
        <div class="uc-close" @click.stop="close">
          <i class="fas fa-times-circle"></i>
        </div>
        <div class="header primary">
          <div class="avatar" :style="getAvatarBg"></div>
        </div>
        <div class="uc-body">
          <div class="name">{{ targetUser.nickname }}</div>
          <div class="meta">
            <div class="sex">
              <i class="fas fa-mars" :class="targetUser.sex === 'male' ? 'blue--text' : ''" v-if="targetUser.sex === 'male'"></i>
              <i class="fas fa-venus" :class="targetUser.sex === 'female' ? 'pink--text' : ''" v-if="targetUser.sex === 'female'"></i>
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


        <!-- btn group -->
        <!-- Show redirect and/or addfriend button -->
        <v-layout class="actions px-4" row wrap justify-center align-center v-if="showRedirectAndAddFriend && !isSelf">
          <redirectButton :showRedirect="true"
          v-on:redirect="redirect"></redirectButton>
          <v-spacer v-if="!isFriend"></v-spacer>
          <addFriendButton :showAddFriend="true" :isPendingFriend="isPendingFriend" v-if="!isFriend"
          v-on:addFriend="addFriend"></addFriendButton>
        </v-layout>

        <v-layout class="actions px-4" row wrap justify-center align-center v-else-if="showRedirectAndAddFriend && isSelf">
          <closeButton :showClose="isSelf"
          v-on:close="close"></closeButton>
        </v-layout>

        <!-- show invite friend -->
        <v-layout class="actions px-4" row wrap justify-center align-center v-else-if="showInviteFriend">
          <inviteFriendButton :showInviteFriend="true"
          v-on:inviteFriend="inviteFriend"
          v-on:close="close"></inviteFriendButton>
        </v-layout>

        <!-- show remove friend button only, used in friend list of profile page -->
        <v-layout class="actions px-4" row wrap justify-center align-center v-else-if="showRemoveFriend">
          <removeFriendButton :showRemoveFriend="true" v-if="isFriend"
          v-on:removeFriend="removeFriend"></removeFriendButton>
        </v-layout>

        <!-- show remove member, used in meetup page -->
        <v-layout class="actions px-4" row wrap justify-center align-center v-else-if="showRemoveMember">
          <removeMemberButton :showRemoveMember="!isSelf"
          v-on:removeMember="removeMember"></removeMemberButton>
        </v-layout>

        <!-- show approve friend request, used in friend request of profile page -->
        <v-layout class="actions px-4" row wrap justify-center align-center v-else-if="showApproveFriend">
          <redirectButton :showRedirect="true"
          v-on:redirect="redirect"></redirectButton>
          <v-spacer></v-spacer>
          <approveFriendButton :showApproveFriend="true"
          v-on:approveFriend="approveFriend"
          v-on:rejectFriend="rejectFriend"
          v-on:finish="close"></approveFriendButton>
        </v-layout>

        <!-- show approve member request, used in member request of profile page -->
        <v-layout class="actions px-4" row wrap justify-center align-center v-else-if="showApproveMember">
          <redirectButton :showRedirect="true"
          v-on:redirect="redirect"></redirectButton>
          <v-spacer></v-spacer>
          <approveMemberButton :showApproveMember="true"
          v-on:approveMember="approveMember"
          v-on:rejectMember="rejectMember"
          v-on:finish="close"></approveMemberButton>
        </v-layout>

      </div> <!-- card -->
    </v-dialog>
  </v-layout>
</template>

<script>
/* eslint-disable */
import addFriendButton from '@/components/common/buttonGroup/addFriend'
import inviteFriendButton from '@/components/common/buttonGroup/inviteFriend'
import removeFriendButton from '@/components/common/buttonGroup/removeFriend'
import removeMemberButton from '@/components/common/buttonGroup/removeMember'
import approveFriendButton from '@/components/common/buttonGroup/approveFriend'
import approveMemberButton from '@/components/common/buttonGroup/approveMember'
import redirectButton from '@/components/common/buttonGroup/redirect'
import closeButton from '@/components/common/buttonGroup/close'

export default {
  components: {
    addFriendButton,
    inviteFriendButton,
    removeFriendButton,
    removeMemberButton,
    approveFriendButton,
    approveMemberButton,
    redirectButton,
    closeButton
  },
  props: {
    // required to fetch targetUser data
    targetUID: {
      type: String,
      required: true
    },
    // need for signup groups
    meetupKey: {
      type: String
    },
    modal: {
      type: Boolean,
    },
    showRedirectAndAddFriend: {
      type: Boolean,
      default: false
    },
    showInviteFriend: {
      type: Boolean,
      default: false
    },
    showRemoveFriend: {
      type: Boolean,
      default: false
    },
    showRemoveMember: {
      type: Boolean,
      default: false
    },
    showApproveFriend: {
      type: Boolean,
      default: false
    },
    showApproveMember: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      targetUser: {},
      currUser: {},
    }
  },
  computed: {
    getAvatarBg () {
      return `background-image: url("${ this.targetUser.photoURL }")`
    },
    isSelf () {
      let curr_uid = this.currUser.uid
      if (curr_uid) {
        return curr_uid === this.targetUID
      }

      return false
    },
    isFriend () {
      let curr_uid = this.currUser.uid,
          target_friends = this.targetUser.friends

      if (curr_uid && target_friends) {
        return Object.keys(target_friends).includes(curr_uid)
      }

      return false
    },
    isPendingFriend () {
      let curr_uid = this.currUser.uid,
          target_pendingFriends = this.targetUser.pendingFriends

      if (curr_uid && target_pendingFriends) {
        return Object.keys(target_pendingFriends).includes(curr_uid)
      }

      return false
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    redirect () {
      this.$router.push('/user/' + this.targetUID)
    },
    addFriend () {
      this.$store.dispatch('sendFriendRequest', this.targetUID)
    },
    inviteFriend () {
      this.$emit('inviteFriend', this.targetUID)
    },
    removeFriend () {
      this.$store.dispatch('removeFriend', this.targetUID)
      .then(() => {
        this.close()
      })
    },
    removeMember () {
      this.$store.dispatch('unregisterMember', {
        target_uid: this.targetUID, 
        meetup_key: this.meetupKey
      })
      .then(() => {
        this.close()
      })
    },
    approveFriend () {
      this.$store.dispatch('confirmFriendRequest', this.targetUser)
    },
    rejectFriend () {
      this.$store.dispatch('rejectFriendRequest', this.targetUser)
    },
    approveMember () {
      this.$store.dispatch('confirmMemberRequest', {
        meetup_key: this.meetupKey, 
        target_user: this.targetUser
      })
    },
    rejectMember () {
      this.$store.dispatch('rejectMemberRequest', {
        meetup_key: this.meetupKey, 
        target_user: this.targetUser
      })
    }
  },
  created () {
    // fetch user
    this.$store.dispatch('fetchUser', this.targetUID)
    .then(user => {
      this.targetUser = user
      this.currUser = this.$store.state.userModule.user_ref
    })
  }
}
</script>


<style lang="scss">
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
</style>
