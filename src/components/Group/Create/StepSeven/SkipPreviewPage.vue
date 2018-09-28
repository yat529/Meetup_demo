<template>
  <div> 
    <div class="input-wrapper" style="margin-top: 15px">
      <h3 style="font-size: 16px; text-align:center; padding: 15px 0 0">默认活动封面</h3>

      <v-text-field box
      class="input-field" 
      name="imageName" label="图片名称" 
      :value="imageName"
      hint="我们将为你的活动设置一张默认封面"
      persistent-hint
      required
      disabled
      ></v-text-field>

      <div class="preview-wrapper">
        <img :src="imageURL" alt="封面图片">
      </div>
    </div>

    <p class="subtitle mb-3" style="width: 201px; margin: 0 auto; text-align:center; line-height: 18px; font-weight: 500">是否使用这个图像</p>
    <div class="cus-btn-groups" style="margin-bottom: 35px">
      <v-btn icon dark class="green mx-0 my-0" @click="approveImageSelection">
        <v-icon>fas fa-check</v-icon>
      </v-btn>

      <v-btn icon dark class="red mx-0 my-0" @click="clearImageSelection">
        <v-icon>fas fa-times</v-icon>
      </v-btn>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
import imageDefault from './Image/Default_cover.jpg'

export default {
  data () {
    return {
      imageName: '默认封面.jpg',
      imageURL: imageDefault
    }
  },

  methods: {
    approveImageSelection () {
      this.$store.commit('setURLFileCache', this.imageURL)
      this.$emit('approveImageSelection')
    },

    clearImageSelection () {
      this.$emit('clearImageSelection')
    }
  }
}
</script>

<style lang="scss">
.preview-wrapper {
  position: relative;
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

  .preview-placeholder {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 150px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
</style>
