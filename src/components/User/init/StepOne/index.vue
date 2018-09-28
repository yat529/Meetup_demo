<template>
  <v-form class="section-wrapper" ref="basicInfoForm" lazy-validation @submit.prevent="submitFormData">
    <div class="input-wrapper">
      <!-- gender -->
      <div class="icon-input-group">
        <div class="cus-radio-group">
          <div class="cus-radio-item" :class="gender.content == 'male' ? 'selected' : ''" @click="gender.content = 'male'">
            <img :src="MaleIcon" alt="男生">
            <span class="img-label">男生</span>
          </div>
          <div class="cus-radio-item" :class="gender.content == 'female' ? 'selected' : ''" @click="gender.content = 'female'">
            <img :src="FemaleIcon" alt="女生">
            <span class="img-label">女生</span>
          </div>
        </div>
      </div>

      <!-- nickname -->
      <v-text-field class="input-field" box
        name="nickname" label="昵称" id="nickname" v-model="nickname.content"
        counter="15"
        hint="昵称将作为你的名称公开显示" 
        persistent-hint
        required
        :rules="requiredRule"
        v-on:blur="validateNicknameOnBlur"></v-text-field>

      <!-- location -->
      <setLocationTextField ref="locationInput" class="input-wrapper"
        label="常住城市" 
        hint="输入城市名称, 并从自动匹配信息中选择"
        :required="true"
        :persistentHint="true"
        :mapHeight="200"
        :rules="locationRule"
        v-on:data="getLocationData"
        v-on:locationChange="location.valid = false"></setLocationTextField>
    </div>

    <div class="cus-btn-container" style="margin-top: 35px">
      <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" type="submit">
        下一步
      </v-btn>
    </div>
  </v-form>
</template>

<script>
/* eslint-disable */
import setLocationTextField from './setLocation'
// import gender icon
import MaleIcon from '../icons/male.svg'
import FemaleIcon from '../icons/female.svg'

// location address format 'New York, NY'
const location_regex = /^[\w\s]+,\s?\w{2}$/gi

export default {
  components: {
    setLocationTextField
  },

  data () {
    return {
      nickname: { content: '', valid: false},
      location: { content: {}, valid: false},
      gender: { content: 'male', valid: true},
      // cache icon
      MaleIcon: MaleIcon,
      FemaleIcon: FemaleIcon,
    }
  },

  computed: {
    requiredRule () {
			return [
				value => !!value || '必填',
			]
    },

    locationRule () {
      return [
        value => !!value || '必填, 请使用正确的格式, 例如"New York, NY", 然后从下拉菜单中选择匹配结果'
      ]
    }
  },

  methods: {
    validateNicknameOnBlur (e) {
      let value = e.target.value,
          result

      this.requiredRule.forEach(rule => {
        result = rule(value)
      })

      if (result !== true) {
        this.nickname.valid = false
        return false
      } else {
        this.nickname.valid = true
        return true
      }
      
    },

    getLocationData (data) {

      let city = data.address_details.city,
          state= data.address_details.state,
          country = data.address_details.country,
          address = data.address,
          LatLng = data.LatLng

      this.location.content = {
        city: city,
        state: state,
        country: country,
        address: address,
        LatLng: LatLng
      }

      this.location.valid = true
    },
    
    submitFormData () {
      let form = this.$refs.basicInfoForm,
          locationInput = this.$refs.locationInput,
          locationInputValue = locationInput.location,
          ruleTestResult,
          data = {}

      console.log(locationInput)

      // mannually check if location is valid
      // deal with when user not select autocomplete option or not entering value
      if (locationInput.selectCountry) {

        this.locationRule.forEach(rule => {
          ruleTestResult = rule(locationInputValue)
        })

        console.log(ruleTestResult)

        if (ruleTestResult !== true) {
          locationInput.manualShowError = true
          console.log(locationInput.manualShowError)
        }
      }

      if ( form.validate() && ruleTestResult === true ) {
        data.nickname = this.nickname
        data.location = this.location
        data.gender = this.gender

        this.$emit('submit', data)
      }
    }
  }
}
</script>

<style lang="scss">
// local
.icon-input-group {
  position: relative;
  z-index: 1;

  .cus-radio-group {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    position: relative;
    padding: 30px 15px 0 15px;

    .cus-radio-item {
      flex: 1 0 auto;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      max-width: 150px;
      padding: 5px 15px;
      border: 2px solid #ffffff;
      border-radius: 5px;

      &:first-child {
        margin-right: 15px;
      }

      &.selected {
        border: 2px solid #6480e6;
      }

      img {
        display: block;
        margin-bottom: 5px;
        width: 35px;
        height: auto;
      }
      .img-label {
        font-size: 13px;
        font-weight: 400;
      }
    }
  }
}
</style>


