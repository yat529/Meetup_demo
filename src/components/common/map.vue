<template>
  <div class="map-component" ref="mapComponent">
    <v-layout class="input-wrapper">
      <v-flex xs12>
        <div class="input-group input-group--required input-group--text-field primary--text">
          <label>Location</label>
          <div class="input-group__input">
            <gmap-autocomplete class="address-input" placeholder="" :class="isFocused? 'input-group--focused' : ''" v-model="location.address" @place_changed="setPlace"></gmap-autocomplete>
          </div>
          <div class="input-group__details"></div>
        </div>
      </v-flex>
      <v-btn icon flat absolute fab right small class="primary locator" @click="setMarker"><v-icon dark>my_location</v-icon></v-btn>
    </v-layout>
    
    
    <div class="map-wrapper" ref="map">
      <!-- vue2-google-maps tags -->
      <gmap-map
        :center="center"
        :zoom="zoom"
        style="width:100%;  height: 100%;"
      >
        <gmap-marker
          :position="marker.position"
          @click="center=marker.position"
        ></gmap-marker>
      </gmap-map>
    </div>
  </div>
</template>

<script>
/* eslint-disable */ 
export default {
  data () {
    return {
      center: { lat: 40.713, lng: -74.006 },
      zoom: 13,
      marker: {},
      // places: [],
      currentPlace: null,
      location: {
        address: '',
        lat: undefined,
        lng: undefined
      },
      isFocused: false
    }
  },
  methods: {
    // places from autocomplete
    setPlace(place) {
      this.currentPlace = place
    },
    // set the marker to current place
    setMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        }
        this.marker = { position: marker }
        // this.places.push(this.currentPlace)
        this.center = marker
        this.zoom = 15

        // save location
        this.location.address = this.currentPlace.formatted_address
        this.location.lat = marker.lat
        this.location.lng = marker.lng
        // save to store
        this.$store.commit('setGoogleMapLocation', this.location)

        // reset
        this.currentPlace = null
      }
    },
    // navigate/center to current location
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    }
  },
  mounted() {
    this.geolocate();
  }
}
</script>

<style lang="scss">
.map-wrapper {
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
