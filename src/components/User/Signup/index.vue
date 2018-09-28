<template>
  <v-container fill-height px-0 py-0>

    <div class="login-wrapper">
      <div class="login-main">

        <div class="login-header primary--text text-xs-center">
          加入米团, 探索身边的精彩
        </div>

        <div class="login-body">
          <transition name="fade" mode="out-in">
          <v-form class="login-body-view" ref="accSignupForm" v-if="!userCreated" lazy-validation @submit.prevent="createUser">
            
            <transition name="fade">
            <div class="login-body-header primary--text text-xs-center" v-show="!checkPswLength">
              <h3 class="title">创建米团账户</h3>
            </div>
            </transition>

            <div class="login-input-group">
              <v-text-field
                class="login-input"
                name="userEmail"
                label="邮箱地址"
                v-model="email"
                :rules="emailRules"
                :error="hasError"
                :error-messages="error.title"
                :append-icon="emailValidIcon"
                :append-icon-cb="clearForm"
                validate-on-blur
                ref="userEmailInput"
              >
              </v-text-field>

              <v-text-field
                class="login-input"
                name="userPassword"
                label="密码"
                hint="至少输入8个字符"
                v-model="password"
                min="8"
                :append-icon="psw_show ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (psw_show = !psw_show)"
                :type="!psw_show ? 'password' : 'text'"
                :rules="pswRules"
                validate-on-blur
                counter="8"
              ></v-text-field>

              <transition
              v-on:before-enter="beforeInputEnter"
              v-on:enter="inputEnter"
              v-on:leave="inputLeave">
              <v-text-field
                class="login-input"
                name="userPasswordConfirm"
                label="确认密码"
                v-model="passwordToCompare"
                :append-icon="psw_check_show ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (psw_check_show = !psw_check_show)"
                :type="!psw_check_show ? 'password' : 'text'"
                :rules="pswCompareRules"
                validate-on-blur
                counter="8"
                v-if="checkPswLength"
              ></v-text-field>
              </transition>  

              <div class="login-btn-wrapper"> 
                <div class="login-btn">
                  <v-btn flat dark class="my-btn btn-cus mx-0 my-0 primary--text" type="submit">
                    <span class="my-btn-text primary--text">创建账户</span>
                  </v-btn>
                </div>
              </div>
            </div>

          </v-form>

          <div class="cus-action-align-center" v-else>
            <v-layout row wrap>
              <v-flex xs12 d-flex justify-center mb-3>
                <v-icon large color="green">fas fa-check-circle</v-icon>
              </v-flex>
              <v-flex xs12>
                <p class="title primary--text text-xs-center mb-2">恭喜, 注册成功</p>
                <p class="body-1 primary--text text-xs-center mb-4">验证邮件已发出</p>
                <p class="body-1 primary--text text-xs-center">等候期间, 请先完善您的基本信息</p>
              </v-flex>
            </v-layout>

            <div style="margin: 25px 30px auto 30px"> 
              <div class="login-btn">
                <v-btn flat dark class="primary btn-cus mx-0 my-0" @click="redirect">下一步</v-btn>
              </div>
            </div>
          </div>
          </transition>

          <div class="login-body-footer d-flex justify-center" v-if="!userCreated">
            <v-btn flat small class="primary--text" to="/signin">已注册? 登录</v-btn>
          </div>
        </div>

      </div>
    </div>
  </v-container>
</template>

<script>
/* eslint-disable */
import * as firebase from 'firebase'
import loader from '@/components/common/loader'

const SIGNIN_ERRORS = [
  {
    code: 'auth/email-already-in-use',
    title: '账户已经存在',
    content: '该邮箱地址已经使用过, 请使用其他邮箱地址再试一次'
  }
]

