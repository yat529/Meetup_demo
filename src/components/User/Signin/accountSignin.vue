<template>
  <div>

    <transition name="fade" mode="out-in">
    <!-- login form screen-->
    <v-form class="login-body-view" ref="accLoginForm" v-if="!forgetPsw" lazy-validation @submit.prevent="accountSignin">

      <div class="login-body-header primary--text text-xs-center">
        <h3 class="title">使用米团账号登录</h3>
      </div>

      <div class="login-input-group">
        <v-text-field
          class="login-input"
          name="userEmail"
          label="邮箱地址"
          v-model="email"
          :rules="emailRules"
          :error="hasError"
          validate-on-blur
        ></v-text-field>

        <v-text-field
          class="login-input"
          name="userPassword"
          label="密码"
          v-model="password"
          :append-icon="psw_show ? 'visibility' : 'visibility_off'"
          :append-icon-cb="() => (psw_show = !psw_show)"
          :type="!psw_show ? 'password' : 'text'"
          :error="hasError"
          :error-messages="errorMsg"
        ></v-text-field>
      </div>

      <div class="login-btn-wrapper"> 
        <div class="login-btn">
          <v-btn flat dark class="my-btn btn-cus mx-0 my-0 primary--text" type="submit" v-if="!hasError">
            <span class="my-btn-text primary--text">登录米团</span>
          </v-btn>
          <v-btn flat dark class="error btn-cus mx-0 my-0" @click="reset" v-else>
            <span style="color: #ffffff">重新输入</span>
          </v-btn>
        </div>
      </div>

    </v-form>

    <!-- reset email screen -->
    <div  v-else-if="forgetPsw && !resetEmailSent">

        <v-form ref="emailResetForm" lazy-validation @submit.prevent="resetUserCredential">

          <div class="login-body-header primary--text text-xs-left" style="padding-left: 30px">
            <h3 class="title mb-3">重置账户密码</h3>
            <p
              class="subtutle" 
              style="width: 216px; margin-left: 0px; margin-right: auto;">请输入你注册时使用的账户邮箱地址, 用于接收密码重置邮件</p>
          </div>

          <div class="login-input-group">
            <v-text-field
              class="login-input"
              name="userEmail"
              label="邮箱地址"
              v-model="resetEmail"
              :rules="emailRules"
              validate-on-blur
            ></v-text-field>
          </div>

          <div class="login-btn-wrapper"> 
            <div class="login-btn">
              <v-btn flat dark class="primary btn-cus mx-0 my-0" type="submit" v-if="!hasError">下一步</v-btn>
            </div>
          </div>

        </v-form>

    </div>

    <!-- reset email sent screen -->
    <div class="cus-action-align-center" v-else-if="forgetPsw && resetEmailSent">
      <v-layout row wrap>
        <v-flex xs12 d-flex justify-center mb-3>
          <v-icon large color="green">fas fa-check-circle</v-icon>
        </v-flex>
        <v-flex xs12>
          <p class="title primary--text text-xs-center mb-3">邮件已发送成功</p>
          <p class="body-1 primary--text text-xs-center" style="width: 190px; margin-left: auto; margin-right: auto">请查收邮件, 并根据邮件中的提示完成密码重置</p>
        </v-flex>
      </v-layout>

      <div class="login-btn-wrapper">
        <div class="login-btn">
          <v-btn flat dark class="primary btn-cus mx-0 my-0" @click="goBack">返回</v-btn>
        </div>
      </div>
    </div>
    </transition>

    <!-- footer -->
    <div class="login-body-footer d-flex justify-center" v-if="!resetEmailSent">
      <v-layout align-center>
        <v-btn flat class="login-footer-btn small primary--text mx-0 my-0" @click="goBack">
          <v-icon small>keyboard_arrow_left</v-icon>
          返回
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn flat class="login-footer-btn small primary--text mx-0 my-0" v-if="!forgetPsw" @click="forgetPsw = true">忘记密码?</v-btn>
      </v-layout>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    error: {
      type: Object
    }
  },
  data () {
    return {
      email: '',
      password: '',
      psw_show: false,
      forgetPsw: false,
      resetEmail: '',
      resetEmailSent: false
    }
  },
  computed: {
    emailRules () {
      return [
        value => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/.test(value) || '请输入一个有效的电子邮件地址'
      ]
    },
    
    hasError () {
      return this.error.code ? true : false
    },

    errorMsg () {
      if (this.error) {
        return this.error.content
      }
    }
  },
  methods: {
    accountSignin () {
      if(this.$refs.accLoginForm.validate()) {
        let userCredential = {
          email: this.email,
          password: this.password
        }

        this.$emit('accountSignin', userCredential)
      }
    },

    reset () {
      this.email = ''
      this.password = ''
      this.$emit('resetError')
    },

    resetUserCredential () {
      if(this.$refs.emailResetForm.validate()) {
        let resetEmail = this.resetEmail
        this.$store.dispatch('sendResetPasswordEmail', resetEmail)
        .then(() => {
          this.resetEmailSent = true
        })
        .catch(error => {
          console.log(error)
        })
      }
    },

    goBack () {
      if (this.forgetPsw) {
        this.forgetPsw = false
        if (this.resetEmailSent) {
          this.resetEmailSent = false
        }
      } else {
        this.$emit('goBack')
      }
      
    },

  }
}
</script>

<style lang="scss">

</style>
