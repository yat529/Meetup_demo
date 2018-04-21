<template>  
<v-container class="mb-4" v-if="user">
	<h3 class="title mt-4 mb-4 primary--text text-xs-center">完善你的资料</h3>
	<v-layout row>
		<v-flex xs12 sm8 offset-sm2>
			<v-stepper v-model="step" class="no-boxshadow">
				<v-stepper-header class="no-boxshadow border-bottom">
					<v-divider></v-divider>
					<v-stepper-step step="1" :complete="step > 1" editable>基本资料</v-stepper-step>
					<v-divider></v-divider>
					<v-stepper-step step="2" :complete="step > 2" editable>头像</v-stepper-step>
					<v-divider></v-divider>
				</v-stepper-header>
				<!-- stepper content -->
				<v-stepper-items>
					<!-- step 1 -->
					<v-stepper-content step="1">
						<v-card flat color="" class="mb-3" height="auto">
							<h3 class="primary--text Regular mt-3 mb-4">填写你的基本资料</h3>
							<v-layout row style="height: 100px" align-content-center>
								<v-flex xs3>
									<v-subheader class="primary--text">名字</v-subheader>
								</v-flex>
								<v-flex xs9 d-flex>
									<v-flex xs6 px-2>
										<v-text-field name="lname" label="姓" id="lname" v-model="lname" required :rules="[rules.required]"
										></v-text-field>
									</v-flex>
									<v-flex xs6 px-2>
										<v-text-field name="fname" label="名" id="fname" v-model="fname" required :rules="[rules.required]"
										></v-text-field>
									</v-flex>
								</v-flex>
							</v-layout>

							<v-layout row style="height: 100px" align-content-center>
								<v-flex xs3>
									<v-subheader class="primary--text">昵称</v-subheader>
								</v-flex>
								<v-flex xs9 d-flex>
									<v-text-field name="nickname" label="昵称" id="nickname" v-model="nickname" :rules="[rules.required]"
									hint="昵称将被作为你的名字公开显示" persistent-hint required
									></v-text-field>
								</v-flex>
							</v-layout>

							<v-layout row style="height: 100px" align-content-center class="mb-3">
								<v-flex xs3>
									<v-subheader class="primary--text">性别</v-subheader>
								</v-flex>
								<v-flex xs9>
									<v-radio-group v-model="sex" row>
										<v-radio label="男生" value="male"></v-radio>
										<v-radio label="女生" value="female"></v-radio>
									</v-radio-group>
								</v-flex>
							</v-layout>
						</v-card>
						<v-btn color="primary" @click.native="step = 2">继续</v-btn>
					</v-stepper-content>
					<!-- step 2 -->
					<v-stepper-content step="2">
						<v-card flat color="" class="mb-5" height="auto">
							<h3 class="primary--text Regular mt-3 mb-4">上传头像</h3>							
							<!-- content here -->
							<v-tabs v-model="activeTab" color="primary" dark grow slider-color="yellow">
								<v-tab ripple>
									上传本地图片
								</v-tab>
								<v-tab-item>
									<v-card flat>
										<v-card-text class="mt-3 image-section">
											<!-- image insertion -->
											<fileloader :showPreview="false"></fileloader>
										</v-card-text>
									</v-card>
								</v-tab-item>
								<!-- tab 2 -->
								<v-tab ripple>
									使用网络图片
								</v-tab>
								<v-tab-item>
									<v-card flat>
										<v-card-text class="mt-3 image-section">
											<urlpreviewer :showPreview="false" :defaultUrl="user.photoURL || ''"></urlpreviewer>
										</v-card-text>
									</v-card>
								</v-tab-item>
							</v-tabs>
							<div class="avatar-preview-wrapper mb-4">
								<div class="avatar-preview" :style="avatarUrl"></div>
							</div>
						</v-card>
						<v-layout>
							<v-btn color="primary" @click="updateUserInfo" v-if="hasAvatarUrl">提交</v-btn>
							<v-btn flat @click="dialog = true" v-if="!hasAvatarUrl">跳过并提交</v-btn>
							<v-spacer></v-spacer>
							<v-btn color="primary" @click.native="step = 1">返回</v-btn>
						</v-layout>
					</v-stepper-content>
					<!-- step 3 -->
					<v-stepper-content step="3">
						<v-card flat color="" class="mb-5" height="200px">
							<!-- content here -->
							<v-layout row class="mb-3" justify-center align-center fill-height>
									<v-icon large color="green darken-2">check_circle</v-icon>
									<h3 class="primary--text title ml-3">太棒了! 资料已上传完毕</h3>
							</v-layout>
						</v-card>
						<v-btn color="primary" @click="redirectToProfile">前往我的档案</v-btn>
					</v-stepper-content>

				</v-stepper-items>
			</v-stepper>
		</v-flex>
	</v-layout>

	<!-- Confirm Model -->
	<v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Not adding a photo avatar?</v-card-title>
        <v-card-text>Photo avatar is not required. However, it will give you a greater chance of being welcomed by the group organizer. PROCEED without adding it, or GO BACK.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange" flat @click="dialog = false">返回</v-btn>
          <v-btn color="green" flat @click="updateUserInfo">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>

