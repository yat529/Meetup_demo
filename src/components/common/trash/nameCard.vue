<template>
  <div class="namecard-wrapper">
    <div class="namecard" v-for="(user, index) in users" :key="index" @click="click(user)">
      <div class="avatar" :style="getAvatarBgUrl(user)"></div>
      <div class="name">{{ user.nickname }}</div>
      <div class="indicator" v-if="user.checked || user.reject" :class="{'green': user.checked, 'deep-orange': user.reject}">
        <i class="fas fa-check-circle" v-show="user.checked"></i>
        <i class="fas fa-times-circle" v-show="user.reject"></i>
      </div>
    
      <!-- full screen user modal -->
      <UserModal v-if="user.showModal" :targetUid="user.uid" :meetupKey="meetupKey"
      v-on:close="close_modal(user)"
      v-on:addFriend="add_friend(user)"
      v-on:addMember="add_member(user)"
      v-on:reject="reject_request(user)"
      :showAddFriend="showAddFriend"
      :showConfirmFriend="showConfirmFriend"
      :showConfirmMember="showConfirmMember"
      :showRedirect="showRedirect"
      ></UserModal>
    </div>
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
      type: [Array, Object]
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
    disableUserModel: {
      type: Boolean,
      default: false
    },
    showStatusIconOnClick: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currUser: {},
      showModal: false,
      checked: false,
      reject: false
    }
  },
  computed: {
    
  },
  methods: {
    getAvatarBgUrl (user) {
      return `background-image: url("${ user.avatar || user.photoURL}")`
    },
    click (user) {
      if (this.disableUserModel && this.showStatusIconOnClick) {
        if (!user.checked) {
          this.$set(user, 'checked', true)
        } else {
          user.checked = false
        }
        this.invite_member()
      } else {
        this.open_modal(user)
      }
    },
    open_modal (user) {
      if (!this.disableUserModel) {
        console.log('clicked')
        this.$set(user, 'showModal', true)
      }
    },
    close_modal (user) {
      user.showModal = false
    },
    add_friend (user) {
      // 
      this.$set(user, 'checked', true)
      console.log('to add this friend')
    },
    add_member (user) {
      // 
      this.$set(user, 'checked', true)
      console.log('to add this member')
    },
    invite_member () {
      // 
      this.$emit('invitedMember')
    },
    reject_request (user) {
      // 
      this.$set(user, 'reject', true)
      console.log('to reject request')
    }
  },
  created () {
    // this.currUser = this.$store.state.UserModal.user_ref
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

    > .avatar {
      display: block;
      margin: 15px auto;
      width: 70px;
      height: 70px;
      background-position: center;
      background-size: cover;
      border-radius: 50%;
      border: 3px solid #eeeeee;
    }

    > .name {
      width: 100%;
      padding: 0 15px;
      margin-bottom: 15px;
      text-align: center;
    }

    > .indicator {
      position: absolute;
      top: -22px;
      right: -22px;
      width: 45px;
      height: 45px;
      font-size: 12px;
      color: #ffffff;
      text-align: center;
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
