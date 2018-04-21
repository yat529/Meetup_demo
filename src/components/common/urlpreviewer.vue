<template>
  <v-container class="previewer">
    <v-layout>
      <v-flex xs12 sm4>
        <v-btn flat v-if="!imageUrl" class="primary">网络图片</v-btn>
        <v-btn flat class="warning" v-if="imageUrl" @click="deleteURL">重新选择</v-btn>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field name="urlInput" label="粘贴图片URL" id="urlInput" 
        hint="为了更好的展示您的MEETUP, 建议使用1024 x 768像素或更高的图片"
        persistent-hint
        v-model="imageUrl" @change="submitURL"></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <div v-if="imageUrl&&showPreview" class="preview">
          <p class="info--text mb-1">图片预览</p>
          <img :src="imageUrl" />
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
export default {
  props: {
		showPreview: {
			type: Boolean,
			default: true
    },
    defaultUrl: {
      type: String,
      default: ''
    }
	},
  data () {
    return {
      imageUrl: this.defaultUrl,
      urlSubmitted: false
    }
  },
  methods: {
    submitURL () {
      if (this.imageUrl) {
        this.$store.commit('setFileLoaderCache', {
          file: null,
          fileTempUrl: this.imageUrl
        })
      } else {
        this.$store.commit('setFileLoaderCache', {
          file: null,
          fileTempUrl: null
        })
      }
    },
    deleteURL () {
      this.imageUrl = ''
      this.$store.commit('clearFileLoaderCache')
    }
  }
}
</script>

<style lang="scss">
.previewer {
	width: 100%;
	padding: 0;

	.preview {
		img {
			width: 100%;
		}
	}
}
</style>
