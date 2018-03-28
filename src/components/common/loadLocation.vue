<template>
  <div class="location" ref="location"></div>
</template>

<script>
/* eslint-disable */
import Vue from 'vue'
import {Map} from '@/plugins/googleMaps'

export default {
  props: {
    item: {
      type: Object
    }
  },
  data () {
    return {
      center: {
        lat: this.item.location.LatLng.lat,
        lng: this.item.location.LatLng.lng
      },
      zoom: 15
    }
  },
  mounted () {
    let elem = this.$refs.location
    // locate & put marker
    let map = new Map(elem, {
      zoom: this.zoom,
      center: this.center
    }).locate(null, true)
  }
}
</script>

<style lang="scss">
.location {
  width: 100%;
  height: 100%;
}
</style>
