<template>
  <v-container class="previewer">
    <v-layout row wrap mb-4>
      <v-flex xs12 mb-3>
        <v-layout row wrap justify-center align-center>
          <v-btn flat class="error" v-if="imageUrl" @click="deleteURL">重新选择</v-btn>
        </v-layout>
      </v-flex>
      <v-flex xs12>
        <v-text-field name="urlInput" label="粘贴图片URL" id="urlInput" 
        hint="为了更好的展示您的小组, 建议使用1024 x 768像素或更高的图片"
        persistent-hint
        v-model="imageUrl" @change="submitURL"></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
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
