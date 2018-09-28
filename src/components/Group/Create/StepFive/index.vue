<template>
  <v-form class="section-wrapper" ref="groupAddressForm" lazy-validation @submit.prevent="validateInput">

    <div class="input-tab-wrapper">
      <div class="input-tab" :class="autocompleteType === 'geocode' ? 'active' : ''" @click="autocompleteType = 'geocode'">详细地址</div>
      <div class="input-tab" :class="autocompleteType === 'establishment' ? 'active' : ''" @click="autocompleteType = 'establishment'">商家名称</div>
    </div>

    <div class="input-wrapper">
      <LocationInput
      :hint="locationHint"
      :persistentHint="true"
      :autocompleteType="autocompleteType"
      :userLocationLatLng="userLocationLatLng"
      v-on:data="getLocationInfo"></LocationInput>
    </div>

    <div class="cus-btn-container" style="margin-bottom: 45px">
      <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" type="submit">
        下一步
      </v-btn>
    </div>
  </v-form>
</template>

<script>
/* eslint-disable */
import LocationInput from './setLocation'

export default {
  components: {
    LocationInput
  },

  props: {
    userLocationLatLng: {
      type: Object
    }
  },

  data () {
    return {
      autocompleteType: 'geocode',
      // autocompleteTypes: ['geocode', 'establishment'],
      hints: {
        geocode: '请输入地址, 然后从菜单中选择匹配项. 例如: \'1 Main Street, New York\'',
        establishment: '请输入商家名称, 然后从菜单中选择匹配项. 例如: \'Picnic Garden\'',
      },
      // 
      locationObj: null
    }
  },

  computed: {
    locationHint () {
      return this.hints[this.autocompleteType]
    }
  },

  methods: {
    getLocationInfo (locationObj) {
      this.locationObj = Object.assign({}, this.locationObj, locationObj)
    },

    validateInput () {
      let form = this.$refs.groupAddressForm

      if ( form.validate() ) {
        this.$emit('submitLocationInfo', this.locationObj)
      }
    }
  }
}
</script>


<style lang="scss">
// Local
.input-tab-wrapper {
  display: flex;
  position: relative;
  justify-content: center;
  margin: 0 0 18px 0;
  border-radius: 5px;
  overflow: hidden;

  .input-tab {
    position: relative;
    flex: 0 0 50%;
    width: 50%;
    height: 35px;
    max-width: 200px;
    background: #ffffff;
    line-height: 35px;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
    

    &.active {
      position: relative;
      background: #6480e6;
      color: #ffffff;
    }
  }
}

</style>

