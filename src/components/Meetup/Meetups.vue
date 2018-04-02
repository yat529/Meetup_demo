<template>
  <v-container class="meetups cards-view" v-if="meetups" ref="cardsView">
    <div class="left arrow" ref="leftArrow"></div>
    <div class="right arrow" ref="rightArrow"></div>
    <v-layout row class="cards-row" ref="cardsRow">
      <div v-for="item in meetups" :key="item.key" class="card-wrapper" ref="card">
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

          <CardButton :item="item" :showDelete="false" :initState="isUserRegistered(item)"
          v-on:register="registerMeetup(item)" 
          v-on:unregister="unregisterMeetup(item)" 
          v-on:more="loadMeetup(item)"
          ></CardButton>
        </v-card>
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
  methods: {
    loadMeetup (item) {
      this.$router.push('/meetup/' + item.key)
    },
    registerMeetup (item) {
      if (this.$store.state.userModule.user) {
        this.$store.dispatch('registerMeetup', item)
      } else {
        this.$router.push('/signin')
      }
    },
    unregisterMeetup (item) {
      this.$store.dispatch('unregisterMeetup', item)
    },
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
  },
  updated () {
    this.$nextTick(() => {

      // viewport
      let view = this.$refs.cardsView,
          row = this.$refs.cardsRow,
          cards = this.$refs.card,
          card = this.$refs.card[0],
          leftArrow = this.$refs.leftArrow,
          rightArrow = this.$refs.rightArrow


      let viewWidth = view.offsetWidth,
          cardWidth = card.offsetWidth,
          margin = 20

      let cardsNum =cards.length
      
      let rowWidth = (cardWidth + 20 * 2) * cardsNum
      row.style.width = rowWidth + 'px'

      let counter = 0,
          dist = 0

      leftArrow.addEventListener('click', () => {
        counter ++
        dist = cardWidth * counter

        if (dist < rowWidth - viewWidth) {
          row.style.transform = `translateX(${-dist}px)`
        } else {
          row.style.transform = `translateX(${-(rowWidth - viewWidth)}px)`
          counter --
        }
        console.log(counter)
      })
      rightArrow.addEventListener('click', () => {
        if (dist === 0) {
          row.style.transform = `translateX(0px)`
        } else {
          counter --
          dist = cardWidth * counter
          row.style.transform = `translateX(${-dist}px)`
        }
        console.log(counter)
      })
  
      console.log(viewWidth, rowWidth, card.offsetWidth)
    })
  }
}
</script>

<style lang="scss">
.cards-view {
  position: relative;
  padding: 0;
  overflow: hidden;

  .arrow {
    position: absolute;
    top: 50%;
    width: 20px;
    height: 20px;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.6);
    cursor: pointer;
    z-index: 2;

    &.left {
      left: 0;
    }

    &.right {
      right: 0;
    }
  }
}
.cards-row {
  display: block;
  overflow: hidden;
  transition: transform 0.1s ease-in-out;
}

.meetups {
  .card-wrapper {
    display: block;
    float: left;
    width: 288px;
    margin: 20px;

    // :first-child {
    //   margin-left: 0;
    // }

    // :last-child {
    //   margin-right: 0;
    // }
  }

  .card-item {
    position: relative;
    box-shadow: 0 5px 15px -11px rgba(0, 0, 0, 0.4);
    border-radius: 15px !important;
  }

  .date-wrapper {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 70px;
    border-radius: 10px;
    overflow: hidden;
    z-index: 2;
    
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
</style>
