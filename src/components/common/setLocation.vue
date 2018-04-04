<template>
  <div class="map-component">
    <v-layout class="input-wrapper" row style="padding-top: 18px">
      <v-flex>
        <v-text-field label="输入地址" required ref="setAddress"></v-text-field>
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

      map.autocomplete(input, null, toDB => {
        map.locate({
          position: toDB.LatLng,
          zoom: 14
        }, true)
        that.$store.commit('setGoogleMapLocation', toDB)
      })
    })
  }
}
</script>

<style lang="scss">
.map {
  height: 300px;
  background: #eeeeee;
}
.input-wrapper {
  position: relative;
  padding-top: 18px;
  margin-bottom: 5px;
  box-shadow: none !important;

  .input-group {
    padding-top: 0;

    label {
      top: 0;
    }
  }
}

</style>
