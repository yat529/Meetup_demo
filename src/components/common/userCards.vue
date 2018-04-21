<template>
  <div class="usercards-wrapper">
    <div class="usercard" v-for="(user, index) in users" :key="index" @click="openModal(user.uid)"
    :class="showCSSAnimation ? 'animated-card' : ''">
      <div class="avatar" :style="getAvatarBg(user)"></div>
      <div class="name">{{ user.nickname }}</div>
      <div class="indicator" v-show="showIndicator" @click.stop="toggleCheck(user)">
        <i class="far fa-circle unchecked" v-if="!user.checked"></i>
        <i class="fas fa-check-circle checked" v-else-if="user.checked"></i>
      </div>
    </div>
    <UserPreviewModal :targetUID="target_uid" :meetupKey="meetupKey" :modal="modal" v-if="modal"
    :showRedirectAndAddFriend="showRedirectAndAddFriend"
    :showInviteFriend="showInviteFriend"
    :showRemoveFriend="showRemoveFriend"
    :showRemoveMember="showRemoveMember"
    :showApproveFriend="showApproveFriend"
    :showApproveMember="showApproveMember"
    v-on:inviteFriend="inviteFriend"
    v-on:close="closeModal"></UserPreviewModal>
  </div>
</template>

<script>
/* eslint-disable */
import UserPreviewModal from '@/components/common/userPreviewModal'

export default {
  components: {
    UserPreviewModal,
  },
  props: {
    users: {
      type: Array,
    },
    meetupKey: {
      type: String,
    },
    showCSSAnimation: {
      type: Boolean,
      default: false
    },
    showIndicator: {
      type: Boolean,
      default: false
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
      target_uid: '',
      modal: false,
    }
  },
  computed: {
    // 
  },
  methods: {
    getAvatarBg (user) {
      return `background-image: url("${ user.photoURL }")`
    },
    openModal (target_uid) {
      this.target_uid = target_uid,
      this.modal = true
    },
    closeModal () {
      this.target_uid = '',
      this.modal = false
    },
    toggleCheck (user) {
      console.log('clicked')
      if (user.checked) {
        user.checked = false
        this.$emit('uncheck', user)
      } else {
        this.$set(user, 'checked', true)
        this.$emit('check', user)
      }
    },
    // only used in userList or friendList
    inviteFriend (targetUID) {
      let target = this.users.find(user => {
        return user.uid === targetUID
      })
      this.toggleCheck(target)
    }
  }
}
</script>

<style lang="scss">
.usercards-wrapper {
  display: block;
  position: relative;
  width: 100%;
  padding: 25px;
  overflow: hidden;

  .usercard {
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
      top: 7px;
      right: 7px;
      height: 18px;
      line-height: 18px;
      font-size: 18px;

      i.unchecked {
        color: #eeeeee;
      }

      i.checked {
        color: #4CAF50;
      }
    }
  }

  .animated-card {
    animation: shake 0.15s ease-in-out infinite both;
    transform-origin: center;
  }

  @keyframes shake {
    0% {
      transform: rotate(0deg)
    }

    25% {
      transform: rotate(1deg)
    }

    50% {
      transform: rotate(0deg)
    }

    75% {
      transform: rotate(-1deg)
    }

    100% {
      transform: rotate(0deg)
    }
  }
}
</style>

