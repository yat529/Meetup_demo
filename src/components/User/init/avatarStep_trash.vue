<template>
  <div lass="input-wrapper">

    <!-- hidden input -->
    <input type="file" name="myfile" class="myfile" 
    accept=".jpg, .jpeg, .png" ref="defaultFileInput"
    @change="onFileSelected">

    <!-- choose method -->
    <transition name="slide" mode="out-in">
    <div class="transition-wrapper section-wrapper" v-if="selectMethod">
      <h3 style="font-size: 16px; text-align:center; padding: 15px 0 0">{{ imageDataUrl || imageWebUrl ? '更改当前头像' : '上传头像' }}</h3>
      
      <div class="avatar-preview-wrapper">
        <div class="avatar-preview" :style="avatarUrlBg"></div>
      </div>
      
      <p class="subtitle" style="width: 201px; margin: 0 auto; text-align:center; line-height: 18px;">建议使用真实的头像, 这将大大降低悲剧发生的概率</p>
      
      <div class="cus-btn-container" style="width: 210px; margin: 25px auto 0 auto">
        <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" @click="seletImage">
          本地图片
        </v-btn>
      </div>

      <div class="cus-btn-container" style="width: 210px; margin: 15px auto 15px auto">
        <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" @click="selectURL">
          网络图片
        </v-btn>
      </div> 
    </div>

    <!-- selected image preview -->
    <div class="transition-wrapper section-wrapper" v-else-if="fileloader">
      <div class="input-wrapper">
        <h3 style="font-size: 16px; text-align:center; padding: 15px 0 0">预览头像</h3>

        <div class="avatar-preview-wrapper">
          <div class="avatar-preview" :style="avatarUrlBg"></div>
        </div>
   
        <v-text-field class="input-field" box
          name="imageName" label="图片名称" 
          :value="imageName"
          hint="建议使用1024 x 768像素或更高的图片"
          persistent-hint
          disabled></v-text-field>
      </div>

      <p class="subtitle mb-3" style="width: 201px; margin: 0 auto; text-align:center; line-height: 18px; font-weight: 500">是否使用这个图像</p>
      <!-- <div class="cus-btn-groups"> -->
      <div>
        <v-btn icon dark class="green mx-0 my-0" @click="approveAvatar">
          <v-icon>fas fa-check</v-icon>
        </v-btn>

        <v-btn icon dark class="red mx-0 my-0" @click="deleteImage">
          <v-icon>fas fa-times</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- url preview -->
    <div class="transition-wrapper section-wrapper" v-else-if="urlpreviewer">
      <div class="input-wrapper">
        <h3 style="font-size: 16px; text-align:center; padding: 15px 0 0">{{ imageWebUrl ? '检测到头像' : '选择头像' }}</h3>

        <div class="avatar-preview-wrapper">
          <div class="avatar-preview" :style="avatarUrlBg"></div>
        </div>

        <v-text-field class="input-field" ref="webImageUrlInput" box
          name="imageURL" 
          label="图片地址" 
          v-model="imageWebUrl"
          :hint="urlInputHintText"
          persistent-hint
          :disabled="disabledInput"></v-text-field>
      </div>

      <p class="subtitle mb-3" v-show="imageWebUrl"
      style="width: 201px; margin: 0 auto; text-align:center; line-height: 18px; font-weight: 500">是否使用这个图像</p>

      <div class="cus-btn-groups" v-show="imageWebUrl">
        <v-btn icon dark class="green mx-0 my-0" @click="approveWebImage">
          <v-icon>fas fa-check</v-icon>
        </v-btn>

        <v-btn icon dark class="red mx-0 my-0" @click="clearImageWebUrl">
          <v-icon>fas fa-times</v-icon>
        </v-btn>
      </div>

      <div class="cus-btn-container" style="width: 210px; margin: 25px auto 0 auto" v-show="!imageWebUrl">
        <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" @click="goBackToMethods">
          返回选择方式
        </v-btn>
      </div>

    </div>
    </transition>

  </div>
</template>

<script>
/* eslint-disable */
import fileloader from '@/components/common/fileloader'
import urlpreviewer from '@/components/common/urlpreviewer'

import defaultAvatarURL from './icons/defaultAvatar.svg'

export default {
  components: {
    fileloader,
    urlpreviewer
  },

  props: {
    user: {
      type: Object
    }
  },

  data () {
    return {
      selectMethod: true,
      fileloader: false,
      urlpreviewer: false,
      disabledInput: false,
      imageName: '',
      imageDataUrl: '',
      imageWebUrl: '',  // either user photoURL or web image url
      defaultAvatarURL: defaultAvatarURL,
      urlInputHintText: '当前头像图像地址'
    }
  },

  computed: {
    avatarUrlBg () {
			if (this.user) {
				let url = this.$store.state.flimageTempUrl || this.imageWebUrl || this.defaultAvatarURL
				return `background-image: url("${ url }")`
			}
    },

		hasAvatarUrl () {
			if (this.user) {
        return this.user.photoURL || false
			}
    },
    
    selectedAvatar () {
      if (this.user) {
        return this.$store.state.flimageTempUrl || false
      }
    }
  },

  methods: {
    goBackToMethods () {
      this.selectMethod = true
      this.urlpreviewer = false
    },

    selectURL () {
      this.selectMethod = false
      this.urlpreviewer = true
    },

    clearImageWebUrl () {
      let input = this.$refs.webImageUrlInput
      this.disabledInput = false
      this.imageWebUrl = ''
      this.urlInputHintText = '重新复制粘贴图像地址'
      input.focus()
    },

    approveWebImage () {
      if (this.imageWebUrl) {
        this.$store.commit('setFileLoaderCache', {
          file: null,
          fileTempUrl: this.imageWebUrl
        })

        this.approveAvatar()
      } 
    },

    approveAvatar () {
      this.$emit('approveAvatar')
    },

    seletImage () {
      this.$refs.defaultFileInput.click()
    },

    deleteImage () {
			this.imageDataUrl = ''
			this.imageName = ''
			this.$refs.defaultFileInput.value = ''
			// sync with vuex store
      this.$store.commit('clearFileLoaderCache')
      // return to prev screen
      this.fileloader = false
      this.selectMethod = true
    },
    
    onFileSelected (event) {
			let files = event.target.files
      if (!files.length) return
      
      this.selectMethod = false
      this.fileloader = true
      
			let file = files[0]
			this.imageName = file.name

			let filereader = new FileReader()
			filereader.addEventListener('load', e => {
				this.imageDataUrl = e.target.result
				// sync with vuex store
				this.$store.commit('setFileLoaderCache', {
					file: file,
					fileTempUrl: this.imageDataUrl
				})
			})
			filereader.readAsDataURL(file)
    },
  },

  created () {
    if (this.hasAvatarUrl) {
      this.imageWebUrl = this.hasAvatarUrl
      this.selectMethod = false
      this.urlpreviewer = true
    }
  }
}
</script>

<style lang="scss">
.myfile {
  display: none;
}

.transition-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.cus-btn-groups {
  display: flex;
  justify-content: space-between;
  width: 110px;
  height: 36px;
  margin: 0 auto;
  z-index: 1;

  button {
    position: relative;
    width: 36px;
    height: 36px;
  }
}



.preview-file-image {
  position: absolute;
  top: 110px;
  left: 0;
  right: 0;
}
</style>


