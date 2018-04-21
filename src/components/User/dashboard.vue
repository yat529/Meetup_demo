<template>
  <v-container px-0>
    <!-- notification count display tabs -->
    <v-layout class="dashboard mb-5" row wrap justify-center align-center>
      <v-flex xs3 pl-0 pr-3>
        <div class="dash-card" @click="dashboard = 1" :class="dashboard === 1 ? 'active' : ''">
          <div class="count primary--text">
            {{ newFriend.length }} <span class="unit primary--text">个</span>
          </div>
          <p class="primary--text">新的好友请求</p>
        </div>
      </v-flex>
      <v-flex xs3 px-3>
        <div class="dash-card" @click="dashboard = 2" :class="dashboard === 2 ? 'active' : ''">
          <div class="count primary--text">
            {{ newMemberCount }} <span class="unit primary--text">个</span>
          </div>
          <p class="primary--text">新的成员请求</p>
        </div>
      </v-flex>
      <v-flex xs3 px-3>
        <div class="dash-card" @click="dashboard = 3" :class="dashboard === 3 ? 'active' : ''">
          <div class="count primary--text">
            {{ newInvitation.length }} <span class="unit primary--text">个</span>
          </div>
          <p class="primary--text">新的小组邀请</p>
        </div>
      </v-flex>
      <v-flex xs3 pl-3 pr-0>
        <div class="dash-card" @click="dashboard = 4" :class="dashboard === 4 ? 'active' : ''">
          <div class="count primary--text">
            {{ newMessage.length }} <span class="unit primary--text">个</span>
          </div>
          <p class="primary--text">新的消息</p>
        </div>
      </v-flex>
    </v-layout>

    <!-- tab content -->
    <v-layout class="dash-content-wrapper" row>
      <!-- firend requests -->
      <v-container v-show="dashboard === 1" px-0 py-0>
        <UserCards :users="newFriend" v-if="newFriend.length"
        :showApproveFriend="true"></UserCards>
        <v-layout class="placeholder" justify-center align-center fill-height v-else>
          <v-btn flat large color="primary">暂无好友请求</v-btn>
        </v-layout>
      </v-container>

      <!-- member requests -->
      <v-container v-show="dashboard === 2" px-0 py-0>
        <WaitingList :requests="newMember" :meetups="createdMeetups" v-if="newMember.length"></WaitingList>
        <v-layout class="placeholder" justify-center align-center fill-height v-else>
          <v-btn flat large color="primary">暂无成员请求</v-btn>
        </v-layout>
      </v-container>

      <!-- group invitation -->
      <v-container v-if="dashboard === 3" px-0 py-0>
        <CardCarousel v-if="newInvitation.length"
        :cards="invitedMeetups" 
        :hasPlaceholder="false"></CardCarousel>
        <v-layout class="placeholder" justify-center align-center fill-height v-else>
          <v-btn flat large color="primary">暂无小组邀请</v-btn>
        </v-layout>
      </v-container>

      <!-- message borad -->
      <v-container v-show="dashboard === 4" px-0 py-0>
        <SiteMessage :messages="newMessage" v-if="newMessage.length"></SiteMessage>
        <v-layout class="placeholder" justify-center align-center fill-height v-else>
          <v-btn flat large color="primary">暂无系统消息</v-btn>
        </v-layout>
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
import UserCards from '@/components/common/userCards'
import WaitingList from '@/components/common/waitingList'
import SiteMessage from '@/components/common/siteMessage'
import CardCarousel from '@/components/common/cardCarousel'

export default {
  components: {
    UserCards,
    WaitingList,
    SiteMessage,
    CardCarousel
  },
  data () {
    return {
      dashboard: 1,
    }
  },
  computed: {
    createdMeetups () {
      return this.$store.state.userModule.meetups.created
    },
    newFriend () {
      return this.$store.state.userModule.notifications.newFriend
    },
    newMember () {
      return this.$store.state.userModule.notifications.newMember
    },
    newMessage () {
      return this.$store.state.userModule.notifications.newMessage
    },
    newInvitation () {
      return this.$store.state.userModule.notifications.newInvitation
    },
    invitedMeetups () {
      return this.$store.state.userModule.meetups.invited
    },
    newMemberCount () {
      let count = 0,
          meetups = this.newMember
      meetups.forEach(item => {
        if (item) {
          console.log(item)
          count += item.newMember.length
        }
      })
      return count
    }

  },
  methods: {
    // 
  },
  created () {
    console.log(this.$store.state.userModule.notifications.newFriend)
  },
  mounted () {
    // 
  }
}
</script>

<style lang="scss">
.dash-card {
  position: relative;
  padding: 25px;
  border-radius: 15px;
  background: #ffffff;
  box-shadow: 0 5px 15px -11px rgba(0, 0, 0, 0.4);
  transition: box-shadow  0.2s ease-in-out;
  cursor: pointer;
  z-index: 1;

  // &::after {
  //   content: "";
  //   position: absolute;
  //   bottom: 0;
  //   left: 50%;
  //   width: 100%;
  //   height: 4px;
  //   background: #a1887f;
  //   transform: translate(-50%, -50%) rotate(45deg);
  //   transform-origin: center;
  //   transition: transform 0.2s ease-in-out;
  //   z-index: -1;
  // }

  &.active {
    background: #eeeeee;
  }

  .count {
    width: 100%;
    height: 70px;
    line-height: 70px;
    text-align: center;
    font-size: 32px;
    font-weight: 500;
    vertical-align: bottom;

    .unit {
      display: inline-block;
      margin-left: 5px;
      font-size: 16px;
      font-weight: 500;
    }
  }

  p {
    font-size: 16px;
    text-align: center;
  }
}

.dash-content-wrapper {
  .placeholder {
    width: 100%;
    height: 250px;
    border-radius: 15px;
  }
}
</style>
