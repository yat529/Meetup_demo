<template>
  <v-container class="previewer">
    <v-layout>
      <v-flex xs12 sm4>
        <v-btn flat v-if="!imageUrl" class="primary">Preview Image</v-btn>
        <v-btn flat class="warning" v-if="imageUrl" @click="deleteURL">Delete Image</v-btn>
      </v-flex>
      <v-flex xs12 sm8>
        <v-text-field name="urlInput" label="Image URL" id="urlInput" v-model="imageUrl" @change="submitURL"></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <div v-if="imageUrl" class="preview">
          <p class="info--text mb-1">Image Preview</p>
          <img :src="imageUrl" />
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      imageUrl: '',
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
