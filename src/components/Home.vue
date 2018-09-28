<template>
  <div class="map-wrapper" :class="isTablet ? 'offset-top-fix' : ''">
    <div class="google-map" ref="homeMap"></div>
    <!-- map controls -->
    <div id="geolocator">
      <v-btn dark icon color="primary" @click="geolocate()">
        <v-icon dark>my_location</v-icon>
      </v-btn>
    </div>

    <div id="zoomController">
      <div class="in">
        <v-btn dark icon small color="primary" @click="zoom++ && setZoom()">
          <v-icon dark>keyboard_arrow_up</v-icon>
        </v-btn>
      </div>
      <div class="out">
        <v-btn dark icon small color="primary" @click="zoom-- && setZoom()">
          <v-icon dark>keyboard_arrow_down</v-icon>
        </v-btn>
      </div>
    </div>
    <!-- input modal -->
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="330">
        <v-card class="px-3 py-3">
          <v-card-title class="headline pb-0 primary--text">显示附近的小组</v-card-title>
          <v-card-text class="pt-0 primary--text">输入ZIP CODE来搜索附近的小组</v-card-text>
          <v-layout row class="px-3 py-0">
            <v-flex xs12>
              <v-text-field
                name="address"
                label="输入ZIP CODE"
                id="addressInput"
                ref="addressInput"
                v-model="postal_code"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-card-actions class="px-2">
            <v-btn small round class="primary" ref="originAdress">确定</v-btn>
            <v-spacer></v-spacer>
            <v-btn small round outline color="primary" flat @click="close">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>

  </div>
</template>

<script>
/* eslint-disable */
import firebase from 'firebase'
import {Map} from '@/plugins/googleMaps'

