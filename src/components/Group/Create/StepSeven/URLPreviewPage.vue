<template>
  <div> 
    <div class="input-wrapper" style="margin-top: 15px">
      <h3 style="font-size: 16px; text-align:center; padding: 15px 0 0">预览图片</h3>

      <v-text-field box
      class="input-field" 
      name="imageName" label="图片名称" 
      v-model="imageURL"
      hint="建议使用1024 x 768像素或更高的图片"
      persistent-hint
      required
      ></v-text-field>

      <div class="preview-wrapper">
        <transition name="fade" mode="out-in">
        <img :src="imageURL" alt="封面图片" v-if="imageURL">
        <div class="preview-placeholder" :style="placeholderImageBg" v-else></div>
        </transition>
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
import imagePlaceholder from './Image/Image_placeholder.png'

export default {
  data () {
    return {
      imageURL: ''
    }
  },

  computed: {
    placeholderImageBg () {
      return `background-image: url("${ imagePlaceholder }")`
    }
  },

  methods: {
    approveImageSelection () {
      this.$store.commit('setURLFileCache', this.imageURL)
      this.$emit('approveImageSelection')
    },

    clearImageSelection () {
      this.imageURL = ''
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
