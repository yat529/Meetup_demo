<template>  
<v-container class="mb-4">
	<h3 class="title mt-4 mb-4 primary--text text-xs-center">Complete Your Profile</h3>
	<v-layout row>
		<v-flex xs12 sm8 offset-sm2>
			<v-stepper v-model="step">
				<v-stepper-header>
					<v-stepper-step step="1" :complete="step > 1" editable>Personal Information</v-stepper-step>
					<v-divider></v-divider>
					<v-stepper-step step="2" :complete="step > 2" editable>Account Avatar</v-stepper-step>
					<v-divider></v-divider>
					<v-stepper-step step="3" editable>Phone Number</v-stepper-step>
				</v-stepper-header>
				<!-- stepper content -->
				<v-stepper-items>
					<!-- step 1 -->
					<v-stepper-content step="1">
						<v-card flat color="" class="mb-5" height="auto">
							<h3 class="primary--text Regular mt-3 mb-4">Upload Your Identity</h3>
							<v-layout row style="height: 100px" align-content-center>
								<v-flex xs3>
									<v-subheader class="primary--text">Nickname</v-subheader>
								</v-flex>
								<v-flex xs9>
									<v-text-field name="nickname" label="Enter your nickname" id="nickname" v-model="nickname"></v-text-field>
								</v-flex>
							</v-layout>

							<v-layout row style="height: 100px" align-content-center class="mb-3">
								<v-flex xs3>
									<v-subheader class="primary--text">Birthday</v-subheader>
								</v-flex>
								<v-flex xs9>
									<v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" offset-y full-width :nudge-right="40" min-width="290px">
										<v-text-field slot="activator" label="Birthday date" v-model="birthday" prepend-icon="event" readonly></v-text-field>
										<v-date-picker ref="picker" v-model="birthday" @change="save" min="1950-01-01" :max="new Date().toISOString().substr(0, 10)"></v-date-picker>
									</v-menu>
								</v-flex>
							</v-layout>

							<v-layout row style="height: 100px" align-content-center class="mb-3">
								<v-flex xs3>
									<v-subheader class="primary--text">Sex</v-subheader>
								</v-flex>
								<v-flex xs9>
									<v-radio-group v-model="sex" row>
										<v-radio label="Male" value="male"></v-radio>
										<v-radio label="Female" value="female"></v-radio>
									</v-radio-group>
								</v-flex>
							</v-layout>
						</v-card>
						<v-btn color="primary" @click.native="step = 2">Continue</v-btn>
					</v-stepper-content>
					<!-- step 2 -->
					<v-stepper-content step="2">
						<v-card flat color="" class="mb-5" height="auto">
							<h3 class="primary--text Regular mt-3 mb-4">Upload Your Avatar</h3>
							<div class="avatar-wrapper mb-4">
								<div class="avatar-preview" :style="avatarUrl"></div>	
							</div>
							<!-- content here -->
							<fileloader></fileloader>
						</v-card>
						<v-btn color="primary" @click.native="step = 3">Continue</v-btn>
					</v-stepper-content>
					<!-- step 3 -->
					<v-stepper-content step="3">
						<v-card flat color="" class="mb-5" height="auto">
							<h3 class="primary--text Regular mt-3 mb-4">Add Your Phone Number</h3>
							<!-- content here -->
							<v-layout row style="height: 100px" align-content-center class="mb-3">
								<v-flex xs3>
									<v-subheader class="primary--text">Phone Number</v-subheader>
								</v-flex>
								<v-flex xs9>
									<v-text-field name="phone" label="Enter your Phone Number" id="phone" v-model="phone" mask="phone"></v-text-field>
									{{phone}}
								</v-flex>
							</v-layout>
						</v-card>
						<v-btn color="primary" @click="updateUserInfo">Continue</v-btn>
						<v-btn flat @click="dialog = true">Skip</v-btn>
					</v-stepper-content>
					<!-- step 4 -->
					<v-stepper-content step="4">
						<v-card flat color="" class="mb-5" height="200px">
							<!-- content here -->
							<v-layout row class="mb-3" justify-center align-center fill-height>
									<v-icon large color="green darken-2">check_circle</v-icon>
									<h3 class="primary--text title ml-3">Great! Profile Updated</h3>
							</v-layout>
						</v-card>
						<v-btn color="primary" @click="redirectToProfile">Go to Profile</v-btn>
					</v-stepper-content>

				</v-stepper-items>
			</v-stepper>
		</v-flex>
	</v-layout>

	<!-- Confirm Model -->
	<v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="290">
      <!-- <v-btn color="primary" dark slot="activator">Open Dialog</v-btn> -->
      <v-card>
        <v-card-title class="headline">Not adding phone number?</v-card-title>
        <v-card-text>Phone number is not required by us, however, your group member can notify your any update on your meetup via phone number. PROCEED without adding it, or GO BACK.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="orange" flat @click="dialog = false">GO BACK</v-btn>
          <v-btn color="green" flat @click="updateUserInfo">PROCEED</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>

</v-container>
</template>

<script>
/* eslint-disable */
import fileloader from '@/components/common/fileloader'

export default {
	components: {
		fileloader
	},
  data () {
		return {
			step: 0,
			// user info
			nickname: '',
			sex: 'male',
			birthday: null,
			phone: '',
			// avatar: null
			menu: false,
			dialog: false
		}
	},
	methods: {
		save (birthday) {
      this.$refs.menu.save(birthday)
		},
		updateUserInfo () {
			if (!this.infoConfirmed) {
				this.step = 1
				return
			}
			let user = {
				nickname: this.nickname,
				sex: this.sex,
				birthday: this.birthday,
				phone: this.phone,
			}
			this.$store.dispatch('updateUserInfo', user)
			.then(() => {
				if (this.dialog) this.dialog = false
				this.step = 4
			})
		},
		redirectToProfile () {
			this.$router.push({
				path: '/profile'
			})
		}
	},
	computed: {
		avatarUrl () {
			let url = this.$store.state.flimageTempUrl
			return `background-image: url("${ url }")`
		},
		infoConfirmed () {
			return this.nickname && this.birthday
		}
	},
	watch: {
    menu (val) {
      val && this.$nextTick(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
}
</script>

<style lang="scss">
.avatar-wrapper {
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
		width: 80px;
		height: 80px;
		transform: translate(-50%, -50%);
		border: 4px solid #fff;
		border-radius: 50%;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
	}
}
</style>
