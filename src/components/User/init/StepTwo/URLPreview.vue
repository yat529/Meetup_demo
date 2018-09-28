<template>
  <div class="section-wrapper">
    <div class="input-wrapper">
      <h3 style="font-size: 16px; text-align:center; padding: 15px 0 0">{{ avatarUrl ? '检测到你的头像' : '选择头像' }}</h3>

      <div class="avatar-preview-wrapper">
        <div class="avatar-preview" :style="avatarUrlBg"></div>
      </div>

      <v-text-field class="input-field" ref="webImageUrlInput" box
        name="imageURL" 
        label="图片地址" 
        v-model="imageUrl"
        :hint="hintText"
        persistent-hint
        :disabled="!!avatarUrl"></v-text-field>
    </div>

    <div v-if="imageUrl">
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

    <div class="cus-btn-container" style="width: 210px; margin: 25px auto 0 auto" v-else>
      <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" @click="goBackToSelection">
        返回选择方式
      </v-btn>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
import defaultAvatarURL from '../icons/defaultAvatar.svg'

export default {
  props: {
    avatarUrl: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      imageUrl: this.avatarUrl,
      hintText: this.avatarUrl ? '已检测到的头像地址' : '在此处粘贴头像图片的地址',
    }
  },

  computed: {
    avatarUrlBg () {
      let url = this.imageUrl || defaultAvatarURL
      return `background-image: url("${ url }")`
    },


  },

  methods: {
    approveImage () {
      this.$emit('approveImage')
    },

    clearImage () {
      if (this.avatarUrl) {
        this.goBackToSelection()
      } else {
        this.$emit('clearImage')
      }
    },

    goBackToSelection () {
      this.$emit('return')
    }
  }
}
</script>

