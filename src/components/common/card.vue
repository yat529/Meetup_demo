<template>
  <div class="card-wrapper" v-if="item">
    <div class="date-wrapper">
      <div class="date">
        {{ getMonth }} {{ getDate }}
      </div>
      <div class="day">{{ getDay }}</div>
    </div>
    <v-card flat class="card-item">
      <v-card-media :src="getImgUrl" height="200px" class="card-item-image">
      </v-card-media>
      <v-card-title primary-title class="pb-1">
        <h3 class="mb-1 primary--text info_name">{{ item.title }}</h3>
      </v-card-title>
      <v-card-text class="pt-0">
        <div class="info_desc">{{ item.description }}</div>
      </v-card-text>

      <v-card-actions>
        <CardButton :showEditMeetup="isOrganizer" :showRegisterMeetup="!isOrganizer"
        :registered="isRegistered" :pending="isPending"
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
      const Month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
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
    // z-index: 1;
    
    .date,
    .day {
      width: 70px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      text-align: center;
    }

    .date {
      background: #fff;
    }

    .day {
      background: #000000;
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

    .info_name,
    .info_desc {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }

    .info_name {
      height: 50px;
      font-size: 1.2rem;
      -webkit-line-clamp: 2;
    }

    .info_desc {
      height: 60px;
      font-size: 1rem;
      line-height: 20px;
      -webkit-line-clamp: 3;
    }
  }
}
</style>
