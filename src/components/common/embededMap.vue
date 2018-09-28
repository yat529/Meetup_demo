<template>
  <iframe
    :width="styleWidth"
    :height="styleHeight"
    :src="src"
    frameborder="0" style="border:0"
    allowfullscreen
    ></iframe>
</template>

<script>
/* eslint-disable */

/* 
  Import the google map api key
  located under src/googlemapsapi.js
*/
import GoogleMapsAPIKey from '@/googlemapsapi.js'

export default {
  props: {
    width: {
      type: Number
    },

    height: {
      type: Number
    },

    zoom: {
      type: Number,
      default: 15
    },

    location: {
      type: Object
    }
  },

  computed: {
    styleWidth () {
      return this.width + 'px'
    },

    styleHeight () {
      return this.height + 'px'
    },

    placeID () {
      return this.location.place_id
    },

    lat () {
      return this.location.LatLng.lat
    },

    lng () {
      return this.location.LatLng.lng
    },

    src () {
      return `https://www.google.com/maps/embed/v1/place?key=${GoogleMapsAPIKey.key}&q=place_id:${this.placeID}&center=${this.lat},${this.lng}&zoom=${this.zoom}`
    }
  }
}
</script>

<style lang="scss">
iframe {
  display: block;
  border-radius: 0 0 5px 5px;
}
</style>


