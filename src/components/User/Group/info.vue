<template>
  <div class="temp">
    <div class="cus-card" ref="infoCard">
      <div class="cus-card-section cus-flex-row cus-pt-25 status" :class="dateCountdown < 0 ? 'cus-pb-25' : ''">
        <div class="cus-flex-item">
          <div class="countdown">
            <Calender class="calender" :date="dateToCalenderIcon"></Calender>
            <div class="ct-text" v-if="dateCountdown > 0">
              <div>距离活动</div>
              <div>
                <span class="big">{{ dateCountdown }}</span>
                <span>天</span>
              </div>
            </div>
            <div class="ct-text" v-else-if="dateCountdown === 0">
              <div>活动就在</div>
              <div>
                <span class="big">今天</span>
              </div>
            </div>
            <div class="ct-text" v-else>
              <div>目前活动</div>
              <div>
                <span class="big">已结束</span>
              </div>
            </div>
          </div>
        </div>
        <div class="cus-flex-spacer" v-if="dateCountdown >= 0"></div>
        <div class="cus-flex-item" v-if="dateCountdown >= 0">
          <div class="vacancy">
            <img class="sofa" :src="SofaUrl" alt="Seat">
            <div class="ct-text">
              <div>剩余空位</div>
              <div>
                <span class="big">{{ vacancy }}</span>
                <span>个</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="cus-card-section description">
        <div class="cus-title cus-text-title">简介</div>
        <div class="cus-flex-row">
          <div class="cus-avatar-with-name cus-mr-15">
            <div class="cus-avatar-sm" :style="getAvatarBg"></div>
            <p class="cus-text-p cus-avatar-name">发起人</p>
          </div>
          <div class="cus-text-p group-description">
            {{ group.description }}
          </div>
        </div>
      </div>

      <div v-if="planList.length <= 1">
        <div class="cus-card-section">
          <div class="cus-title cus-text-title">时间</div>
          <div class="cus-text-p">{{ groupStartingTime }}</div>
        </div>

        <div class="cus-card-section cus-pb-25">
          <div class="cus-title cus-text-title">地点</div>
          <div v-html="locationAddress"></div>
          <!-- <a class="cus-text-link" target="_blank" :href="externalGoogleMapURL">查看地图</a> -->
        </div>

        <!-- <Map class="group-pg-map" :item="group"></Map> -->

        <Map v-show="showMap"
          :width="mapWidth"
          :height="mapHeight"
          :location="group.location"></Map>
      </div>

      <div v-else>
        <div class="cus-card-section description">
          <div class="cus-title cus-text-title">计划</div>
          <PlanList :planList="planList"
            v-on:showDetailSchedulePage="showDetailSchedulePage"></PlanList>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
/* eslint-disable */

/* 
  helper function
*/

// change time format
// from "06:00" to "6:00 AM"
function changeTimeFormat (time) {
  let timeArr = time.split(':'),
      hr = parseInt(timeArr[0]),
      minute = parseInt(timeArr[1]),
      postfix = ['AM', 'PM'],
      formatedTime = ''

  if (hr === 12) {
    formatedTime = `${hr}:${minute} ${postfix[1]}`
  } else if (hr > 12) {
    formatedTime = `${hr - 12}:${minute} ${postfix[1]}`
  } else if (hr < 12) {
    formatedTime = `${hr}:${minute} ${postfix[0]}`
  }

  return formatedTime
}

// change date format
// from "2018-04-13" to "2014年4月13日"
function dateFormat (date) {
  let dateArr = date.split('-'),
      yr = dateArr[0],
      month = parseInt(dateArr[1]),
      day = parseInt(dateArr[2])

  return `${yr}年${month}月${day}日`
}

// calculate date differences
// from now to group date '2018-04-13'
function getDiffDays(groupDate) {
  let currentDate = Date.now(),
      groupDateArr = groupDate.split('-'),
      yr = groupDateArr[0],
      monthIndex = groupDateArr[1] - 1,
      day = groupDateArr[2],
      oneDay = 60 * 60 * 24 * 1000

  let groupDateMsec = new Date(yr, monthIndex, day).getTime()

  return Math.floor((groupDateMsec + oneDay - currentDate) / oneDay)
}


/* 
  Vue Part
*/
import Calender from '@/components/common/calenderIcon'
import Map from '@/components/common/embededMap'
import PlanList from './Components/PlanList'
import SofaUrl from './Icons/Sofa.svg'

