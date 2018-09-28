<template>
  <div>
    <!-- hide when selected from autocomplete -->
    <v-text-field ref="setAddress" v-show="showAutocompleteInput"
    box
    v-model="location"
    :label="label"
    :hint="hint"
    :persistent-hint="persistentHint"
    :required="true"
    :rules="rules"
    :error="manualShowError"
    validate-on-blur
    ></v-text-field>

    <!-- show when selected from autocomplete -->
    <div style="position: relative" v-show="!showAutocompleteInput">
    <v-text-field ref="showAddress"
    box
    hint="已选择, 或者点击右侧编辑图标重新选择"
    :value="location"
    :label="label"
    :persistent-hint="persistentHint"
    :disabled="true"
    ></v-text-field>
    <v-icon id="editLocation" @click="clearLocation">far fa-edit</v-icon>
    </div>
    
    <div class="map-container" :style="{ height: mapHeight + 'px' }">   
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
    },
    // userLocationLatLng & userLocationAddress to be replaced by userLocation Object later
    userLocationLatLng: {
      type: Object,
    },
    userLocationAddress: {
      type: String
    },
    autocompleteType: {
      type: String
    }
    
  },

  data () {
    return {
      zoom: 13,
      location: this.userLocationAddress || '',
      showAutocompleteInput: false,
      showAddress: false,
      manualShowError: false
    }
  },

  computed: {
    // 
  },

  methods: {
    clearLocation () {
      let that = this

      that.showAutocompleteInput = true
      that.showAddress = false
      that.location = ''
      // that.$emit('locationChange')
          
      that.$nextTick(() => {
        let input = that.$refs.setAddress,
            $input = input.$el.querySelector('input')

        $input.focus()
      })
    }
  },

  created () {
    this.showAutocompleteInput = this.userLocationAddress ? false : true
  },

  mounted () {
    // load loaction if locationLatLng obj is passed as prop
    if (!this.showAutocompleteInput && this.userLocationLatLng) {
      let elem = this.$refs.map,
          option = {
            center: this.userLocationLatLng,
            disableDefaultUI: false,
            zoom: 15
          }
      
      new Map(elem, option).locate(null, true)
    }
  },

  watch: {
    autocompleteType () {
      this.showAutocompleteInput = false
      this.$nextTick(() => {      
        this.showAutocompleteInput = true
      })
    },

    showAutocompleteInput (newVal, oldVal) {
      if (newVal) {
        let that = this
    
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

          if (that.userLocationLatLng) {
            // $input.focus()
            // $input.placeholder = that.userLocation.address
            option.center = that.userLocationLatLng
            map = new Map(elem, option).locate(null, true)
          } else {
            map = new Map(elem, option).locate(null, false)
          }

        let resultType = {
              types: that.autocompleteType ? [that.autocompleteType] : ['geocode'],
              componentRestrictions: { country: 'US' }
            }

        map.autocomplete($input, resultType, toDB => {
          map.locate({
            position: toDB.LatLng,
            zoom: 15
          }, true)
 
          // replace input value with formatted address
          // trim country name from address
          let address = toDB.address,
              commanIndex = address.lastIndexOf(',')

          // remove the country name
          address = address.slice(0, commanIndex)

          that.showAutocompleteInput = false
          that.showAddress = true
          that.location = address

          // serve toDB
          that.$store.commit('setGoogleMapLocation', toDB)
          that.$emit('data', toDB)
        })

      }
    }
  },
}
</script>

<style lang="scss">
.map-container {
  position: relative;
  margin-top: 20px;

  .map {
    height: 100%;
    background: #eeeeee;
  }
}

#editLocation {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(calc(-50% - 5px));
  font-size: 16px;
  color: #637fe6;
}

</style>
