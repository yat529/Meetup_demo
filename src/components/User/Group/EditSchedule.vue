<template>
  <div class="cus-full-page">     
    <div class="cus-card no-boxshadow">
      <div class="cus-card-section cus-pb-20">编辑小组计划</div>

      <div class="cus-card-section">
        <v-text-field multi-line box
          class="input-field"
          label="活动内容"
          v-model="content"
          :rules="[() => content.length > 0 || '请输入活动内容', () => content.length <= 300 || '不超过300个字']"
          hint="必填"
          persistent-hint
          :counter="300"
          validate-on-blur
          rows="5"
          required></v-text-field>
      </div>

      <div class="cus-card-section">
        <v-dialog
          ref="timePicker"
          persistent
          v-model="timeModal"
          lazy
          full-width
          width="290px"
          :return-value.sync="time"
        >
          <v-text-field
            slot="activator"
            label="选择时间"
            v-model="time"
            prepend-icon="fas fa-clock"
            hint="点击并从选择活动时间"
            persistent-hint
            :rules="[() => !!time || '请选择活动时间']"
            required
            readonly
          ></v-text-field>
          <v-time-picker v-model="time" actions>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="timeModal = false">取消</v-btn>
            <v-btn flat color="primary" @click="$refs.timePicker.save(time)">确定</v-btn>
          </v-time-picker>
        </v-dialog>
      </div>

      <div class="cus-card-section">
        <div class="input-tab-wrapper">
          <div class="input-tab" :class="autocompleteType === 'geocode' ? 'active' : ''" @click="autocompleteType = 'geocode'">详细地址</div>
          <div class="input-tab" :class="autocompleteType === 'establishment' ? 'active' : ''" @click="autocompleteType = 'establishment'">商家名称</div>
        </div>

        <div class="input-wrapper">
          <LocationInput
          :mapHeight="300"
          :hint="locationHint"
          :persistentHint="true"
          :autocompleteType="autocompleteType"
          :userLocationLatLng="userLocationLatLng"
          :userLocationAddress="userLocationAddress"
          v-on:data="getLocationInfo"></LocationInput>
        </div>
      </div>

      <div class="cus-card-section cus-flex-row cus-pb-20">
        <div @click="closeSchedulePage">关闭</div>
      </div>

    </div>
  </div>
</template>

<script>
/* eslint-disable */
import LocationInput from '../../Group/Create/StepFive/setLocation'

export default {
  components: {
    LocationInput
  },

  props: {
    group: {
      type: Object,
      required: true
    },

    planItem: {
      type: Object,
      required: true
    },

    // Note: not required if create new schedule item
    scheduleItem: {
      type: Object,
      required: false
    }
  },

  data () {
    return {
      timeModal: false,
      time: this.scheduleItem ?  this.scheduleItem.time : null,
      content: this.scheduleItem ? this.scheduleItem.content : '',
      // 
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
    },

    userLocationLatLng () {
      if (this.scheduleItem) {
        return this.scheduleItem.location.LatLng
      }
      else if (this.user) {
        return this.user.location.LatLng
      }
    },

    userLocationAddress () {
      if (this.scheduleItem) {
        let address = this.scheduleItem.location.address,
            // remove the country name
            commanIndex = address.lastIndexOf(',')

        return address.slice(0, commanIndex)
      }
    }
  },

  methods: {
    getLocationInfo (locationObj) {
      this.locationObj = Object.assign({}, this.locationObj, locationObj)
    },

    closeSchedulePage () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
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
