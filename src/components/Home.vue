<template>
  <div class="map-wrapper" ref="homeMap"></div>
</template>

<script>
/* eslint-disable */
import {Map} from '@/plugins/googleMaps'

export default {
  data() {
    return {}
  },
  computed: {
    //
  },
  mounted () {
    let that = this,
        meetups = that.$store.state.loadedMeetups,
        elem = that.$refs.homeMap,
        option = {
          zoom: 13
        },
        map = new Map(elem, option)

    meetups.forEach(meetup => {
      let position = meetup.location.LatLng,
          date = meetup.date.split(' ')[0],
          time = meetup.date.split(' ')[1],
          size = meetup.size,
          seatHtml = '',
          members = meetup.registeredMembers

      members.forEach(member => {
        seatHtml += `<div class="seat" style="background-image: url('${member.avatar}')"></div>`
      })

      for (let i = members.length; i < size; i++) {
        seatHtml += `<div class="seat vacant"></div>`
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
            <div class="vacancy">${size} Seats Left</div>
          </div>
          <div class="action">
            <a class="button join" href="/meetup/${meetup.key}">Join</a>
            <a class="button more" href="/meetup/${meetup.key}">More</a>
          </div>
        </div>`

      // add marker
      let markerOpt = {
        position: position
      }
      map.addMarkerOverlay(markerOpt, html)
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
  z-index: 1;
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

  .info_name {
    margin: 0;
    margin-bottom: 5px;
  }
  .info_desc {
    font-size: 13px;
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
