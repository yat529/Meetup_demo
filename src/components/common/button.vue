<template>
  <v-card-actions>
    <!-- only show to organizer -->
    <v-btn flat color="orange" v-if="isOrganizer" @click="eidt">Edit</v-btn>
    <!-- only if not organizer -->
    <v-btn flat color="orange" @click="toggleRegister">{{ item.registered ? 'Joined' : 'Join'}}</v-btn>
    <v-btn flat color="orange" v-if="!hideMore" @click="more">More</v-btn>
    <v-btn flat color="orange" v-if="hideMore" @click="close">Close</v-btn>
  </v-card-actions>
</template>

<script>
export default {
  props: ['item', 'noMore'],
  methods: {
    eidt () {
      this.$emit('edit')
    },
    toggleRegister () {
      if (this.item.registered) {
        this.$emit('unregister')
      } else {
        this.$emit('register')
      }
      this.item.registered = !this.item.registered
    },
    more () {
      this.$emit('more')
    },
    close () {
      this.$emit('close')
    }
  },
  computed: {
    isOrganizer () {
      return this.item.uid === this.$store.state.user.uid
    },
    hideMore () {
      return this.noMore
    }
  },
  created () {
    // init the item.registered property
    // if user not log in
    if (!this.$store.state.user_basic) return false
    let currentUserRegisteredMeetups = this.$store.state.user_basic.registeredMeetups

    // if registeredMeetups is null (user never registered any meetup)
    if (!currentUserRegisteredMeetups) {
      if (!this.item.registered) {
        this.$set(this.item, 'registered', false)
      } else {
        this.item.registered = false
      }
      return false
    }

    // if current meetup is in the registered meetup list of current user
    if (Object.keys(currentUserRegisteredMeetups).includes(this.item.key)) {
      // add property if not exists
      if (!this.item.registered) {
        this.$set(this.item, 'registered', true)
      } else {
        this.item.registered = true
      }
    } else {
      if (!this.item.registered) {
        this.$set(this.item, 'registered', false)
      } else {
        this.item.registered = false
      }
    }
  }
}
</script>

<style lang="scss">

</style>
