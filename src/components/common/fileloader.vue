<template>
<v-container class="fileloader">
	<v-layout>
		<v-flex xs12 sm6>
			<v-btn flat class="primary" v-if="!imageUrl" @click="seletImage">Select Image</v-btn>
			<v-btn flat class="warning" v-if="imageUrl" @click="deleteImage">Delete Image</v-btn>
			<input type="file" name="myfile" class="myfile" accept=".jpg, .jpeg, .png" ref="defaultFileInput" @change="onFileSelected">
		</v-flex>
		<v-flex xs12 sm6>
			<v-text-field name="imageName" label="Selected Image" :value="imageName" disabled></v-text-field>
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
/* eslint-disable */
export default {
	data () {
		return {
			imageName: '',
			imageUrl: ''
		}
	},
  methods: {
		seletImage () {
			this.$refs.defaultFileInput.click()
		},
		deleteImage () {
			this.imageUrl = ''
			this.imageName = ''
			this.$refs.defaultFileInput.value = ''
			// sync with vuex store
			this.$store.commit('clearFileLoaderCache')
		},
		onFileSelected (event) {
			console.log(event)
			let files = event.target.files
			if (!files.length) return
			
			let file = files[0]
			this.imageName = file.name

			let filereader = new FileReader()
			filereader.addEventListener('load', (e) => {
				this.imageUrl = e.target.result
				// sync with vuex store
				this.$store.commit('setFileLoaderCache', file)
			})
			filereader.readAsDataURL(file)
		}
	}
}
</script>

<style lang="scss" scoped>
.fileloader {
	width: 100%;
	padding: 0;

	.myfile {
		display: none;
	}
	.preview {
		img {
			width: 100%;
		}
	}
}
</style>