export default {
  data () {
    return {
      email: '',
      password: '',
      passwordToCompare: '',
      psw_show: false,
      psw_check_show: false,
      userCreated: false,
      emailExisted: false,
      emailValidIcon: '',
      hasError: false,
      error: {}
    }
  },
  computed: {
    emailRules () {
      return [
        value => !!value || '必须输入电子邮件地址',
        value => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/.test(value) || '请输入一个有效的电子邮件地址'
      ]
    },
    pswRules () {
      return [
        value => !!value || '必须填写密码',
        value => {
          if (value) {
            return value.length >= 8 || '密码太短, 不得少于8个字符'
          } 
          return false
        }
      ]
    },
    pswCompareRules () {
      return [
        value => this.password === value || '填写密码不一致'
      ]
    },
    checkPswLength () {
      if (this.password) {
        return this.password.length >= 8
      }
    }
  },

  methods: {
    beforeInputEnter (el) {
      let btn = el.nextElementSibling

      btn.style.opacity = 0
      btn.style.transform = ''

      el.style.transition = ''
      el.style.opacity = 0
      el.style.height = 0 +'px'
      // el.style.transform = 'translate3d(0px, -30px, 0px)'
    },

    inputEnter (el, done) {
      let btn = el.nextElementSibling,
          inputHeight = el.scrollHeight

      btn.style.transform = ''

      Velocity(el, { height: inputHeight + 'px' }, {
        duration: 300,
        easing: 'ease-in-out',
      })
      Velocity(el, { 
        opacity: 1
        }, {
        duration: 300,
        easing: 'ease-in-out',
      })
      Velocity(btn, {
        opacity: 1
      }, {
        duration: 600,
        delay: 400,
        easing: 'ease-in-out',
        complete: done
      })

    },

    inputLeave (el, done) {
      let btn = el.nextElementSibling

      Velocity(btn, {
        opacity: 0,
      }, {
        duration: 300,
        easing: 'ease-in-out'
      })
      Velocity(el, {
        opacity: 0
      }, {
        duration: 600,
        easing: 'ease-in-out',
        complete: done
      })
    },

    createUser () {
      if( this.$refs.accSignupForm.validate() ) {
        let user = {
              email: this.email,
              password: this.password
            },
            user_snap = {}

        this.$store.commit('setLoading', true)

        this.$store.dispatch('createUser', user)
        .then(user => {
          user_snap = user
          // setup user database
          return this.$store.dispatch('createDBUserEntry', user_snap)
        })
        .then(() => {
          // send email verification
          return this.$store.dispatch('sendEmailVerification', user_snap)
        })
        .then(() => {
          console.log('User created')
          this.$store.commit('setLoading', false)
          this.userCreated= true
        })
        .catch(error => {
          console.log(error)
          this.$store.commit('setLoading', false)

          SIGNIN_ERRORS.forEach(signin_error => {
            if (signin_error.code === error.code) {
              let errorObj = signin_error
              errorObj.type = 'error'
              this.$store.commit('setPopupMsg', errorObj)
              this.error = Object.assign({}, this.error, errorObj)
            }
          })

          this.hasError = true
        })
      }
    },

    // clear the form only when click on the cross error sign
    clearForm () {
      let inputEmail = this.$refs.userEmailInput,
          $icon

      if (inputEmail) {
        $icon = inputEmail.$el.querySelector('.icon')
      }

      if ( $icon && $icon.classList.contains('fa-times-circle') ) {
        this.$refs.accSignupForm.reset()
        this.email = ''
        this.hasError = false
        this.error = {}
        this.emailValidIcon = ''
      } 
    },

    redirect () {
      this.$router.push({
        path: '/profile/init'
      })
    }
  },

  // when email text field on blur check if the email exists
  // if so, create the error object, and add a red cross icon
  // if not, clear the error object and add a green check icon
  mounted () {
    let inputEmail = this.$refs.userEmailInput,
        $inputEmail = inputEmail.$el.querySelector('input'),
        that = this

    $inputEmail.addEventListener('blur', () => {
      let email = $inputEmail.value.toLowerCase(),
          ruleChecked

      that.emailRules.forEach(rule => {
        ruleChecked = rule(email)
      })

      if (ruleChecked && typeof ruleChecked === 'boolean') {
        that.$store.dispatch('checkDBUserEmail', email)
        .then(result => {
          if (result) {
            let errorObj = SIGNIN_ERRORS[0]
            that.emailValidIcon = 'far fa-times-circle'
            that.hasError = true
            that.error = Object.assign({}, that.error, errorObj)
          } else {
            that.emailValidIcon = 'far fa-check-circle'
            that.hasError = false
            that.error = {}
          }
        })
      }
    })
  },

  // assign proper icon class according to associated icon
  updated () {
    let inputEmail = this.$refs.userEmailInput,
        $icon

    if (inputEmail) {
      $icon = inputEmail.$el.querySelector('.icon')
    }

    if ($icon) {
      if ($icon.classList.contains('fa-check-circle')) {
        $icon.classList.add('valid-email')
      } else if ($icon.classList.contains('fa-times-circle')) {
        $icon.classList.add('invalid-email')
      }
    }
  }
}
</script>

<style lang="scss">
.valid-email,
.invalid-email {
  font-size: 17px;
  margin-right: 4px;
  
}

.valid-email {
  color: #4CAF50 !important;
}
.invalid-email {
  color: #ff5252 !important;
}

</style>
