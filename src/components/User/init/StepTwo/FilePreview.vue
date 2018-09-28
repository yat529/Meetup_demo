<template>
  <div class="transition-wrapper section-wrapper">
    <div class="input-wrapper">
      <h3 style="font-size: 16px; text-align:center; padding: 15px 0 0">预览头像</h3>

      <div class="avatar-preview-wrapper">
        <div class="avatar-preview" :style="avatarUrlBg"></div>
      </div>

      <v-text-field class="input-field" ref="webImageUrlInput" box
        name="imageURL" 
        label="图片地址" 
        :value="imageName"
        hint="已选择的头像"
        persistent-hint
        disabled></v-text-field>
    </div>

    <p class="section-subtitle">是否使用这个图像</p>

    <div class="cus-btn-groups">
      <v-btn icon dark class="green mx-0 my-0" @click="approveImage">
        <v-icon>fas fa-check</v-icon>
      </v-btn>

      <div class="gutter"></div>
      
      <v-btn icon dark class="red mx-0 my-0" @click="clearImage">
        <v-icon>fas fa-times</v-icon>
      </v-btn>
    </div>

  </div>
</template>

<script>
/* eslint-disable */

export default {
  props: {
    avatarUrlBg: {
      type: String
    },

    imageName: {
      type: String
    },


  },

  methods: {
    approveImage () {
      this.$emit('approveImage')
    },
    clearImage () {
      this.$emit('clearImage')
    }
  }
}
</script>