export default {
  props: {
    isTablet: {
      type: Boolean,
      default: false
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      meetups: [],
      postal_code: '',
      dialog: false,
      map: {},
      zoom: 16
    }
  },
  computed: {
    // 
  },
  methods: {
    setZoom () {
      this.map._map.setZoom(this.zoom)
    },
    geolocate () {
      this.$store.commit('setLoading', true)
      this.map.geolocate(() => {
        this.$store.commit('setLoading', false)
      })
    },
    close () {
      this.dialog = false
    },
    getMonth (item) {
      const Month = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      let index = new Date(item.date).getMonth()
      return Month[index]
    },
    getDate (item) {
      return new Date(item.date).getDate() + 1
    },
    getDay (item) {
      const Day = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
      let index = new Date(item.date).getDay()
      return Day[index]
    },
  },
  mounted () {
    this.$forceUpdate()
  },
  updated () {
    let isMobile = this.isMobile

    this.$store.commit('setLoading', true)
    this.$store.dispatch('fetchMeetups')
    .then(meetups => {
      this.meetups = meetups
      let that = this,
          elem = that.$refs.homeMap,
          option = {
            zoom: this.zoom,
            disableDefaultUI: true,
            gestureHandling: 'greedy'
          },
          distance,
          position = that.$store.state.gmLocation.LatLng
          
      let input = that.$refs.addressInput.$el.querySelector('input'),
          btn = that.$refs.originAdress.$el,
          map = new Map(elem, option)

      that.map = map

      if (position.lat) {
        map.locate({
          position: position,
          zoom: 16
        }, false)
        filterMarkers(position, meetups)
      } else {
        that.dialog = true
      }

      that.$store.commit('setLoading', false)

      // if no place cache in the store, show the modal
      input.placeholder = '' // overwirte the placeholder from google map api
      map.autocomplete(input, btn, toDB => {
        map.locate({
          position: toDB.LatLng,
          zoom: 14
        }, false)
        that.$store.commit('setGoogleMapLocation', toDB)
        that.dialog = false
        filterMarkers(position, meetups)
      })

      // drag event
      map._map.addListener('dragend', () => {
        let centerLatLng = {
          lat: map._map.getCenter().lat(),
          lng: map._map.getCenter().lng()
        }

        that.$store.commit('setGoogleMapLocation', {
          name: '',
          address: '',
          address_details: {},
          LatLng: centerLatLng,
        })

        filterMarkers(centerLatLng, meetups, false)
      })

      // helper function 
      function filterMarkers (myLocation, meetups, autoBound = true) {
        let latlngbounds = autoBound ? new google.maps.LatLngBounds() : null,
            myLocationLatLng = new google.maps.LatLng(myLocation),
            animationDelay = 1000

        meetups.forEach((meetup, index) => {
          let meetupLocation = meetup.location.LatLng,
              meetupLocationLatLng = new google.maps.LatLng(meetupLocation)

          let hasMarker = map.markers.find(marker => {
            return marker.getPosition().equals(meetupLocationLatLng)
          })
          if (hasMarker) return

          let distance = google.maps.geometry.spherical.computeDistanceBetween(meetupLocationLatLng, myLocationLatLng) / 1000
          if (distance > 5) return

          console.log(meetup)

          let date = meetup.date,
              time = meetup.time,
              size = meetup.size,
              seatHtml = ''

          let members = formatMembers(meetup.registeredMembers),
              seatsLeft = parseInt(size) - parseInt(members.length) - 1,
              seatsLeftText = seatsLeft > 0 ? '剩余' + seatsLeft + '个位置' : '小组已满'

          // add markers
          if (members && size <= 10 && !isMobile) {
            
            members.forEach(member => {
              console.log(member.photoURL)
              seatHtml += `<div class="seat" style="background-image: url('${member.photoURL}')"></div>`
            })

            for (let i = members.length; i < size - 1; i++) {
              seatHtml += `<div class="seat vacant"></div>`
            }
          } else if (isMobile) {
            seatHtml += `<div class="seat" style="background-image: url('${members[0].photoURL}')"></div>`
            seatHtml += `<div class="seat vacant"><span>更多</span></div>`
          }

          let imageKey = Object.keys(meetup.imageURLs)[0]

          console.log(isMobile)
          
          let html = `
            <div class="cus_info_container ${isMobile ? 'small' : ''}">
              <div class="mini-cldr-wrapper custom-dimension-class">
                <div class="clamp">
                  <div class="bar"></div>
                  <div class="bar"></div>
                </div>
                <div class="month red">
                  <span>${that.getMonth(meetup)} </span>
                </div>
                <div class="day white">
                  <span>${that.getDate(meetup)}日</span>
                </div>
              </div>
  
              <div class="image" style="background-image: url('${meetup.imageURLs[imageKey]}')">
                <div class="schedule" style="display: ${isMobile? 'block' : 'none'}">
                  <div class="time v-bar">${time}开始</div>
                  <div class="vacancy">${seatsLeftText}</div>
                </div>
              </div>
              <div class="infoBox">
                <h3 class="info_name">${meetup.title}</h3>
                <div class="info_desc">${meetup.description}</div>
              </div>
              <div class="seats">
                <div class="seat organizer" style="background-image: url('${meetup.organizer.photoURL}')"></div>
              `
              + seatHtml +
              `
              </div>
              <div class="schedule" style="display: ${isMobile? 'none' : 'block'}">
                <div class="time v-bar">${time}开始</div>
                <div class="vacancy">${seatsLeftText}</div>
              </div>
              <div class="action">
                <a class="button join" href="/meetup/${meetup.key}">参加</a>
              </div>
            </div>`

          // add marker
          let markerOpt = {
            position: meetupLocation,
            animation: google.maps.Animation.DROP
          }
          console.log(markerOpt)
          // setTimeout(, animationDelay * index)
          map.addMarkerOverlay(markerOpt, html)
          

          // whether to autobound markers
          if (autoBound && latlngbounds) {
            latlngbounds.extend(meetupLocationLatLng);
            map._map.fitBounds(latlngbounds)
            map._map.setZoom(14)
          }

          // helper
          function formatMembers (members) {
            let array = []
            for (let key in members) {
              array.push(members[key])
            }
            return array
          }
        })
      }
    })
  }
}
</script>

<style lang="scss">
.map-wrapper {
  position: fixed !important;
  width: 100%;
  top: 64px;
  bottom: 0;
  margin: 0;
  padding: 0;
  z-index: 0;

  &.offset-top-fix {
    top: 56px;
  }
}

.google-map {
  width: 100%;
  height: 100%;
}

#geolocator {
  position: absolute;
  top: 25px;
  right: 25px;
  width: 50px;
  height: 50px;

  .btn {
    position: absolute;
    margin: 0;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .btn__content {
      box-shadow: 0 2px 15px -3px rgba(0, 0, 0, 0.7)
    }
  }
}

#zoomController {
  position: absolute;
  bottom: 70px;
  right: 25px;
  width: 50px;
  height: 50px;

  .in,
  .out {
    position: relative;
    width: 100%;
    height: 50px;

    .btn {
      position: absolute;
      margin: 0;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      .btn__content {
        box-shadow: 0 2px 15px -3px rgba(0, 0, 0, 0.7)
      }
    }
  }
}

