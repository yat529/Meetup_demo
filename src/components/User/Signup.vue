<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar class="primary mb-3" dark>
            <v-toolbar-side-icon>
              <v-icon>person_add</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title>Join Meetup</v-toolbar-title>
          </v-toolbar>
          <v-form class="pb-4" ref="accSignupForm" @submit.prevent="onSignup">

            <v-layout row>
              <v-flex xs10 offset-xs1>
                <v-card-text class="px-4 py-4">
                  <h3 class="primary--text title mb-3">Sign up your account</h3>
                  <v-text-field
                    name="userEmail"
                    label="Enter E-mail"
                    v-model="email"
                    :rules="emailRules"
                  ></v-text-field>
                  <v-text-field
                    name="userPassword"
                    label="Enter Password"
                    hint="At least 8 characters"
                    v-model="password"
                    min="8"
                    :append-icon="psw_show ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (psw_show = !psw_show)"
                    :type="!psw_show ? 'password' : 'text'"
                    :rules="pswRules"
                    counter
                  ></v-text-field>
                  <v-text-field
                    name="userPasswordConfirm"
                    label="Confirm Password"
                    v-model="passwordToCompare"
                    :append-icon="psw_check_show ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (psw_check_show = !psw_check_show)"
                    :type="!psw_check_show ? 'password' : 'text'"
                    :rules="pswCompareRules"
                    counter
                    v-if="checkPswLength"
                  ></v-text-field>
                </v-card-text>

                <v-btn large flat dark class="info" type="submit">CREATE ACCOUNT</v-btn>
              </v-flex>

            </v-layout>
            
          </v-form>
        </v-card>
        
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
/* eslint-disable */
export default {
  data () {
    return {
      valid: false,
      email: '',
      password: '',
      passwordToCompare: '',
      psw_show: false,
      psw_check_show: false
    }
  },
  computed: {
    emailRules () {
      return [
        value => !!value || 'Email is required',
        value => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'E-mail must be valid'
      ]
    },
    pswRules () {
      return [
        value => !!value || 'Password is required',
        value => value.length >= 8 || 'At least 8 characters'
      ]
    },
    pswCompareRules () {
      return [
        value => this.password === value || 'Passwords don\'t match'
      ]
    },
    checkPswLength () {
      return this.password.length >= 8
    }
  },
  methods: {
    onSignup () {
      console.log(this.$refs.accSignupForm.validate())
      // prepare user object for database
      
    }
  }
}
</script>
<style lang="scss">

</style>
