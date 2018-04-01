<template>
  <v-container class="meetups" v-if="meetups">
    <v-layout row>
      <div v-for="item in meetups" :key="item.key">
        <v-badge left overlap color="green" class="card-wrapper">
          <v-icon slot="badge" dark v-if="registered(item)">check_circle</v-icon>
          <v-card flat class="card-item">
            <div class="date-wrapper">
              <div class="date">
                {{ getMonth(item) }} {{ getDate(item) }}
              </div>
              <div class="day">{{ getDay(item) }}</div>
            </div>
            
            <v-card-media :src="getImgUrl(item)" height="200px" class="card-item-image">
            </v-card-media>
            <v-card-title primary-title class="pb-1">
              <h3 class="mb-1 primary--text info_name">{{ item.title }}</h3>
            </v-card-title>
            <v-card-text class="pt-0">
              <div class="info_desc">{{ item.description }}</div>
            </v-card-text>

            <CardButton :item="item" v-on:register="registerMeetup(item)" v-on:unregister="unregisterMeetup(item)" v-on:more="loadMeetup(item)" :showDelete="false"></CardButton>
          </v-card>
        </v-badge>
      </div>
    </v-layout>
  </v-container>
</template>
<script>
/* eslint-disable */
import CardButton from '@/components/common/button'
export default {
  components: {
    CardButton
  },
  data () {
    return {
      meetups: []
    }
  },
  // computed: {
  //   meetups () {
  //     return this.$store.getters.loadedMeetups
  //   }
  // },
  methods: {
    loadMeetup (item) {
      this.$router.push('/meetup/' + item.key)
    },
    registerMeetup (item) {
      this.$store.dispatch('registerMeetup', item)
    },
    unregisterMeetup (item) {
      this.$store.dispatch('unregisterMeetup', item)
    },
    registered (item) {
      return item.registered
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
      // let index = new Date('2018-04-01').getDay()
      console.log(index)
      return Day[index]
    }
  },
  created () {
    // load meetups on init
    this.$store.dispatch('fetchMeetups')
    .then(meetups => {
      this.meetups = meetups
    })
  }
}
</script>
<style lang="scss" scoped>
.meetups {
  .card-wrapper {
    width: 288px;
    margin: 20px;

  .card-item {
    position: relative;
    box-shadow: 0 5px 15px -11px rgba(0, 0, 0, 0.4);
    border-radius: 0 0 15px 15px !important;
  }

  .date-wrapper {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 70px;
    overflow: hidden;
    z-index: 2;
    
    .date,
    .day {
      width: 70px;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      text-align: center;
    }

    .date {
      background: #fff;
      border-radius: 5px 5px 0 0;
    }

    .day {
      background: #000000;
      color: #fff;
      font-size: 12px;
      border-radius: 0 0 5px 5px;
    }
  }

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
