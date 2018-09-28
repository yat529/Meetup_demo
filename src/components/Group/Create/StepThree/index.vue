<template>
  <div>
    <UserList style="padding-top: 20px;"
      :users="users"
      v-on:confirm="confirm"
      v-on:skip="skip"
    >
      <div class="placeholder" slot="placeholder">还没有好友</div>
    </UserList>
  </div>
</template>

<script>
/* eslint-disable */
import UserList from './userList'

export default {
  components: {
    UserList
  },

  props: {
    users: {
      type: Array,
      default () {
        return []
      }
    }
  },
  
  data () {
    return {
      // users: [
      //   {
      //     name: 'Name 1',
      //     gender: 'female',
      //     age: 22,
      //     uid: 'asdasdasd',
      //   },
      //   {
      //     name: 'Name 2',
      //     gender: 'male',
      //     age: 25,
      //     uid: 'jdhlsahdkja'
      //   },
      //   {
      //     name: 'Name 3',
      //     gender: 'female',
      //     age: 23,
      //     uid: 'hladoahdla'
      //   },
      // ],
      selectedUsers: [],
    }
  },

  methods: {
    skip () {
      this.submit()
    },

    confirm (selectedUsers) {
      this.selectedUsers = selectedUsers
      this.submit()
    },

    submit () {
      this.$emit('submitFriendList', this.selectedUsers) 
    }

  }
}
</script>


<style lang="scss">
// Local
.placeholder {
  height: 300px;
  background: #eeeeee;
  line-height: 300px;
  text-align: center;
}

// Global
.cus-pos {
  position: fixed;
  margin: 0 !important;
  left: 50%;
  bottom: 45px;
  transform: translateX(-50%);
}
</style>

