<template>
  <v-container px-0 py-0 class="user-list">
    <v-layout justify-start class="user-list-toolbar">
      <v-btn small round flat class="primary--text" :class="EditMode ? 'btn--active' : ''" @click="toggleEditMode">
        <v-icon left small>fas fa-sliders-h</v-icon>
        多选
      </v-btn>
      <!-- actions -->
      <v-layout justify-end align-center v-if="EditMode">
        <v-btn small round flat class="primary--text" @click="addAllToList">
          <v-icon left small>far fa-check-square</v-icon>
          全部选择
        </v-btn>
        <v-btn small round flat class="primary--text" v-if="list.length" @click="clearList">
          <v-icon left small>fas fa-undo-alt</v-icon>
          清除选择
        </v-btn>
      </v-layout>
    </v-layout>

    <v-container class="mt-4">
      <UserCards :users="users" :meetupKey="meetupKey"
      :showRedirectAndAddFriend="showRedirectAndAddFriend"
      :showInviteFriend="showInviteFriend"
      :showRemoveFriend="showRemoveFriend"
      :showRemoveMember="showRemoveMember"
      :showApproveFriend="showApproveFriend"
      :showApproveMember="showApproveMember"
      :showIndicator="true"
      :showCSSAnimation="false"
      v-on:check="addToList"
      v-on:uncheck="removeFromList"></UserCards>
    </v-container>

    <v-container>
      <v-layout justify-center align-center>
        <v-btn round dark color="green" @click="confirm">
          <v-icon left small>far fa-check-circle</v-icon>
          确认
        </v-btn>
        <v-btn round dark color="primary" @click="close">
          <v-icon left small>far fa-check-circle</v-icon>
          返回
        </v-btn>
      </v-layout>
    </v-container>

  </v-container>
</template>

<script>
/* eslint-disable */
import UserCards from '@/components/common/userCards'

export default {
  components: {
    UserCards
  },
  props: {
    users: {
      type: Array,
      required: true
    },
    meetupKey: {
      type: String,
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
      list: [],
      EditMode: false
    }
  },
  computed: {
    // 
  },
  methods: {
    addToList (user) {
      this.list.push(user)
    },
    addAllToList () {
      if (this.users) {
        this.users.forEach(user => {
          this.$set(user, 'checked', true)
          this.list.push(user)
        })
      }
    },
    removeFromList (user) {
      this.list.forEach((person, index) => {
        if (person.uid === user.uid) {
          person.checked = false
          this.list.splice(index, 1)
        }
      })
    },
    clearList () {
      this.list.forEach((person, index) => {
        person.checked = false
        this.list.splice(index, 1)
      })
    },
    toggleEditMode () {
      this.EditMode = !this.EditMode
    },
    // events passed to parent
    confirm () {
      this.$emit('confirm', this.list)
    },
    close () {
      this.$emit('close')
    }
  },
  created () {
    this.users.forEach(user => {
      if (user.checked) {
        this.list.push(user)
      }
    })
  }
}
</script>

<style lang="scss">
.user-list {
  position: relative;
  .user-list-toolbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #eeeeee;
  }
}
</style>

