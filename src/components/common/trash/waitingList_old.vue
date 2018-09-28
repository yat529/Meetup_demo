<template>
  <v-container px-0 py-0 v-if="meetups">
    <v-layout row wrap v-if="cardsWithPendingMembers.length">
      <CardCarousel class="py-0 mb-3"
      :cards="cardsWithPendingMembers"
      :hasPlaceholder="true"
      :phText="'暂无其他'"
      :isMobile="isMobile"
      v-on:clickCard="getClickedCard"></CardCarousel>
    </v-layout>

    <transition name="fade" mode="out-in">
    <v-layout mb-4 v-if="clickedCard.key">
      <UserList
      :users="pendingMembers"
      :meetupKey="clickedCard.key"
      :showApproveMember="true"
      :isMobile="isMobile"
      v-on:confirm="approveMembers"
      v-on:close="hideMembers"></UserList>
    </v-layout>
    </transition>
  </v-container>
</template>


<script>
/* eslint-disable */
import CardCarousel from '@/components/common/cardCarousel'
import UserList from '@/components/common/userList'

export default {
  components: {
    CardCarousel,
    UserList
  },
  props: {
    meetups: {
      type: Array
    },
    requests: {
      type: Array
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      clickedCard: {},
    }
  },
  computed: {
    cardsWithPendingMembers () {
      let list = []
      this.meetups.forEach(meetup => {
        this.requests.forEach(item => {
          if (item.key === meetup.key) {
            meetup.newMember = item.newMember
            list.push(meetup)
          }
        })
      })
      return list
    },
    pendingMembers () {
      let newMembers = this.clickedCard.newMember,
          list = []
      if (newMembers) {
        for (let key in newMembers) {
          list.push(newMembers[key])
        }
      }
      return list
    }
  },
  watch: {
    clickedCard (newVal, oldVal) {
      console.log('data updated', newVal)
    }
  },
  methods: {
    // showPendingMember (item) {},
    getClickedCard (item) {
      this.clickedCard = Object.assign({}, this.clickedCard, item)
    },
    approveMembers (list) {
      let that = this,
          key = that.clickedCard.key

      if (list.length && key) {
        list.forEach(member => {
          that.$store.dispatch('confirmMemberRequest', {
            meetup_key: key, 
            target_user: member
          })
        })
      } else {
        let error = {
          type: 'warning',
          title: '选择不能为空',
          content: '请先选择一个用户, 或者返回'
        }
        this.$store.commit('setPopupMsg', error)
      }
    },
    hideMembers () {
      this.clickedCard = {}
    }
  }
}
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-in-out;
}

.fade-enter {
  // transform: translateY(-30%);
  opacity: 0;
}

.fade-leave-to {
  // transform: translateY(30%);
  opacity: 0;
}
</style>
