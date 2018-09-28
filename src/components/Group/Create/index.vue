<template>
  <div class="cus-view-container">
    <AppViewHeaderAppHeader class="cus-app-view-header"
      :step="step"
      :headerInfo="headerInfo"
      :stepperInfo="stepperInfo"
      :showArrowBtn="!showCompletePage"
      :showStepperIndicator="!showCompletePage"
      v-on:nextStep="submitCurrentStep"
      v-on:prevStep="prevStep"></AppViewHeaderAppHeader>
    
    <div id="group_creation" class="cus-app-view-body" v-if="!showCompletePage">
      <keep-alive>
      <transition-group name="slide" mode="out-in">
      <StepOne class="view-container" v-show="step === 1" key="StepOne" ref="StepOne"
        v-on:submitType="submitType"></StepOne>

      <StepTwo class="view-container" v-show="step === 2" key="StepTwo" ref="StepTwo"
        v-on:submitCategory="submitCategory"></StepTwo>

      <StepThree class="view-container" v-show="step === 3" key="StepThree" ref="StepThree"
        :users="userFriendList"
        v-on:submitFriendList="submitFriendInvitation"></StepThree>

      <StepFour class="view-container" v-show="step === 4" key="StepFour" ref="StepFour"
        v-on:submitGroupInfo="submitGroupInfo"></StepFour>

      <StepFive class="view-container" v-show="step === 5" key="StepFive" ref="StepFive"
        :userLocationLatLng="userLocationLatLng"
        v-on:submitLocationInfo="submitLocationInfo"></StepFive>

      <StepSix class="view-container" v-show="step === 6" key="StepSix" ref="StepSix"
        v-on:submitDateTime="submitDateTime"></StepSix>

      <StepSeven class="view-container" v-show="step === 7" key="StepSeven" ref="StepSeven"
        v-on:submitImage="submitImage"></StepSeven>

      <ConfirmationPage class="view-container" v-if="step === 8 && showConfirmationPage" key="ConfirmationPage"
        :type="type"
        :category="category"
        :title="title"
        :description="description"
        :groupSize="groupSize"
        :location="location"
        :date="date"
        :time="time"
        v-on:submitGroupCreation="submitGroupCreation"></ConfirmationPage>

      </transition-group>
      </keep-alive>
    </div>

    <div class="cus-app-view-body" v-else>
      <CompletePage :nickname="nickname"
        v-on:redirect="redirect"></CompletePage>
    </div>
    
  </div>
</template>

<script>
/* eslint-disable */
import AppViewHeaderAppHeader from './header'

import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'
import StepFour from './StepFour'
import StepFive from './StepFive'
import StepSix from './StepSix'
import StepSeven from './StepSeven'
import ConfirmationPage from './Confirm'
import CompletePage from './Complete'