// overlay style
.cus_info_container {
  position: relative;
  width: 300px;
  height: auto;
  background: #eeeeee;
  border: 5px solid #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 15px -6px rgba(0, 0, 0, 0.4);

  &.small {
    width: 200px;

    .mini-cldr-wrapper {
      > .month,
      > .day,
      > .clamp {
        min-width: 47px;
      }

      > .month {
        min-height: 21px;
      }

      > .day {
        min-height: 23px;
        font-size: 13px;
        font-weight: 400;
      }

      > .clamp {
        min-height: 7px;
        .bar {
          min-height: 7px;
        }
      }
    }

    .image {
      position: relative;
      height: 120px;
      margin-bottom: 0px;
    }

    .infoBox {
      padding: 10px;
    }

    .seats {
      padding: 0px 10px;
      height: 45px;

      .seat {
        position: relative;
        span {
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 30px;
          transform: translate(-50%, -50%);
          font-size: 13px;
          font-weight: 300;
          text-align: center;
        }
      }
    }

    .schedule {
      position: absolute;
      padding: 5px 10px 0px 10px;
      left: 0;
      bottom: 0;
      width: 100%;
      background: #ffffff;
      opacity: 0.7;

      > div {
        font-size: 13px;
        font-weight: 500;
      }

      .vacancy {
        float: right;
      }
    }

    .action {
      display: flex;
      justify-content: center;
      padding: 10px;
      margin-bottom: 0px;
    }
  }
}

.close {
  display: inline-block;
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 20px;
  color: rgba(255,255,255, 1);
  // background: #fff;
  cursor: pointer;
  z-index: 99;

  &:hover {
    color: rgba(255,255,255, 0.8);
  }
}

.image {
  position: relative;
  top: 0;
  width: 100%;
  height: 180px;
  margin-bottom: 10px;
  border-radius: 10px 10px 0 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.infoBox {
  padding: 10px 20px;

  .info_name,
  .info_desc {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .info_name {
    margin: 0;
    margin-bottom: 5px;
    -webkit-line-clamp: 2;
  }
  .info_desc {
    font-size: 13px;
    -webkit-line-clamp: 3;
  }
}

.cus_info_container > .seats {
  padding: 10px 20px 0 20px;;
  overflow: hidden;

  .seat {
    float: left;
    width: 40px;
    height: 40px;
    margin-left: 10px;
    margin-bottom: 5px;
    border: 3px solid #fff;
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    box-shadow: 0 1px 7px -3px rgba(0, 0, 0, 0.3);
    /* replace by user icon */
    background-color: antiquewhite;
  }

  .seat:nth-child(5n+1) {
    margin-left: 0;
  }

  .seat.vacant {
    background-color: #eeeeee;
  }
}

.schedule {
  position: relative;
  padding: 10px 20px;
  overflow: hidden;

  .time, .vacancy {
    float: left;
    position: relative;
    height: 18px;
    line-height: 18px;
    position: relative;
    margin-left: 0;
    font-size: 13px;
    font-weight: bold;
    text-align: left;
  }

  .vacancy {
    margin-left: 20px;
  }

  .v-bar::after {
    content: "";
    position: absolute;
    width: 2px;
    height: 8px;
    top: 50%;
    right: -11px;
    transform: translateY(-50%);
    background: #fff;
  }
}


.action {
  overflow: hidden;
  padding: 10px 20px;
  margin-bottom: 5px;

  .button {
    display: inline-block;
    padding: 5px 25px;
    margin: 0px;
    border-radius: 7px;
    outline: none;
    background: #a1887f !important;
    color: #ffffff;
    text-decoration: none;
    font-weight: 500;
    background: none;
    box-shadow: 0 2px 10px -5px rgba(0, 0, 0, 0.7);
    transition: 0.1s;
    cursor: pointer;
  }

  .button:hover {
    background: #ffffff !important;
    color: #a1887f;
  }

  .join, .more {
    margin: 0;
  }

  .join {
    margin-right: 0px;
  }
}


.mini-cldr-wrapper {
  position: absolute;
  top: 10px;
  left: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px -3px rgba(0, 0, 0, 0.7);
  z-index: 2;

  > .month,
  > .day  {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    min-width: 55px;
  }

  > .month {
    justify-content: flex-start;
    align-items: flex-end;
    padding-left: 7px;
    min-height: 23px;
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    border-radius: 8px 8px 0 0;
  }

  > .day {
    min-height: 30px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 0 0 8px 8px;
  }

  > .clamp {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-width: 60px;
    height: 20%;
    min-height: 10px;
    transform: translateY(-50%);

    .bar {
      position: absolute;
      width: 10%;
      height: 20%;
      min-height: 10px;
      background: #f1f1f1;
      border-radius: 3px;

      &:first-child {
        left: 22%;
      }
      &:last-child {
        right: 22%;
      }
    }
  }
}

</style>
