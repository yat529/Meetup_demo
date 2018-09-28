<template>
  <div>
    <!-- hidden input -->
    <input type="file" name="myfile" class="myfile" 
    accept=".jpg, .jpeg, .png" ref="defaultFileInput"
    @change="onFileSelected">

    <div class="section-flex-wrapper">
      <div class="section-text xs-text-center">
        <div>建议上传活动图片</div>
        <div>以便更好的展示和宣传你的活动</div>
      </div>
      <div class="cus-btn-container" style="margin-bottom: 25px">
        <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" @click="seletImage">
          本地图片
        </v-btn>
      </div>
      <div class="cus-btn-container" style="margin-bottom: 45px">
        <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" @click="toURLPreview">
          网络图片
        </v-btn>
      </div>
      <div class="spacer"></div>
    </div>

    <div class="cus-btn-container cus-pos" style="margin-bottom: 0px" @click="toSkipPreview">
      <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0">
        跳过
      </v-btn>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data () {
    return {
      imageName: '',
      imageDataUrl: '',
    }
  },

  methods: {
    next () {
      this.$emit('nextStep')
    },

    toLocalFileSelection () {
      this.$emit('toLocalFileSelection', this.imageName)
    },

    toURLPreview () {
      this.$emit('toURLPreview')
    },

    toSkipPreview () {
      this.$emit('toSkipPreview')
    },

    seletImage () {
      this.$refs.defaultFileInput.click()
    },

    onFileSelected (event) {
			let files = event.target.files
      if (!files.length) return
      
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
        
        // redirect
        this.toLocalFileSelection()
			})
			filereader.readAsDataURL(file)
    },
  }
}
</script>

<style lang="scss">
.myfile {
  display: none;
}

.section-flex-wrapper {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .section-text {
    margin-bottom: 25px;

    div {
      text-align: center;
    }
  }

  .cus-btn-container {
    flex: 0 0 auto;
  }

  .spacer {
    height: 100px;
  }
}
</style>
