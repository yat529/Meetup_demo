<template>
  <v-container px-0 py-0 class="mb-5">
    <!-- notification count display tabs -->
    <v-layout class="dashboard mb-5" row wrap justify-center align-center v-if="notifications">
      <v-flex xs4 pl-0 pr-3>
        <div class="dash-card" @click="dashboard = 1" :class="dashboard === 1 ? 'active' : ''">
          <div class="count">
            {{ notifications.newFriend.length }} <span class="unit">个</span>
          </div>
          <p>新的好友请求</p>
        </div>
      </v-flex>
      <v-flex xs4 px-3>
        <div class="dash-card" @click="dashboard = 2" :class="dashboard === 2 ? 'active' : ''">
          <div class="count">
            {{ newMemberRequestCount() }} <span class="unit">个</span>
          </div>
          <p>新的成员请求</p>
        </div>
      </v-flex>
      <v-flex xs4 pl-3 pr-0>
        <div class="dash-card" @click="dashboard = 3" :class="dashboard === 3 ? 'active' : ''">
          <div class="count">
            {{ notifications.newMessage.length }} <span class="unit">个</span>
          </div>
          <p>新的消息</p>
        </div>
      </v-flex>
    </v-layout>

    <!-- tab content -->
    <v-layout row>
      <!-- firend requests -->
      <v-container v-show="dashboard === 1">
        <NameCards :users="notifications.newFriend"
        :showAddFriend="true"></NameCards>
      </v-container>

      <!-- member requests -->
      <v-container v-show="dashboard === 2">
        <WaitingList :requests="notifications.newMember" :meetups="created"></WaitingList>
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
import NameCards from '@/components/common/nameCard'
import WaitingList from '@/components/common/waitingList'

export default {
  components: {
    NameCards,
    WaitingList
  },
  props: {
    created: {
      type: Array
    },
    registered: {
      type: Array
    }
  },
  data () {
    return {
      dashboard: 1,
      isFriend: false
    }
  },
  computed: {
    notifications () {
      return this.$store.state.userModule.notifications
    }
  },
  methods: {
    newMemberRequestCount () {
      if (this.notifications) {
        let count = 0,
            meetups = this.notifications.newMember
        for (let key in meetups) {
          count += meetups[key].length
        }
        return count
      }
    }
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

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 40px;
    height: 40px;
    background: #ffffff;
    transform: translate(-50%, -50%) rotate(45deg);
    transform-origin: center;
    transition: transform 0.2s ease-in-out;
    z-index: -1;
  }

  &.active {
    box-shadow: none;
    
    &::after {
      transform: translate(-50%, 50%) rotate(45deg);
      

    }
  }

  .count {
    width: 100%;
    height: 70px;
    line-height: 70px;
    text-align: center;
    font-size: 42px;
    font-weight: 500;
    vertical-align: bottom;
    // background: bisque;

    .unit {
      display: inline-block;
      margin-left: 5px;
      font-size: 16px;
      font-weight: 500;
      // color: #ffffff;
    }
  }

  p {
    font-size: 18px;
    text-align: center;
  }
}

// .dash-content {
//   width: 100%;
//   min-height: 200px;
//   border-radius: 15px;
</style>
