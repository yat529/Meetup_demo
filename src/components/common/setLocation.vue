<template>
  <div>
    <!-- country -->
    <v-select
      :items="country"
      v-model="selectCountry"
      hint="将根据你所在的国家来筛选显示信息"
      label="选择国家"
      single-line
      persistent-hint
      required
      :rules="selectRules"
    ></v-select>

    <!-- hide when selected from autocomplete -->
    <v-text-field ref="setAddress" v-show="!showAddress && selectCountry"
    v-model="location"
    :label="label" 
    :counter="counter"
    :hint="hint"
    :persistent-hint="persistentHint"
    :required="true"
    :error="manualShowError"
     ></v-text-field>

    <!-- show when selected from autocomplete -->
    <div style="position: relative" v-show="showAddress && selectCountry">
    <v-text-field ref="showAddress"
    v-model="location"
    :label="label"
    hint="已选择, 或者点击右侧编辑图标重新选择"
    :persistent-hint="persistentHint"
    :disabled="true"
     ></v-text-field>
     <v-icon id="editLocation" @click="clearLocation">far fa-edit</v-icon>
     </div>
    
    <div class="map-container" :style="{ height: mapHeight + 'px' }" v-show="selectCountry">   
      <div class="map" ref="map">
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Vue from 'vue'
import {Map} from '@/plugins/googleMaps'

export default {
  props: {
    label: {
      type: String,
      default: '输入地址'
    },
    counter: {
      type: Number
    },
    rules: {
      type: Array
    },
    hint: {
      type: String,
    },
    persistentHint: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    mapHeight: {
      type: Number,
      default: 200
    },
    error: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      zoom: 13,
      country: ['美国', '加拿大'],
      country_abbr: ['us', 'ca'],
      selectCountry: '',
      location: '',
      showAddress: false,
      manualShowError: false
    }
  },

  computed: {
    selectRules () {
      return [
        value => !!value || '请选择你所在的国家'
      ]
    }
  },

  methods: {
    clearLocation () {
      let input = this.$refs.setAddress,
          $input = input.$el.querySelector('input')

      this.location = ''
      this.showAddress = false
      this.$emit('locationChange')

      this.$nextTick(() => {
        $input.focus()
      })
    }
  },
  watch: {
    selectCountry (newVal, oldVal) {

      let indexCountry = this.country.indexOf(newVal),
          country_abbr = this.country_abbr[indexCountry]

      let that = this,
          elem = that.$refs.map,
          input = that.$refs.setAddress,
          $input = input.$el.querySelector('input')

          // !important, overwirte the default value set by google api
          $input.placeholder = ''
          that.location = ''
          that.showAddress = false

      let map,
          option = {
            zoom: that.zoom,
            disableDefaultUI: true
          }

        if (this.initalLocation) {
          $input.focus()
          $input.placeholder = this.initalLocation.address
          option.center = this.initalLocation.LatLng
          map = new Map(elem, option).locate(null, true)
        } else {
          map = new Map(elem, option).locate(null, false)
        }

      let resultType = {
            types: ['(cities)'], 
            componentRestrictions: { country: country_abbr }
          }

        map.autocomplete($input, resultType, toDB => {
          map.locate({
            position: toDB.LatLng,
            zoom: 12
          }, true)
          
          // replace input value with formatted address
          // trim country name from address
          let address = toDB.address,
              commanIndex = address.lastIndexOf(',')

          address = address.slice(0, commanIndex)

          that.showAddress = true
          that.location = address

          // serve toDB
          that.$store.commit('setGoogleMapLocation', toDB)
          that.$emit('data', toDB)
        })

    }
  },
}
</script>

<style lang="scss">
.map-container {
  position: relative;
  margin-top: 15px;

  .map {
    height: 100%;
    background: #eeeeee;
  }
}

#editLocation {
  position: absolute;
  top: 50%;
  right: 0px;
  transform: translateY(calc(-50% - 5px));
  font-size: 16px;
  color: #637fe6;
}

</style>
