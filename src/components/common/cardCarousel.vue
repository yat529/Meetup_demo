<template>
  <v-container class="carousel-wrapper px-0">
    <div class="left arrow" ref="leftArrow" v-if="meetups.length">
      <v-btn fab dark small color="primary">
        <v-icon dark>fas fa-chevron-circle-left</v-icon>
      </v-btn>
    </div>
    <div class="right arrow" ref="rightArrow" v-if="meetups.length">
      <v-btn fab dark small color="primary">
        <v-icon dark>fas fa-chevron-circle-right</v-icon>
      </v-btn>
    </div>
    <v-container class="meetups cards-view" ref="cardsView">
      <v-layout row class="cards-row" ref="cardsRow" id="cardsRow">
        <div v-for="item in meetups" :key="item.key" class="card-wrapper" ref="card">
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

            <CardButton :item="item" :showDelete="false" :initState="isUserRegistered(item)"
            v-on:register="registerMeetup(item)" 
            v-on:unregister="unregisterMeetup(item)" 
            v-on:more="loadMeetup(item)"
            v-on:edit="editMeetup(item)"
            ></CardButton>
          </v-card>
        </div>
        <!-- placeholder (optional) -->
        <div class="card-wrapper" v-if="hasPlaceholder&&meetups.length">
          <v-card flat height="410px" class="card-item">
            <v-layout justify-center align-center fill-height>
              <v-btn flat large color="primary" @click="redirect">
                <v-icon dark left>add_circle_outline</v-icon>
                {{phText}}
              </v-btn>
            </v-layout>
          </v-card>
        </div>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
/* eslint-disable */
import CardButton from '@/components/common/button'
export default {
  components: {
    CardButton
  },
  props: ['cards', 'hasPlaceholder', 'phText'],
  data () {
    return {
      // 
    }
  },
  computed: {
    meetups () {
      return this.cards
    }
  },
  methods: {
    loadMeetup (item) {
      this.$router.push('/meetup/' + item.key)
    },
    editMeetup (item) {
      this.$router.push('/meetup/' + item.key)
    },
    registerMeetup (item) {
      if (this.$store.state.userModule.user) {
        // if item.type === '公开'
        // this.$store.dispatch('registerMeetup', item)
        
        // if item.type === '半公开'
        // first send request
        this.$store.dispatch('sendJoinRequest', item)
        .then(() => {
          console.log('join request sent')
        })

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
      return Day[index]
    },
    redirect () {
      this.$emit('redirect')
    }
  },
  // created () {
  //   console.log('created hook', this.meetups.length)
  // },
  // mounted () {
  //   // this.$forceUpdate()
  //   console.log('mounted hook', this.meetups.length)
  // },
  updated () {
    // console.log('updated hook', this.meetups.length)
    // DOM Cache
    let view = this.$refs.cardsView,
        row = this.$refs.cardsRow,
        cards = this.$refs.card

    let card = cards[0],
        leftArrow = this.$refs.leftArrow,
        rightArrow = this.$refs.rightArrow
    
    let viewWidth = view.offsetWidth,
        cardWidth = card.offsetWidth,
        margin = 20

    let cardsNum =cards.length

    if (this.hasPlaceholder) cardsNum += 1

    let offset = Math.floor(viewWidth / (cardWidth + 20 * 2)),
        viewLimit = Math.ceil(viewWidth / (cardWidth + 20 * 2)),
        rowWidth = (cardWidth + 20 * 2) * cardsNum - 20 * 2 // first & list card no left/right marigin

    let counter = 0,
        dist = 0,
        cardsLeft = cardsNum

    console.log(cardsNum)

    row.style.width = rowWidth + 'px'
    
    rightArrow.addEventListener('click', () => {
      if (cardsLeft > viewLimit) {
        counter ++
        dist = (cardWidth + 20 * 2) * offset * counter
        row.style.transform = `translateX(${-dist}px)` 
        cardsLeft -= offset
        if (cardsLeft < viewLimit) {
          row.style.transform = `translateX(${-(rowWidth - viewWidth)}px)`
          dist = rowWidth - viewWidth
        }
      } else {
        row.style.transform = `translateX(${-(rowWidth - viewWidth)}px)`
      }
    })

    leftArrow.addEventListener('click', () => {
      if (cardsLeft === cardsNum) {
        row.style.transform = `translateX(0px)`
      } else {
        counter --
        dist = (cardWidth + 20 * 2) * offset * counter
        row.style.transform = `translateX(${-dist}px)`
        cardsLeft += offset
      }
    })
  }
}
</script>

<style lang="scss">
.carousel-wrapper {
  position: relative;

  .arrow {
    position: absolute;
    top: 50%;
    cursor: pointer;
    z-index: 2;

    &.left {
      left: 0;
      transform: translate(-50%, -50%);
    }

    &.right {
      right: 0;
      transform: translate(50%, -50%);
    }
  }
}

.cards-view {
  position: relative;
  padding: 0;
  overflow: hidden;

  .cards-row {
    display: block;
    overflow: hidden;
    transition: transform 0.5s ease-in-out;
  }
}


.meetups {
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
  }

  .date-wrapper {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 70px;
    border-radius: 5px;
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
