<template>
  <v-container fill-height px-0 py-0>

    <div class="login-wrapper">

      <div class="login-secondary" v-show="!isMobile">
        not on mobile
      </div>

      <div class="login-main">

        <div class="login-header primary--text text-xs-center">
          加入米团, 探索身边的精彩
        </div>

        <!-- login methods screen -->
        <transition name="fade" mode="out-in"> 
        <Methods class="login-body" v-if="!selectedMethod"
        v-on:methodChoosed="handleSigninMethod"></Methods>

        <!-- origin login screen -->
        <AccountSignin class="login-body" v-else-if="selectedMethod && selectedAccount"
        :error="error"
        v-on:resetError="resetError"
        v-on:accountSignin="signInWithAccount"
        v-on:goBack="goBack"></AccountSignin>
        </transition>
      </div><!-- Login Part -->
    </div>

  </v-container>
</template>

<script>
/* eslint-disable */
import loader from '@/components/common/loader'

import Methods from './methods'
import AccountSignin from './accountSignin'

const LOGIN_ERRORS = [
  {
    code: 'auth/user-not-found',
    title: '账号或密码错误',
    content: '账号或者密码不存在,请重新输入, 或者点击"忘记密码"来重置密码'
  },
  {
    code: 'auth/too-many-requests',
    title: '请求次数过多',
    content: '请求过于频繁,请稍后再试'
  }
]

export default {
  components: {
    Methods,
    AccountSignin
  },

  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      selectedGoogle: false,
      selectedFacebook: false,
      selectedAccount: false,
      hasError: false,
      error: {},
    }
  },
  methods: {
    signInWithAccount (credential) {
      if(credential) {

        this.$store.commit('setLoading', true)
        this.$store.dispatch('signInUser', credential)
        .then(user => {
          this.$store.commit('setLoading', false)
          this.$router.push('/profile')
        })
        .catch(error => {
          this.$store.commit('setLoading', false)
          console.log(error)

          LOGIN_ERRORS.forEach(login_error => {
            if (login_error.code === error.code) {
              let errorObj = login_error
              errorObj.type = 'error'
              this.$store.commit('setPopupMsg', errorObj)
              this.error = Object.assign({}, this.error, errorObj)
            }
          })

          this.hasError = true
        })
      }
    },

    handleSigninMethod (methodName) {
      switch (methodName) {
        case 'google':
          // this.selectedGoogle = true
          this.signInWithGoogle()
          break
        case 'facebook':
          this.selectedFacebook = true
          this.signInWithFacebook()
          break
        case 'account':
          this.selectedAccount = true
          break
      }
    },

    signInWithGoogle () {
      this.$store.dispatch('signInWithGoogle')
    },

    signInWithFacebook () {

    },

    resetError () {
      this.$store.commit('clearPopupMsg')
      this.error = {}
    },

    goBack () {
      this.selectedGoogle = false
      this.selectedFacebook = false
      this.selectedAccount = false
    }

  },
  computed: {
    selectedMethod () {
      return this.selectedGoogle || this.selectedFacebook || this.selectedAccount
    },

  },
  created () {
    this.$store.commit('setLoading', true)
    this.$store.dispatch('onGoogleSigninRedirect')
    .then(user => {
      if (!user) {
        this.$store.commit('setLoading', false)
        return
      }
      this.$store.dispatch('checkDBUserEntry', user)
      .then(hasUser => {
        this.$store.commit('setLoading', false)
        if (hasUser) {
          this.$router.push('/profile')
        } else {
          this.$store.dispatch('createDBUserEntry', user)
          .then(() => this.$router.push('/profile/init'))
        }
      })
    })
  }
}
</script>

<style lang="scss">
// .login-wrapper {
//   position: relative;
//   width: 100%;
//   height: 100%;

//   .login-main {
//     width: 100%;
//     height: 100%;
//     overflow: hidden;

//     .login-header {
//       position: relative;
//       margin: 20px 30px 0 30px;
//       height: 56px;
//       line-height: 56px;
//       font-size: 16px;
//       font-weight: 400;
//       border-bottom: 1px solid #ffffff;
//       border-image: linear-gradient(to left, #7167D5, #53A0FD);
//       border-image-slice: 1;
//     }

//     .login-body {
//       position: absolute;
//       top: 76px;
//       bottom: 0;
//       width: 100%;
//       overflow: hidden;

//       .login-body-header {
//         position: relative;
//         padding-top: 25px;
//         margin: 0 30px;

//         .title {
//           font-size: 20px;
//           font-weight: 400;
//           line-height: 28px;
//         }

//         .subtitle {
//           font-size: 13px;
//           font-weight: 400;
//           line-height: 16px;
//         }
//       }

//       .login-body-footer {
//         position: fixed;
//         left: 30px;
//         right: 30px;
//         bottom: 0px;
//         padding: 10px 0px;
//         border-top: 1px solid #ffffff;
//         border-image: linear-gradient(to left, #7167D5, #53A0FD);
//         border-image-slice: 1;

//         .login-footer-btn {

//           .btn__content {
//             padding: 0 !important;
//           }
//         }
//       }
//     }
//   }

//   .login-btn {
//     position: relative;
//     margin: 0 auto 22px auto;
//     width: 235px;
//     height: 38px;
//     z-index: 1;

//     &::after {
//       content: '';
//       position: absolute;
//       left: 50%;
//       bottom: 3px;
//       width: 225px;
//       height: 17px;
//       transform: translateX(-50%);
//       box-shadow: 0 2px 15px -3px rgba(7, 75, 87, 0.5), 0 1px 10px 0 rgba(0, 0, 0, 0.5);
//       z-index: -1;
//     }

//     &:last-child {
//       margin-bottom: 0px;
//     }

//     .btn-cus {
//       width: 100%;
//       height: 100%;
//       border-radius: 5px;
//     }

//     .my-btn {
//       position: relative;
//       background-color: #ffffff;
//       background-image: linear-gradient(to left, #7167D5, #53A0FD);
//       z-index: 1;

//       &::before {
//         content: '';
//         position: absolute;
//         top: 0;
//         left: 0;
//         width: 228px;
//         height: 32px;
//         margin: 3px;
//         border-radius: 4px;
//         background-color: #ffffff;
//         z-index: 2;
//       }

//       .my-btn-text {
//         position: absolute;
//         top: 50%;
//         left: 50%;
//         transform: translate(-50%, -50%);
//         z-index: 2;
//       }
//     }
//   }

// }



</style>
