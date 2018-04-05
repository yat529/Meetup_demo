<template>
  <div class="namecard-wrapper">
    <div class="namecard" v-for="(user, index) in users" :key="index" @click.stop="open_modal(user)">
      <div class="avatar" :style="getAvatarBgUrl(user)"></div>
      <div class="name">{{ user.nickname }}</div>
      <div class="indicator">
        <!-- <i class="fas fa-check-circle" v-if="friend.selected === true"></i> -->
        <i class="fas fa-check-circle" v-if="true"></i>
      </div>
    </div>

    <!-- full screen user modal -->
    <UserModal v-if="showModal" :userBrief="target"
    v-on:close="close_modal"
    v-on:addFriend="add_friend"
    v-on:addMember="add_member"
    v-on:inviteMember="invite_member"
    v-on:removeFriend="remove_friend"
    :showAddFriend="showAddFriend"
    :showAddMember="showAddMember"
    :showInvite="false"
    ></UserModal>
  </div>
</template>

<script>
/* eslint-disable */
import UserModal from './userModal'

export default {
  components: {
    UserModal
  },
  props: {
    users: {
      type: [Object, Array]
    },
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
      target: {},
      showModal: false,
    }
  },
  computed: {
    // 
  },
  methods: {
    getAvatarBgUrl (user) {
      return `background-image: url("${ user.avatar || user.photoURL}")`
    },
    open_modal (user) {
      this.target = user
      this.showModal = true
    },
    close_modal () {
      this.target = {}
      this.showModal = false
    },
    add_friend () {
      // 
      console.log('to add this friend')
    },
    add_member () {
      // 
      console.log('to add this member')
    },
    invite_member () {
      // 
      console.log('to invite this member')
    },
    remove_friend () {
      // 
      console.log('to remove this friend')
    }
  }
}
</script>

<style lang="scss">
.namecard-wrapper {
  display: block;
  position: relative;
  width: 100%;
  padding: 25px;
  overflow: hidden;

  .namecard {
    position: relative;
    float: left;
    width: 120px;
    margin-right: 15px;
    margin-bottom: 15px;
    border-radius: 10px;
    background: #ffffff;
    box-shadow: 0 3px 10px -6px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    cursor: pointer;

    .avatar {
      display: block;
      margin: 15px auto;
      width: 70px;
      height: 70px;
      background-position: center;
      background-size: cover;
      border-radius: 50%;
      border: 3px solid #eeeeee;
    }

    .name {
      width: 100%;
      padding: 0 15px;
      margin-bottom: 15px;
      text-align: center;
    }

    .indicator {
      position: absolute;
      top: -22px;
      right: -22px;
      width: 45px;
      height: 45px;
      font-size: 12px;
      color: #ffffff;
      text-align: center;
      background: green;
      transform: rotate(45deg);

      i {
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%) rotate(-45deg);
        font-size: 12px;
      }
    }
  }
}
</style>
