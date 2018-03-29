<template>
  <div class="map-wrapper" >
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
      <v-dialog v-model="dialog" persistent max-width="350">
        <v-card class="px-2 py-2">
          <v-card-title class="headline">Show Nearby Meetups</v-card-title>
          <v-card-text>Enter an address or postal code to start</v-card-text>
          <v-layout row class="px-3 py-3">
            <v-flex xs12>
              <v-text-field
                name="address"
                label="Enter address"
                id="addressInput"
                ref="addressInput"
                v-model="postal_code"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-card-actions class="px-2">
            <v-spacer></v-spacer>
            <!-- <v-btn color="green darken-1" flat @click.native="dialog = false">Disagree</v-btn> -->
            <v-btn color="primary" flat ref="originAdress">Enter</v-btn>
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
  data() {
    return {
      postal_code: '',
      dialog: false,
      map: {},
      zoom: 13
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
    }
  },
  created () {
    // firebase.database().ref('meetups')
    this.$store.commit('setLoading', true)
  },
  mounted () {
    let that = this,
        meetups = that.$store.state.loadedMeetups,
        elem = that.$refs.homeMap,
        option = {
          zoom: this.zoom,
          disableDefaultUI: true
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
        zoom: 14
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
          myLocationLatLng = new google.maps.LatLng(myLocation)

      meetups.forEach(meetup => {
        let meetupLocation = meetup.location.LatLng,
            meetupLocationLatLng = new google.maps.LatLng(meetupLocation)

        let hasMarker = map.markers.find(marker => {
          return marker.getPosition().equals(meetupLocationLatLng)
        })
        if (hasMarker) return

        let distance = google.maps.geometry.spherical.computeDistanceBetween(meetupLocationLatLng, myLocationLatLng) / 1000
        if (distance > 5) return

        let date = meetup.date.split(' ')[0],
            time = meetup.date.split(' ')[1],
            size = meetup.size,
            seatHtml = '',
            members = meetup.registeredMembers,
            seatsLeft = parseInt(size) - parseInt(members.length) - 1,
            seatsLeftText = seatsLeft !== 0 ? (seatsLeft !== 1 ? seatsLeft + ' seats left' : 'Last seat') : 'Group Full'

        // add markers
        if (members && size <= 10) {
          members.forEach(member => {
            seatHtml += `<div class="seat" style="background-image: url('${member.avatar}')"></div>`
          })

          for (let i = members.length; i < size - 1; i++) {
            seatHtml += `<div class="seat vacant"></div>`
          }
        }
        
        let html = `
          <div class="cus_info_container">
            <div class="image" style="background-image: url('${meetup.imageUrl}')"></div>
            <div class="infoBox">
              <h3 class="info_name">${meetup.title}</h3>
              <div class="info_desc">${meetup.description}</div>
            </div>
            <div class="seats">
              <div class="seat organizer" style="background-image: url('${meetup.organizer.avatar}')"></div>
            `
            + seatHtml +
            `
            </div>
            <div class="schedule">
              <div class="date bar">${date}</div>
              <div class="time bar">${time}</div>
              <div class="vacancy">${seatsLeftText}</div>
            </div>
            <div class="action">
              <a class="button join" href="/meetup/${meetup.key}">Join</a>
              <a class="button more" href="/meetup/${meetup.key}">More</a>
            </div>
          </div>`

        // add marker
        let markerOpt = {
          position: meetupLocation,
          animation: google.maps.Animation.DROP
        }
        map.addMarkerOverlay(markerOpt, html)

        // whether to autobound markers
        if (autoBound && latlngbounds) {
          latlngbounds.extend(meetupLocationLatLng);
          map._map.fitBounds(latlngbounds)
          map._map.setZoom(14)
        }
      })
    }

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
  z-index: 1;
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
    transform: translate(-50%, -50%)
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
      transform: translate(-50%, -50%)
    }
  }
}

// overlay style
.cus_info_container {
  position: relative;
  width: 300px;
  height: auto;
  background: #eeeeee;
  box-shadow: 0 2px 10px -6px rgba(0, 0, 0, 0.3)
}

.close {
  display: inline-block;
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background: #fff;
  cursor: pointer;
  z-index: 99;
}

.image {
  position: relative;
  top: 0;
  width: 100%;
  height: 180px;
  margin-bottom: 10px;
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

.seats {
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
  padding: 10px 20px;

  .date, .time, .vacancy {
    display: inline-block;
    position: relative;
    margin-left: 0;
    font-size: 13px;
    font-weight: bold;
    text-align: left;
    vertical-align: top;
  }

  .bar::after {
    content: "";
    position: absolute;
    width: 2px;
    height: 8px;
    top: 50%;
    right: -11px;
    transform: translateY(-50%);
    background: #fff;
  }

  .date, .time {
    margin-right: 15px;
  }
}


.action {
  overflow: hidden;
  padding: 10px 20px;
  margin-bottom: 10px;

  .button {
    display: inline-block;
    padding: 5px 15px;
    border: 2px solid #fff;
    outline: none;
    text-decoration: none;
    background: none;
    transition: 0.2s;
    cursor: pointer;
  }

  .button:hover {
    background: #fff;
  }

  .join, .more {
    margin: 0;
  }

  .join {
    margin-right: 15px;
  }
}


    

</style>
