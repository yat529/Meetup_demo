<template>
  <div>
    <!-- country -->
    <v-select box
      class="input-field" :class="!showAutocompleteInput && !showAddress ? 'pb-fix' : ''"
      :items="country"
      v-model="selectCountry"
      hint="将根据你所在的国家来筛选显示信息"
      label="选择国家"
      single-line
      persistent-hint
      required
      :rules="selectRules"
      @change="reset"
      ></v-select>

    <!-- hide when selected from autocomplete -->
    <v-text-field class="input-field" ref="setAddress" v-show="showAutocompleteInput"
      box
      v-model="location"
      :label="label"
      :hint="hint"
      :persistent-hint="persistentHint"
      :required="true"
      :rules="rules"
      :error="manualShowError"
      :validate-on-blur="true"
      ></v-text-field>

    <!-- show when selected from autocomplete -->
    <div class="input-field" style="position: relative" v-show="!showAutocompleteInput && showAddress">
    <v-text-field ref="showAddress" box
      hint="已选择, 或者点击右侧编辑图标重新选择"
      :value="location"
      :label="label"
      :persistent-hint="persistentHint"
      :disabled="true"
      ></v-text-field>
    <v-icon id="editLocation" @click="clearLocation">far fa-edit</v-icon>
    </div>
    
    <div class="map-container" :style="{ height: mapHeight + 'px' }" v-show="selectCountry">   
      <div class="map" ref="map"></div>
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
    },

    showAutocompleteInput () {
      return !this.showAddress && !!this.selectCountry
    }
  },

  methods: {
    reset () {
      this.selectCountry = ''
    },

    clearLocation () {
      let that = this

      that.showAddress = false
      that.location = ''
      that.$emit('locationChange')
          
      that.$nextTick(() => {
        let input = that.$refs.setAddress,
            $input = input.$el.querySelector('input')

        $input.focus()
      })
    }
  },

  watch: {
    selectCountry (newVal, oldVal) {
      if(newVal) {
        this.showAddress = false
      }
    },

    showAutocompleteInput (newVal, oldVal) {
      if (newVal) {
        let indexCountry = this.country.indexOf(this.selectCountry),
            country_abbr = this.country_abbr[indexCountry],
            that = this

        that.$nextTick(() => {
    
          let elem = that.$refs.map,
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
        })
      }
    }
  },
}
</script>

<style lang="scss">
// local
.pb-fix {
  padding-bottom: 30px;
}

// local
.map-container {
  position: relative;
  width: 100%;
  padding-top: 30px;
  border-radius: 0 0 5px 5px;
  overflow: hidden;

  .map {
    height: 100%;
    background: #eeeeee;
  }
}

// local
#editLocation {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(calc(-50% - 5px));
  font-size: 16px;
  color: #637fe6;
}
</style>
