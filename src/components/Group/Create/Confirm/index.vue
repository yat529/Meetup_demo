<template>
  <div class="section-wrapper"> 
    <div class="input-wrapper" style="margin-top: 15px">
      

      <!-- <v-text-field box
        class="input-field" 
        name="imageName" label="图片名称" 
        :value="imageName"
        hint="建议使用1024 x 768像素或更高的图片"
        persistent-hint
        disabled></v-text-field> -->

      <div class="preview-wrapper border-radius-top">
        <img :src="imgUrl" alt="封面图片">
      </div>

      <h3 style="font-size: 16px; text-align:center; padding: 15px 0 0">预览小组信息</h3>

      <v-text-field box
        class="input-field" 
        name="type" label="活动类型" 
        :value="type"
        hint="你选择的活动类型"
        persistent-hint
        disabled></v-text-field>

      <v-text-field box
        class="input-field" 
        name="category" label="活动主题" 
        :value="category"
        hint="你选择的活动主题"
        persistent-hint
        disabled></v-text-field>

      <v-text-field box
        class="input-field" 
        name="title" label="活动标题" 
        :value="title"
        hint="你的活动标题"
        persistent-hint
        disabled></v-text-field>

      <v-text-field box
        class="input-field" 
        name="description" label="活动内容" 
        :value="description"
        hint="你的活动内容"
        persistent-hint
        disabled></v-text-field>

      <v-text-field box
        class="input-field" 
        name="groupSize" label="活动人数" 
        :value="groupSize"
        hint="此活动人数上限"
        persistent-hint
        disabled></v-text-field>

      <v-text-field box
        class="input-field" 
        name="date" label="活动日期" 
        :value="date"
        hint="此活动的日期"
        persistent-hint
        disabled></v-text-field>

      <v-text-field box
        class="input-field" 
        name="time" label="活动时间" 
        :value="time"
        hint="此活动的时间"
        persistent-hint
        disabled></v-text-field>

      <v-text-field box
        class="input-field" 
        name="location" label="活动地址" 
        :value="locationAddress"
        hint="此活动的地址"
        persistent-hint
        disabled></v-text-field>

      <div class="map-container border-radius-bottom">   
        <div class="map" ref="map"></div>
      </div>
    </div>

    <div class="cus-btn-container">
      <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" @click="submit">
        创建你的米团
      </v-btn>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
import {Map} from '@/plugins/googleMaps'

export default {
  props: {
    type: {
      type: String
    },
    category: {
      type: String
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    groupSize: {
      type: Number
    },
    location: {
      type: Object
    },
    date: {
      type: String
    },
    time: {
      type: String
    }
  },

  data () {
    return {
      //
    }
  },

  computed: {
    imgUrl () {
      return this.$store.state.flimageTempUrl
    },

    locationLatLng () {
      return {
        lat: this.location.LatLng.lat,
        lng: this.location.LatLng.lng
      }
    },

    locationAddress () {
      return this.location.address
    }
  },

  methods: {
    submit () {
      this.$emit('submitGroupCreation')
    }
  },

  mounted () {
    let elem = this.$refs.map,
        location = this.location,
        map,
        option

    if (location) {
      option = {
        zoom: 13,
        disableDefaultUI: true,
        center: this.locationLatLng
      }

      this.$nextTick(() => {
        map = new Map(elem, option).locate(null, true)
      })
    }
  }
}
</script>

<style lang="scss">
.preview-wrapper {
  margin-top: 20px;
  width: 100%;
  height: auto;
  border-radius: 0 0 5px 5px;
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: auto;
    min-height: 80px;
  }
}

.map-container {
  position: relative;
  margin-top: 20px;
  height: 200px;

  .map {
    height: 100%;
    background: #eeeeee;
  }
}

// Global
.border-radius-top {
  border-radius: 5px 5px 0 0 !important;
  overflow: hidden;
}

// Global
.border-radius-bottom {
  border-radius: 0 0 5px 5px !important;
  overflow: hidden;
}



</style>