export default {
  components: {
    AppViewHeaderAppHeader,
    StepOne,
    StepTwo,
    StepThree,
    StepFour,
    StepFive,
    StepSix,
    StepSeven,
    ConfirmationPage,
    CompletePage
  },

  data () {
    return {
      step: 1,
      headerInfo: [
        {
          title: '创建新的米团',
          subtitle: '填写活动信息, 开启米团之旅',
        }
      ],
      tabInfo: [
        {
          step: '第一步:',
          content: '选择活动类型',
        },
        {
          step: '第二步:',
          content: '选择活动主题',
        },
        {
          step: '第三步:',
          content: '邀请好友参加',
        },
        {
          step: '第四步:',
          content: '填写活动信息',
        },
        {
          step: '第五步:',
          content: '填写活动地址',
        },
        {
          step: '第六步:',
          content: '填写活动时间',
        },
        {
          step: '第七步:',
          content: '上传活动封面图片',
        },
        {
          step: '第八步:',
          content: '确认并创建你的米团',
        },
      ],
      showConfirmationPage: false,
      showCompletePage: false,
      // property for db
      type: '',
      category: '',
      friendInvitationList: [],
      title: '',
      description: '',
      groupSize: '',
      location: null,
      date: '',
      time: '',
      // mitwan key
      key: ''
    }
  },

  computed: {
    stepperInfo () {
      if (this.showCompletePage) {
        return [
          {
            step: '恭喜:',
            content: '你的米团已成功创建',
          }
        ]
      } else {
        return this.tabInfo
      }
    },

    // User_ref Info from Store
    user () {
      return this.$store.state.userModule.user_ref
    },

    nickname () {
      if (this.user) {
        return this.user.nickname
      }
    },

    userLocationLatLng () {
      if (this.user) {
        return this.user.location.LatLng
      }
    },

    userLocationCountry () {
      if (this.user) {
        return this.user.location.country
      }
    },

    uid () {
      if (this.user) {
        return this.user.uid
      }
    },

    userFriendList () {
      if (this.user) {
        return this.$store.state.userModule.friends
      }
    }
  },

  methods: {
    // used when header navi arrow is clicked
    submitCurrentStep () {
      switch (this.step) {
        case 1:
          this.$refs.StepOne.submit()
          break
        case 2: 
          this.$refs.StepTwo.submit()
          break
        case 3: 
          this.$refs.StepThree.submit()
          break
        case 4: 
          this.$refs.StepFour.validateInput()
          break
        case 5: 
          this.$refs.StepFive.validateInput()
          break
        case 6: 
          this.$refs.StepSix.validateInput()
          break
        case 7: 
          this.$refs.StepSeven.approveImageSelection()
          break
      }
    },

    validateInfo () {
      return this.type && this.category
             && this.title && this.description && this.groupSize 
             && this.location && this.date && this.time
             && this.$store.state.flimageTempUrl
    },

    nextStep () {
      if (this.step <= this.stepperInfo.length) {
        if (this.step === this.stepperInfo.length - 1) {
          if ( !!this.validateInfo() ) {
            this.showConfirmationPage = true
          } else {
            this.showAlertModal = true
            return
          }
        }
        this.step ++
      }
    },

    prevStep () {
      if (this.step > 1) {
        this.step --
      }
    },

    submitType (type) {
      this.type = type
      this.nextStep()
    },

    submitCategory (category) {
      this.category = category
      this.nextStep()
    },

    submitFriendInvitation (userList) {
      this.friendInvitationList = userList
      this.nextStep()
    },

    skipFriendInvitation () {
      this.friendInvitationList = []
      this.nextStep()
    },

    submitGroupInfo (infoObj) {
      this.title = infoObj.title
      this.description = infoObj.description
      this.groupSize = infoObj.groupSize
      this.nextStep()
    },

    submitLocationInfo (locationObj) {
      this.location = Object.assign({}, this.location, locationObj)
      this.nextStep()
    },

    submitDateTime (dateTimeObj) {
      this.date = dateTimeObj.date
      this.time = dateTimeObj.time
      this.nextStep()
    },

    submitImage () {
      this.showConfirmationPage = true
      this.nextStep()
    },

    submitGroupCreation () {
      // create group
      const mitwan = {
        type: this.type,
        category: this.category,
        title: this.title,
        description: this.description,
        group_size: this.groupSize,
        location: this.location,
        date: this.date,
        time: this.time,
        uid: this.uid,
        date_created: Date.now()
      }

      this.$store.commit('setLoading', true)
      this.$store.dispatch('createMitwan', mitwan)
      .then(key => {
        // invite friend
        let that = this,
            invitedFriends = that.friendInvitationList

        if (invitedFriends.length) {
          invitedFriends.forEach(friend => {
            // remove the checked property
            that.$delete(friend, 'approved')
            // that.$store.dispatch('sendGroupInvitation', {
            //   target_user: friend, 
            //   meetup_key: key
            // })
          })
        }

        that.key = key
        that.step = 1
        that.showConfirmationPage = false
        that.showCompletePage = true
        that.$store.commit('setLoading', false)
      })
    },

    redirect () {
      this.$router.push('/profile/groups/' + this.key)
    }

  },

  created () {
    this.$store.commit('setLoading', true)

    // fade loading
    this.$store.dispatch('defaultLoading')
    .then( () => this.$store.commit('setLoading', false) )
  }
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

// Global
.cus-pos {
  position: fixed;
  margin: 0 !important;
  left: 50%;
  bottom: 45px;
  transform: translateX(-50%);
}
</style>


