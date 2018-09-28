<template>
  <v-layout align-center justify-center row wrap>
    <v-card flat class="floating-shadow">
      <v-form ref="newPasswordForm" lazy-validation @submit.prevent="updatePassword">
        <v-layout class="px-4 py-4" row wrap justify-center>
          <v-flex>
            <v-card-text>
              <h3 class="primary--text title mb-0 text-xs-center">重置您的账户密码</h3>
              <p class="primary--text body-2 mb-3 text-xs-center">{{userEmail}}</p>
            </v-card-text>
            <v-text-field
              name="userPassword"
              label="密码"
              hint="至少输入8个字符"
              v-model="newPassword"
              min="8"
              :append-icon="psw_show ? 'visibility' : 'visibility_off'"
              :append-icon-cb="() => (psw_show = !psw_show)"
              :type="!psw_show ? 'password' : 'text'"
              :rules="pswRules"
              validate-on-blur
              counter="8"
            ></v-text-field>
            <v-text-field
              name="userPasswordConfirm"
              label="确认密码"
              v-model="newPasswordToCompare"
              :append-icon="psw_check_show ? 'visibility' : 'visibility_off'"
              :append-icon-cb="() => (psw_check_show = !psw_check_show)"
              :type="!psw_check_show ? 'password' : 'text'"
              :rules="pswCompareRules"
              validate-on-blur
              counter="8"
              v-show="checkPswLength"
            ></v-text-field>
            <v-container>
              <v-layout row wrap justify-center>
                <v-btn flat dark class="primary" type="submit">确定</v-btn>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
      </v-form>
    </v-card>
  </v-layout>
</template>

<script>
/* eslint-disable */ 
export default {
  props: {
    resetPassword: {
      type: Boolean,
      default: false
    },
    userEmail: {
      type: String
    }
  },
  data () {
    return {
      newPassword: '',
      newPasswordToCompare: '',
      psw_show: false,
      psw_check_show: false,
    }
  },
  computed: {
    pswRules () {
      return [
        value => !!value || '必须填写密码',
        value => value.length >= 8 || '密码太短, 不得少于8个字符'
      ]
    },
    pswCompareRules () {
      return [
        value => this.newPassword === value || '填写密码不一致'
      ]
    },
    checkPswLength () {
      return this.newPassword.length >= 8
    },
  },
  methods: {
    updatePassword () {
      if ( this.$refs.newPasswordForm.validate() ) {
        // console.log('form submitted')
        this.$emit('updatePassword', this.newPassword)
      }
    },
    
  }
}
</script>
