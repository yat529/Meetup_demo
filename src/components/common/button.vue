<template>
  <v-card-actions>
    <!-- only show to organizer -->
    <v-btn flat color="orange" v-if="isOrganizer" @click="eidt">编辑</v-btn>
    <!-- only if not organizer -->
    <v-btn flat color="orange" v-if="!isOrganizer&&!registered" @click="register">加入</v-btn>
    <v-btn flat color="green" v-if="!isOrganizer&&registered" @click="unregister">已注册</v-btn>
    <v-btn flat color="orange" v-if="!hideMore&&!isOrganizer" @click="more">更多</v-btn>
    <v-btn flat color="orange" v-if="hideMore" @click="close">关闭</v-btn>
    <v-spacer></v-spacer>
    <v-btn flat color="red" outline v-if="isOrganizer&&showDelete" @click="remove">删除</v-btn>
  </v-card-actions>
</template>

<script>
export default {
  // props: ['item', 'noMore', 'showDelete'],
  props: {
    item: {
      type: Object
    },
    noMore: {
      type: Boolean
    },
    showDelete: {
      type: Boolean
    },
    initState: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      registered: this.initState
    }
  },
  methods: {
    eidt () {
      this.$emit('edit')
    },
    register () {
      this.registered = !this.registered
      this.$emit('register')
    },
    unregister () {
      this.registered = !this.registered
      this.$emit('unregister')
    },
    more () {
      this.$emit('more')
    },
    close () {
      this.$emit('close')
    },
    remove () {
      this.$emit('remove')
    }
  },
  computed: {
    isOrganizer () {
      return this.$store.state.userModule.user && this.item.uid === this.$store.state.userModule.user.uid
    },
    hideMore () {
      return this.noMore
    }
  },
  created () {
    // // init the item.registered property
    // // if user not log in
    // if (!this.$store.state.userModule.user) return false
    // let currentUserRegisteredMeetups = this.$store.state.user_basic.registeredMeetups

    // // if registeredMeetups is null (user never registered any meetup)
    // if (!currentUserRegisteredMeetups) {
    //   if (!this.item.registered) {
    //     this.$set(this.item, 'registered', false)
    //   } else {
    //     this.item.registered = false
    //   }
    //   return false
    // }

    // // if current meetup is in the registered meetup list of current user
    // if (Object.keys(currentUserRegisteredMeetups).includes(this.item.key)) {
    //   // add property if not exists
    //   if (!this.item.registered) {
    //     this.$set(this.item, 'registered', true)
    //   } else {
    //     this.item.registered = true
    //   }
    // } else {
    //   if (!this.item.registered) {
    //     this.$set(this.item, 'registered', false)
    //   } else {
    //     this.item.registered = false
    //   }
    // }
  }
}
</script>

<style lang="scss">

</style>
