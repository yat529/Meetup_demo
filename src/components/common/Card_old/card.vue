<template>
  <div class="card-wrapper" :class="isMobile ? 'small' : ''" v-if="item" @click.stop="click">
    <div class="date-wrapper" :class="isMobile ? 'small' : ''">
      <div class="date">
        {{ getMonth }} {{ getDate }}
      </div>
      <div class="day primary">{{ getDay }}</div>
    </div>
    <v-card flat class="card-item">
      <v-card-media :src="getImgUrl" height="130px" class="card-item-image" v-if="isMobile"></v-card-media>
      <v-card-media :src="getImgUrl" height="200px" class="card-item-image" v-else></v-card-media>

      <v-card-title primary-title class="pb-1">
        <h3 class="mb-1 primary--text info-name" :class="isMobile ? 'small' : ''">{{ item.title }}</h3>
      </v-card-title>
      <v-card-text class="pt-0">
        <div class="info-desc" :class="isMobile ? 'small' : ''">{{ item.description }}</div>
      </v-card-text>

      <v-card-actions>
        <CardButton :showEditMeetup="isOrganizer" :showRegisterMeetup="!isOrganizer"
        :registered="isRegistered" :pending="isPending" :isMobile="isMobile"
        v-on:register="registerMeetup"
        v-on:load="loadMeetup"
        v-on:enterEditMode="editMeetup"
        ></CardButton>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
/* eslint-disable */
import CardButton from '@/components/common/cardButton'

export default {
  components: {
    CardButton
  },
  props: {
    item: {
      type: Object
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 
    }
  },
  computed: {
    user () {
      return this.$store.state.userModule.user_ref
    },
    getImgUrl () {
      if (this.item) {
        return this.item.imageURLs[Object.keys(this.item.imageURLs)[0]]
      }
    },
    getMonth () {
      const Month = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      if (this.item) {
        let index = new Date(this.item.date).getMonth()
        return Month[index]
      }
    },
    getDate () {
      if (this.item) {
        return new Date(this.item.date).getDate() + 1
      }
    },
    getDay () {
      const Day = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
      if (this.item) {
        let index = new Date(this.item.date).getDay()
        return Day[index]
      }
    },
    isOrganizer () {
      if (this.user) {
        return this.user.uid === this.item.uid
      }
      return false
    },
    isRegistered () {
      if (this.item && this.user) {
        if (!this.item.registeredMembers) return false
        let uid = this.user.uid
        return Object.keys(this.item.registeredMembers).find(key => {
          return key === uid
        }) ?
        true :
        false
      }
      return false
    },
    isPending () {
      if (this.user) {
        for (let key in this.user.pendingMeetups) {
          if (key === this.item.key) {
            return true
          }
        }
      }
      return false
    },
  },
  methods: {
    loadMeetup () {
      this.$router.push('/meetup/' + this.item.key)
    },
    editMeetup () {
      console.log('here')
      this.$router.push('/meetup/' + this.item.key)
    },
    registerMeetup () {
      // check if signin first
      if (this.user) {
        // if join by invitation
        if (this.item.pendingInvitedMembers) {

          let invited = Object.keys(this.item.pendingInvitedMembers).includes(this.user.uid)

          if (invited) {
            this.$store.dispatch('fetchUser', this.item.uid)
            .then(user => {
              console.log(user.nickname, 'is invited')
              this.$store.dispatch('confirmGroupInvitation', {
                target_user: user, 
                meetup_key: this.item.key
              })
            })
          }
        }
        // normal join
        else {
          this.$store.dispatch('sendJoinRequest', this.item)
          .then(() => {
            console.log('join request sent')
          })
        }
      } else {
        this.$router.push('/signin')
      }
    },
    click () {
      this.$emit('click', this.item)
      console.log(this.item, ' is clicked')
    }
  }
}
</script>

<style lang="scss">
.card-wrapper {
  display: block;
  position: relative;
  float: left;
  width: 288px;
  margin: 20px;

  &.small {
    width: 200px;
    margin: 10px;
  }

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }


  .date-wrapper {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 70px;
    border-radius: 5px;
    overflow: hidden;
    z-index: 1;

    &.small {
      width: 55px;
    }
    
    .date,
    .day {
      width: 100%;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      text-align: center;
    }

    .date {
      background: #fff;
    }

    .day {
      color: #fff;
      font-size: 12px;
    }
  }

  .card-item {
    box-shadow: 0 5px 15px -11px rgba(0, 0, 0, 0.4);
    border-radius: 15px !important;

    .card-item-image {
      border-radius: 15px 15px 0 0 !important;
    }

    .info-name,
    .info-desc {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }

    .info-name {
      height: 50px;
      font-size: 1.2rem;
      -webkit-line-clamp: 2;

      &.small {
        height: 36px;
        font-size: 15px;
        line-height: 18px;
        -webkit-line-clamp: 2;
      }
    }

    .info-desc {
      height: 60px;
      font-size: 1rem;
      line-height: 20px;
      -webkit-line-clamp: 3;

      &.small {
        height: 45px;
        font-size: 13px;
        line-height: 15px;
        -webkit-line-clamp: 3;
      }
    }
  }
}
</style>