</v-container>
</template>

<script>
/* eslint-disable */
import fileloader from '@/components/common/fileloader'
import urlpreviewer from '@/components/common/urlpreviewer'

export default {
	components: {
		fileloader,
		urlpreviewer
	},
  data () {
		return {
			step: 0,
			user: {},
			fname: '',
			lname: '',
			nickname: '',
			sex: 'male',
			phone: '',
			dialog: false,
			activeTab: null,
			rules: {
				required: (value) => !!value || '必填'
			}
		}
	},
	methods: {
		updateUserInfo () {
			if (!this.infoConfirmed) {
				this.step = 1
				return
			}
			let userProfile = {
				fullname: this.fullname,
				nickname: this.nickname,
				sex: this.sex,
				phone: this.phone
			}
			
			return new Promise((resolve, reject) => {
				// upload avatar photo
				if (this.$store.state.flimage && this.$store.state.flimageTempUrl) {
					this.$store.dispatch('uploadUserAvatar')
					.then(() => {
						this.$store.dispatch('updateUserProfile', userProfile)
						.then(() => resolve())
					})
				} 
				else if (!this.$store.state.flimage && this.$store.state.flimageTempUrl) {
					userProfile.photoURL = this.$store.state.flimageTempUrl
					this.$store.dispatch('updateUserProfile', userProfile)
					.then(() => resolve())
				}
				else {
					this.$store.dispatch('updateUserProfile', userProfile)
					.then(() => resolve())
				}
			})
			.then(() => {
				if (this.dialog) this.dialog = false
				this.step = 3
			})
		},
		redirectToProfile () {
			this.$router.push('/profile')
		}
	},
	computed: {

		fullname: {
			get () {
				return this.fname + ' ' + this.lname
			},
			set (displayName) {
				let names = displayName.split(' ')
				this.fname = names[0]
				this.lname = names[names.length - 1]
			}
		},

		avatarUrl () {
			if (this.user) {
				let url = this.$store.state.flimageTempUrl || this.user.photoURL
				return `background-image: url("${ url }")`
			}
		},

		hasAvatarUrl () {
			if (this.user) {
				if (this.$store.state.flimageTempUrl || this.user.photoURL) {
					return true
				}
				return false
			}
		},

		infoConfirmed () {
			return this.nickname.length && this.fname.length && this.lname.length
		}
	},

	created () {
		// used to retrive display name from provifer
		this.user = this.$store.state.userModule.user_ref
		if (this.user.displayName && this.user.displayName.length > 0) {
			this.fullname = this.user.displayName
		}
	}
}
</script>

<style lang="scss">
.avatar-preview-wrapper {
	position: relative;
	margin: 15px 0;
	padding: 15px;
	width: 100%;
	height: 150px;
	background: #eeeeee;

	.avatar-preview {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100px;
		height: 100px;
		transform: translate(-50%, -50%);
		border: 4px solid #fff;
		border-radius: 50%;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
	}
}

.image-section {
	height: 120px;
}

.no-boxshadow {
	box-shadow: none !important;
}
.border-bottom {
	border-bottom: 1px solid #eeeeee !important;
}
</style>
