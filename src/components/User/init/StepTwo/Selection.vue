<template>
  <div lass="section-wrapper">
    <!-- hidden input -->
    <input type="file" name="myfile" class="hidden-input" 
      accept=".jpg, .jpeg, .png" ref="defaultFileInput"
      @change="onFileSelected">

    <!-- Method Selection -->
    <div class="section-wrapper">
      <h3 style="font-size: 16px; text-align:center; padding: 15px 0 0">上传头像</h3>
      
      <div class="avatar-preview-wrapper">
        <div class="avatar-preview" :style="avatarUrlBg"></div>
      </div>
      
      <p class="subtitle" style="width: 201px; margin: 0 auto; text-align:center; line-height: 18px;">建议使用真实的头像</p>
      
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

      <div class="cus-btn-container" style="width: 210px; margin: 15px auto 15px auto">
        <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" @click="selectExisted">
          继续使用现有图片
        </v-btn>
      </div> 
    </div>

  </div>
</template>

<script>
/* eslint-disable */

export default {
  props: {
    avatarUrlBg: {
      type: String
    }
  },

  data () {
    return {
      // 
    }
  },


  methods: {
    onFileSelected (e) {
			let files = e.target.files
      if (!files.length) return
      
			let file = files[0]

			let filereader = new FileReader()
			filereader.addEventListener('load', e => {
				let imageDataUrl = e.target.result
				// sync with vuex store
				this.$store.commit('setFileLoaderCache', {
					file: file,
					fileTempUrl: imageDataUrl
				})

        this.$emit('fileSelected')
			})
			filereader.readAsDataURL(file)
    },

    seletImage () {
      this.$refs.defaultFileInput.click()
    },

    selectURL () {
      this.$emit('URLSelected')
    },

    selectExisted () {
      this.$emit('ExistedSelected')
    }
  }
}
</script>

<style lang="scss">
.hidden-input {
  position: absolute;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
}
</style>
