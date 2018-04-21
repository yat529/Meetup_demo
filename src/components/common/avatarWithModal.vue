<template>
  <div v-if="user">
    <UserAvatar class="seat occupied" :user="user" :showName="showName" v-on:click="openModal"></UserAvatar>
    <UserPreviewModal :targetUID="user.uid" :meetupKey="meetupKey" :modal="modal" v-if="modal"
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
    user: {
      type: Object
    },
    meetupKey: {
      type: String
    },
    showName: {
      type: Boolean,
      default: true
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
      modal: false
    }
  },
  methods: {
    openModal () {
      this.modal = true
    },
    closeModal () {
      this.modal = false
    }
  },
}
</script>
