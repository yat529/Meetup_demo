<template>
  <v-container fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm6>
        <v-alert type="success" :value="showSuccessAlert" v-if="showSuccessAlert">
            Login Successful
        </v-alert>
        <v-alert type="error" :value="showErrorAlet" v-if="showErrorAlet">
            {{ errorMsg }}
        </v-alert>
        <v-card flat>
          <!-- <v-toolbar class="primary mb-3" dark flat>
            <v-toolbar-side-icon>
              <v-icon>person_add</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title>Join Meetup</v-toolbar-title>
          </v-toolbar> -->
          <v-toolbar class="white" light flat>
            <div class="deco-bar primary"></div>
            <v-toolbar-side-icon>
              <v-icon class="primary--text">person_add</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title class="primary--text">Join Meetup</v-toolbar-title>
          </v-toolbar>
          <v-divider class="mb-4"></v-divider>
          <v-form class="mb-4" ref="accSignupForm" @submit.prevent="createUser">
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
                <v-layout justify-center>
                  <v-btn large flat dark class="primary" type="submit">CREATE ACCOUNT</v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-form>
          <v-divider class="mb-1"></v-divider>
          <v-container py-0>
            <v-layout class="pb-1" align-center>
              <v-spacer></v-spacer>
              <v-btn flat small class="primary--text" to="/signin">Already signed up?</v-btn>
            </v-layout> 
          </v-container>
        </v-card>     
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
import * as firebase from 'firebase'
import loader from '@/components/common/loader'

export default {
  data () {
    return {
      // valid: false,
      email: '',
      password: '',
      passwordToCompare: '',
      // for show psw icon
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
    },
    showSuccessAlert () {
      return this.$store.state.successAlert
    },
    showErrorAlet () {
      return this.$store.state.errorAlet
    },
    errorMsg () {
      return this.$store.state.error.message
    }
  },
  methods: {
    createUser () {
      if( this.$refs.accSignupForm.validate() ) {
        let user = {
          email: this.email,
          password: this.password
        }
        this.$store.dispatch('createUser', user)
        .then(user => {
          console.log(user)
          this.$store.dispatch('createDBUserEntry', user)
        })
        .then(() => {
          console.log('User created')
          this.$router.push({
            path: '/profile/init'
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.deco-bar {
  position: relative;
  left: 0;
  top: 0;
  width: 7px;
  height: 100%;
  margin: 0 !important;
}
</style>
