<template>
  <div class="map-component">
    <v-layout class="input-wrapper">
      <v-flex xs12>
        <v-text-field label="Location" class="mt-5" required ref="setAddress"></v-text-field>
      </v-flex>
    </v-layout>
      
    <div class="map" ref="map">
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Vue from 'vue'
import {Map} from '@/plugins/googleMaps'

export default {
  data () {
    return {
      zoom: 13
    }
  },
  methods: {
    //
  },
  computed: {
    // 
  },
  mounted() {
    let that = this

    that.$nextTick(() => {
      let elem = that.$refs.map
      let input = that.$refs.setAddress.$el.querySelector('input')
      // !important, overwirte the default value set by google api
      input.placeholder = ''
      
      let option = {
        zoom: that.zoom
      }
      let map = new Map(elem, option).locate(null, false)

      map.autocomplete(input, toDB => {
        map.locate({
          position: toDB.LatLng,
          zoom: 14
        })
        that.$store.commit('setGoogleMapLocation', toDB)
      })
    })
  }
}
</script>

<style lang="scss">
.map {
  height: 200px;
  background: #eeeeee;
}
.input-wrapper {
  position: relative;

  .input-group {
    padding-top: 0;

    label {
      top: 0;
    }
  }

  .locator {
    top: 50%;
    right: 25px;
    transform: translateY(-50%);
  }
}

</style>
