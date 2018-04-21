<template>
  <v-container px-0 py-0 class="friend-list">
    <v-layout row>
      <!-- toolbar -->
      <v-layout justify-end class="friend-list-toolbar">
        <v-btn small round flat class="primary--text" :class="EditMode ? 'btn--active' : ''" @click="toggleEditMode">
          <v-icon left small>fas fa-sliders-h</v-icon>
          编辑朋友列表
        </v-btn>
      </v-layout>
      <v-container class="placeholder mt-4" v-if="!friends.length">
        <v-layout justify-center align-center fill-height>
          <v-btn flat large color="primary">目前还没有好友</v-btn>
        </v-layout>
      </v-container>
      <v-container class="friend-pool mt-4" v-else>
        <UserCards :users="friends" 
        :showRedirectAndAddFriend="!EditMode" 
        :showRemoveFriend="EditMode" 
        :showIndicator="EditMode"
        :showCSSAnimation="EditMode"
        v-on:check="addToDeleteList"
        v-on:uncheck="removeFromDeleteList"></UserCards>
      </v-container>
    </v-layout>
    <!-- action buttons for edit mode -->
    <v-container>
      <v-layout justify-center align-center v-if="EditMode && deleteList.length">
        <v-btn round dark color="primary" v-if="!confirmRemoveFriends" @click="confirmRemoveFriends = true">
          <v-icon left small>far fa-trash-alt</v-icon>
          全部删除
        </v-btn>
        <v-btn round dark color="primary" v-else-if="confirmRemoveFriends" @click="removeFriends">
          <v-icon left small>far fa-check-circle</v-icon>
          确认删除
        </v-btn>
        <v-btn round dark color="primary" v-if="deleteList.length" @click="clearDeleteList">
          <v-icon left small>fas fa-undo-alt</v-icon>
          清除选择
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
  data () {
    return {
      EditMode: false,
      confirmRemoveFriends: false,
      deleteList: [],
    }
  },
  computed: {
    friends () {
      return this.$store.state.userModule.friends
    },
  },
  methods: {
    toggleEditMode () {
      // reset list first
      this.clearDeleteList()
      this.EditMode = !this.EditMode
    },
    addToDeleteList (user) {
      this.deleteList.push(user)
    },
    removeFromDeleteList (user) {
      this.deleteList.forEach((person, index) => {
        if (person.uid === user.uid) {
          this.deleteList.splice(index, 1)
        }
      })
    },
    clearDeleteList () {
      this.deleteList.forEach((person, index) => {
        if (person.checked) {
          person.checked = false
          this.deleteList.splice(index, 1)
        }
      })
    },
    removeFriends () {
      this.deleteList.forEach((person, index) => {
        this.$store.dispatch('removeFriend', person.uid)
      })
    }
  }
}
</script>

<style lang="scss">
.friend-list {
  position: relative;
  .friend-list-toolbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid #eeeeee;
  }
}

</style>
