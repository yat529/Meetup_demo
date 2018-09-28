<template>
  <div class="wlist-wrapper" v-if="meetups">
    <!-- list -->
    <div class="wlist mb-3" v-if="list" v-for="(item, index) in list" :key="index" v-show="counter - 1 === index">
      <div class="card-wrapper wlist-card">
        <div class="date-wrapper">
          <div class="date">
            {{ getMonth(item) }} {{ getDate(item) }}
          </div>
          <div class="day">{{ getDay(item) }}</div>
        </div>
        <v-card flat class="card-item">
          <v-card-media :src="getImgUrl(item)" height="200px" class="card-item-image">
          </v-card-media>
          <v-card-title primary-title class="pb-1">
            <h3 class="mb-1 primary--text info_name">{{ item.title }}</h3>
          </v-card-title>
          <v-card-text class="pt-0">
            <div class="info_desc">{{ item.description }}</div>
          </v-card-text>

          <CardButton :item="item" :user="user" v-on:edit="editMeetup(item)"></CardButton>
        </v-card>
      </div>

      <div class="waiting-area">
        <div class="arrow">
          <i class="fas fa-arrow-circle-left wl-icon"></i>
        </div>
        <UserCards :users="item.newMember" :meetupKey="item.key"
        :showApproveMember="true"></UserCards>
      </div>
    </div>

    <!-- pagination -->
    <div class="text-xs-center wl-pagination" v-if="listCount > 1">
      <v-pagination :length="listCount" :total-visible="7" v-model="counter" circle></v-pagination>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
// import CardButton from '@/components/common/cardButton'
// import Card from '@/components/common/card'
import CardCarousel from '@/components/common/cardCarousel'
import UserCards from '@/components/common/userCards'

export default {
  components: {
    CardCarousel,
    UserCards
  },
  props: {
    requests: {
      type: [Array, Object]
    },
    meetups: {
      type: Array
    }
  },
  data () {
    return {
      counter: 1,
    }
  },
  computed: {
    user () {
      return this.$store.state.userModule.user_ref
    },
    list () {
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
    listCount () {
      return this.list.length
    }
  },
  methods: {
    isUserRegistered (item) {
      if (!this.$store.state.userModule.user) return false
      if (!item.registeredMembers) return false
      let uid = this.$store.state.userModule.user.uid
      return Object.keys(item.registeredMembers).find(key => {
        return key === uid
      }) ?
      true :
      false
    },
    editMeetup (item) {
      this.$router.push('/meetup/' + item.key)
    },
    getImgUrl (item) {
      return item.imageURLs[Object.keys(item.imageURLs)[0]]
    },
    getMonth (item) {
      const Month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
      let index = new Date(item.date).getMonth()
      return Month[index]
    },
    getDate (item) {
      return new Date(item.date).getDate() + 1
    },
    getDay (item) {
      // const Day = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
      const Day = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
      let index = new Date(item.date).getDay()
      return Day[index]
    }
  }
}
</script>

<style lang="scss">
.wlist-wrapper {
  width: 100%;
}
.wlist {
  display: flex;
  width: 100%;
  flex-flow: row wrap;
  align-items: center;

  .wlist-card {
    flex: 0 0 auto;
    margin-right: 80px !important;
  }
  .waiting-area {
    position: relative;
    flex: 1 0 auto;
    height: 410px;
    border: 4px dashed #ffffff;
    border-radius: 15px;

    .arrow {
      position: absolute;
      left: -40px;
      top: 50%;
      transform: translate(-50%, -50%);

      .wl-icon {
        font-size: 35px;
        color: #ffffff;
      }
      
    }
  }
}

.wl-pagination {
  .pagination__navigation,
  .pagination__item {
    box-shadow: 0 1px 5px -2px rgba(0, 0, 0, 0.4) !important;
  }
}
</style>