export default {
  components: {
    Calender,
    Map,
    PlanList
  },

  props: {
    group: {
      type: Object,
      required: true
    },

    planList: {
      type: Array,
      required: true
    }

  },

  data () {
    return {
      SofaUrl: SofaUrl,
      // Group Database Date
      orgnizer: {},
      mapWidth: null,
      mapHeight: null,
    }
  },

  computed: {

    showMap () {
      return !!this.mapWidth && !!this.mapHeight
    },

    dateCountdown () {
      let date = this.group.date
      if (date)
      return getDiffDays(date)
    },

    vacancy () {
      let members = this.group.registeredMembers,
          groupSize = this.group['group_size']

      if (!members) members = 0

      return groupSize - members
    },

    getAvatarBg () {
      if (this.orgnizer.photoURL) {
        return `background-image: url("${ this.orgnizer.photoURL }")`
      }
    },

    groupStartingTime () {
      let date = this.group.date,
          time = this.group.time

      date = dateFormat(date)
      time = changeTimeFormat(time)

      return `${date}, ${time}`
    },

    locationAddress () {
      let locationName = this.group.location.name,
          address = this.group.location.address,
          addArr = [],
          street, city, stateZip

      addArr = address.split(', ')
      street = addArr[0]
      city = addArr[1]
      stateZip = addArr[2]

      return `<p class="cus-text-p cus-text-bold">${locationName}</p>
              <p class="cus-text-p">${street}</p>
              <p class="cus-text-p">${city}, ${stateZip}</p>`
    },

    dateToCalenderIcon () {
      let date = this.group.date,
          dateArr = date.split('-'),
          month = dateArr[1],
          day = dateArr[2]

      return {
        month: month,
        day: day
      }
    },

    // Not needed

    // externalGoogleMapURL () {
    //   let placeID = this.group.location.place_id,
    //       lat = this.group.location.LatLng.lat,
    //       lng = this.group.location.LatLng.lng

    //   return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${placeID}`
    // },
  },

  methods: {
    showDetailSchedulePage () {
      this.$emit('showDetailSchedulePage')
    }
  },

  created () {
    // fetch group organizer info at creation
    let uid = this.group.uid
    this.$store.dispatch('fetchUser', this.group.uid)
    .then(orgnizer => {
      this.orgnizer = Object.assign({}, this.orgnizer, orgnizer)
    })
  },

  mounted () {
    let $card = this.$refs.infoCard
    this.mapWidth = $card.scrollWidth
    this.mapHeight = 300
  }
}
</script>


<style lang="scss">
.cus-card {
  position: relative;
  background: #ffffff;
  border-radius: 5px;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 10px;
    width: 95%;
    height: 20px;
    background: #ffffff;
    box-shadow: 0 2px 30px -3px rgba(0, 0, 0, 0.5);
    transform: translateX(-50%);
    z-index: -1;
  }

  .cus-card-section {
    position: relative;
    padding: 25px 20px 50px 20px;
    border-bottom: 1px solid #F6F8FA;

    &.with-top-border {
      border-top: 1px solid #F6F8FA;
    }

    .cus-title {
      display: inline-block;
      position: absolute;
      padding: 5px 0 5px 20px;
      top: 0;
      left: 0;
      transform: translateY(-50%);
      background: #ffffff;

      &::after {
        content: "";
        position: absolute;
        top: 50%;
        right: -10px;
        width: 5px;
        height: 15px;
        background: #6480e6;
        transform: translateY(-50%);
      }
    }
  }
}

// avatar with name below
.cus-avatar-with-name {
  display: inline-block;
  position: relative;
  z-index: 1;

  .cus-avatar-sm {
    display: block;
    position: relative;
    margin-bottom: 5px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid #F6F8FA;
    background-color: bisque;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;

    &::after {
      content: "";
      position: absolute;
      bottom: 5px;
      left: 50%;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      transform: translateX(-50%);
      background: #ffffff;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      z-index: -1;
    }
  }

  .check-icon-bg {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    width: 18px;
    height: 18px;
    background: #ffffff;
    border-radius: 50%;
    z-index: 2;

    >.icon {
      font-size: 15px;
    }
  }

  .cus-avatar-name {
    display: block;
    text-align: center;
  }
}

// status section
.status {
  display: flex;
  flex-flow: row nowrap;
  
  .countdown, .vacancy {
    display: inline-block;
    position: relative;
    left: 50%;
    width: 120px;
    transform: translateX(-50%);

    .calender {
      display: inline-block;
      width: 44px;
      height: 44px;

      // overwrite component style
      .clamp {
        height: 6px;
        min-width: auto;
        min-height: auto;

        .bar {
          height: 100%;
          min-height: auto;
        }
      }

      .month, .day {
        height: 20px;
        min-width: auto;
        min-height: auto;
        font-size: 13px;
        font-weight: 400;
      }

      .day {
        background: #ffffff;
      }
    }

    .sofa {
      display: inline-block;
      width: 45px;
      height: 40px;
    }

    .ct-text {
      display: inline-block;
      margin-left: 10px;
      vertical-align: top;

      span {
        vertical-align: text-top;
      }

      .big {
        display: inline-block;
        font-size: 20px;
        font-weight: 500;
        line-height: 20px;
      }
    }
  }

  .countdown {
    .big {
      color: #f44336;
    }
  }

  .vacancy {
    .big {
      color: #6480e6;
    }
  }
}

// description section
.description {
  .group-description {
    flex: 1;
    padding: 20px 15px;
    background: #F6F8FA;
    border-radius: 5px;
  }
}

</style>

