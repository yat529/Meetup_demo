<template>
  <v-layout fill-height>
    <transition name="fade" mode="out-in">
    <!-- success screen -->
    <EmailVerification v-if="verifiedEmail"
    :verifiedEmail="verifiedEmail" 
    v-on:verifyEmail="handleVerifyEmail"></EmailVerification>

    <!-- reset password -->
    <PasswordReset v-else-if="resetPassword"
    :resetPassword="resetPassword" 
    :userEmail="userEmail"
    v-on:updatePassword="handleResetPassword"></PasswordReset>

    <!-- success screen -->
    <v-container v-else-if="isSuccess">  
      <v-layout row wrap justify-center align-center mb-3>
          <v-icon large color="green darken-2">check_circle</v-icon>
      </v-layout>
      <h3 class="primary--text title text-xs-center mb-5">{{ success.title }}</h3>
      <v-layout row wrap justify-center>
        <v-btn round color="primary" @click="redirect">前往我的档案</v-btn>
      </v-layout>
    </v-container>

    <!-- error screen -->
    <v-container v-else-if="hasError">
      <v-layout row wrap justify-center align-center mb-3>
          <v-icon large color="red">fas fa-times-circle</v-icon>
      </v-layout>
      <h3 class="primary--text title text-xs-center mb-3">{{ error.title }}</h3>
      <p class="primary--text body-1 text-xs-center mb-5">{{ error.content }}</p>
      <v-layout row wrap justify-center>
        <v-btn round color="primary" @click="redirect">前往我的档案</v-btn>
      </v-layout>
    </v-container>
    </transition>
  </v-layout>
</template>

<script>
/* eslint-disable */
import EmailVerification from './emailVerification'
import PasswordReset from './passwordReset'

const ACTION_ERRORS = [
  {
    code: 'auth/invalid-action-code',
    title: '链接已经失效',
    content: '你已经使用过此链接, 或者此链接已经失效.'
  },
  {
    code: 'auth/expired-action-code',
    title: '链接已经过期',
    content: '此链接已经失效, 请重新发送邮件'
  }
]

export default {
  components: {
    EmailVerification,
    PasswordReset
  },
  data () {
    return {
      // auth: {},
      actionCode: '',
      userEmail: '',
      verifiedEmail: false,
      resetPassword: false,
      hasError: false,
      error: {
        title: '',
        content: ''
      },
      isSuccess: false,
      success: {
        title: '',
        content: ''
      },
    }
  },
  computed: {
    // 
  },
  methods: {
    redirect () {
      this.$router.push('/profile')
    },

    handleVerifyEmail () {
      let actionCode = this.actionCode,
          that = this

      that.$store.dispatch('verifyEmail', actionCode)
      .then(() => {
        that.verifiedEmail = false
        that.success.title = '太棒了! 邮件验证成功'
        that.isSuccess = true
      })
      .catch(error => {
        that.hasError = true
        that.handleError(error)
      })
    },

    handleResetPassword (newPassword) {
      let actionCode = this.actionCode,
          that = this

      that.$store.dispatch('resetPassword', {actionCode: actionCode, newPassword: newPassword})
      .then(resp => {
        console.log('password reseted')
        that.resetPassword = false
        that.success.title = '太棒了! 密码已经重置'
        that.isSuccess = true
      })
      .catch(error => {
        that.hasError = true
        that.handleError(error)
      })
    },

    handleError (error) {
      let that = this
      ACTION_ERRORS.forEach(action_error => {
        if (action_error.code == error.code) {
          that.error.title = action_error.title
          that.error.content = action_error.content
        }
      })
    },

  },
  created () {

    let that = this,
        query = this.$route.query

    let mode = query.mode,
        actionCode = query.oobCode,
        apiKey = query.apiKey,
        continueUrl = query.continueUrl

    that.actionCode = actionCode

    switch (mode) {
      case 'resetPassword':
        // Display reset password handler and UI.
        that.resetPassword = true
        that.$store.dispatch('verifyPasswordResetCode', actionCode)
        .then(email => {
          that.userEmail = email
        })
        break
      case 'recoverEmail':
        // Display email recovery handler and UI.
        // handleRecoverEmail(auth, actionCode)
        break
      case 'verifyEmail':
        // Display email verification handler and UI.
        that.verifiedEmail = true
        break
      // default:
        // Error: invalid mode.
    }

    function handleRecoverEmail () {}
    
  }
}
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in-out;
}

.fade-enter {
  // transform: translateX(50%);
  opacity: 0;
}

.fade-leave-to {
  // transform: translateX(-50%);
  opacity: 0;
}
</style>


