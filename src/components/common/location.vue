<template>
  <div class="location">
    <gmap-map
      :center="center"
      :zoom="zoom"
      style="width:100%;  height: 100%;"
    >
      <gmap-marker
        :position="center"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object
    }
  },
  data () {
    return {
      center: {
        lat: this.item.location.lat,
        lng: this.item.location.lng
      },
      zoom: 15
    }
  },
  created () {
    console.log('requesting')
  }
}
</script>

<style lang="scss">
.location {
  width: 100%;
  height: 100%;
}
</style>
