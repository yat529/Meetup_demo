<template>
  <div class="seats" v-if="group">
    <UserAvatar class="seat occupied" :user="member" v-on:click="openModal(member.uid)"
    v-for="(member, index) in group" :key="index"></UserAvatar>
    <div class="seat" v-for="seat in vacancy" :key="seat + 'vacancy'">
      <div class="empty"></div>
    </div>

    <UserPreviewModal :targetUID="target_uid" :meetupKey="meetupKey" :modal="modal" v-if="modal"
    :showRedirectAndAddFriend="showRedirectAndAddFriend"
    :showRemoveFriend="showRemoveFriend"
    :showRemoveMember="showRemoveMember"
    :showApproveFriend="showApproveFriend"
    :showApproveMember="showApproveMember"
    v-on:close="closeModal"></UserPreviewModal>
  </div>
</template>

<script>
/* eslint-disable */
import UserAvatar from '@/components/common/avatar'
import UserPreviewModal from '@/components/common/userPreviewModal'

export default {
  components: {
    UserAvatar,
    UserPreviewModal
  },
  props: {
    group: {
      type: Array
    },
    size: {
      type: Number
    },
    meetupKey: {
      type: String
    },
    showRedirectAndAddFriend: {
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
      modal: false,
      target_uid: '',
    }
  },
  methods: {
    openModal (target_uid) {
      console.log('click')
      this.target_uid = target_uid,
      this.modal = true
    },
    closeModal () {
      this.target_uid = '',
      this.modal = false
    }
  },
  computed: {
    vacancy () {
      return this.size - this.group.length // groupmember already include organizer
    },
  }
}
</script>

<style lang="scss" scoped>
.seats {
  overflow: auto;

  .seat {
    float: left;
    margin-right: 15px;

    .empty {
      position: relative;;
      margin: 0 auto 10px auto;
      width: 60px;
      height: 60px;
      background: #c0c0c0;
      border-radius: 50%;
      border: 3px solid #eeeeee;
    }
  }
}
</style>
