<template>
<v-container class="fileloader">
	<v-layout row wrap mb-4>
		<v-flex xs12 sm4>
			<v-layout row wrap justify-center align-center>
				<v-btn flat class="primary" v-if="!imageUrl" @click="seletImage">选择图片</v-btn>
				<v-btn flat class="error" v-if="imageUrl" @click="deleteImage">重新选择</v-btn>
			</v-layout>
			<input type="file" name="myfile" class="myfile" 
			accept=".jpg, .jpeg, .png" ref="defaultFileInput"
			@change="onFileSelected">
		</v-flex>
		<v-flex xs12 offset-sm1 sm7>
			<v-text-field name="imageName" label="图片名称" :value="imageName" disabled
			hint="为了更好的展示您的小组, 建议使用1024 x 768像素或更高的图片, 图片大小不超过1MB"
			persistent-hint></v-text-field>
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
		}
	},
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
			let files = event.target.files
			if (!files.length) return
			
			let file = files[0]
			this.imageName = file.name

			let filereader = new FileReader()
			filereader.addEventListener('load', (e) => {
				this.imageUrl = e.target.result
				// sync with vuex store
				this.$store.commit('setFileLoaderCache', {
					file: file,
					fileTempUrl: this.imageUrl
				})
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
