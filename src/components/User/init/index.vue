<template>  
<!-- <div :class="{'extra-px': !isMobile, 'fill-height': success}" v-if="user"> -->
<div>
	<AppViewHeader class="cus-app-view-header" ref="cusAppHeader"
    :steps="2" 
    :stepHeaderInfo="headerInfo" 
    v-on:changeStep="getCurrentViewIndex"></AppViewHeader>

	<!-- <transition name="fade" mode="out-in"> -->
	<v-form class="cus-app-view-body" ref="accInitForm" lazy-validation v-if="!success" @submit.prevent="updateUserInfo">

		<!-- step 1 -->
		<transition name="slide" mode="out-in">
		<keep-alive>
		<StepOne class="view-container" v-if="step == 1" 
		v-on:submit="getFromData"></StepOne>
		
		<!-- step 2 -->
		<StepTwo class="view-container" v-else-if="step == 2" 
		:user="user"
		v-on:approveAvatar="approveAvatar"></StepTwo>
		</keep-alive>
		</transition>

	</v-form>

	<!-- success page -->
	<div class="cus-app-view-body" v-else>
		<div class="app-view-container">

			<div class="avatar-preview-wrapper mb-4">
				<div class="avatar-preview" :style="avatarUrl"></div>
			</div>
      
			<h3 class="primary--text text-xs-center title">太棒了! 资料已上传完毕</h3>

      <div class="cus-btn-container" style="width: 210px; margin: 25px auto 0 auto">
        <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" @click="redirectToProfile">
          前往你的账户
        </v-btn>
      </div>

		</div>
	</div>
	<!-- </transition> -->

</div>
</template>

<script>
/* eslint-disable */
import AppViewHeader from '@/components/common/header_stepper'
import StepOne from './StepOne'
import StepTwo from './StepTwo'

export default {
	components: {
		AppViewHeader,
		StepOne,
		StepTwo
	},

	props: {
    isMobile: {
      type: Boolean,
      default: false
    }
	},
	
  data () {
		return {
			step: 1,
			userData: {},
			success: false,
			validateStep1: false,
			headerInfo: [
				{
					title: '个人资料',
          subtitle: '填写你的基本信息',
          stepLabel: '基本信息',
					valid: false
				},
				{
					title: '个人资料',
					subtitle: '上传你的用户头像',
					stepLabel: '头像',
					valid: false
				},
			]
		}
	},

	methods: {
		approveAvatar() {
			this.updateUserInfo()
		},
		
		updateUserInfo () {

      console.log('here')
			
			if ( !this.$refs.accInitForm.validate() ) {
				console.log('form not validated')
				return
			}

      let userProfile = this.userData

      this.$store.commit('setLoading', true)
			
			return new Promise((resolve, reject) => {
				// if local image
				if (this.$store.state.flimage && this.$store.state.flimageTempUrl) {
					this.$store.dispatch('uploadUserAvatar')
					.then(() => {
						this.$store.dispatch('updateUserProfile', userProfile)
						.then(() => resolve())
					})
        } 
        // if url 
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
        this.$store.commit('setLoading', false)
				this.headerInfo[1].valid = true
				this.success = true
			})
			.catch(error => {
        console.log(error)
        this.$store.commit('setLoading', false)
			})
		},

		redirectToProfile () {
			this.$router.push('/profile')
		},

		getCurrentViewIndex (index) {
			let header = this.$refs.cusAppHeader

			if (index == 2 && !this.validateStep1) {
				index = 1
			}

			// sync steps between header and body
			header.step = index
			this.step = index
		},

    // Get user input data from step 1, apply to this.userData obj
		getFromData (data) {
			let header = this.$refs.cusAppHeader,
					that = this

			Object.keys(data).forEach(key => {
        if (key == 'location') {
          that.userData.location = {}
          Object.keys(data.location.content).forEach(subkey => {
            if (data.location.content[subkey]) {
              that.userData.location[subkey] = data.location.content[subkey]
            }
          })
        } else {
          that.userData[key] = data[key].content
        }
			})

			// sync step with header and move to step 2
			this.headerInfo[0].valid = true
			this.step = 2
			header.step = 2
			this.validateStep1 = true
		}

	},

	computed: {
		user () {
			return this.$store.state.userModule.user_ref
		},

		avatarUrl () {
			if (this.user) {
				let url = this.$store.state.flimageTempUrl || this.user.photoURL
				return `background-image: url("${ url }")`
			}
		},
	},

}
</script>

<style lang="scss">
// Global
.view-container {
  height: 100%;
}

// Global
.section-wrapper {
  position: relative;
  padding: 22px 35px;
  z-index: 1;
}

// Global
.input-wrapper {
  position: relative;
  margin-bottom: 35px;
  background: #ffffff;
  border-radius: 5px;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 8px;
    left: 50%;
    width: 95%;
    height: 58%;
    background: #ffffff;
    transform: translateX(-50%);
    box-shadow: 0 2px 20px -2px rgba(0, 0, 0, 0.5);
    z-index: -1;
  }

  .input-group {
    position: relative;
    padding-left: 15px;
    padding-right: 15px;

    &:last-child {
      padding-bottom: 18px;
      border-radius: 0 0 5px 5px;
      overflow: hidden;
    }

    .input-group__input {
      background: #ffffff !important;
      padding-left: 0px !important;
      padding-right: 0px !important;

      textarea {
        padding-left: 0px !important;
        padding-right: 0px !important;
      }
    }

    .input-group__details {
      padding: 8px 0 0;
    }
  }

  .input-group--select {
    position: relative;
    margin-top: 20px;

    label {
      left: 16px;
    }

    .input-group__input {
      background: #ffffff !important;
      padding-left: 0px !important;
      padding-right: 0px !important;
    }

    .input-group__details {
      &::before {
        height: 2px !important;
        border-radius: 4px;
      }
    }
  }

  .input-group--prepend-icon {

    label {
      left: 55px !important;
    }

    .input-group__input {
      .input-group__prepend-icon {
        color: #6480e6 !important;
      }
    }

    .input-group__details {
      &::before {
        height: 2px !important;
        border-radius: 4px;
      }
    }
  }
}

// Local
.avatar-preview-wrapper {
	position: relative;
	width: 100%;
	height: 110px;

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

.image-section {
	height: 120px;
}

.no-boxshadow {
	box-shadow: none !important;
}
.border-bottom {
	border-bottom: 1px solid #eeeeee !important;
}
.fix-bottom {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
}
</style>
