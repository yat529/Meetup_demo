<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-alert type="success" :value="showSuccessAlert" v-if="showSuccessAlert">
              Login Successful
          </v-alert>
          <v-alert type="error" :value="showErrorAlet" v-if="showErrorAlet">
              {{ errorMsg }}
          </v-alert>
          <v-toolbar class="primary mb-3" dark>
            <v-toolbar-side-icon>
              <v-icon>face</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title>Meetup Login</v-toolbar-title>
          </v-toolbar>
          <v-form class="pb-4" ref="accLoginForm" @submit.prevent="onLogin">
            <v-layout row>
              <v-flex xs10 offset-xs1>
                <v-card-text class="px-4 py-4">
                  <h3 class="primary--text title mb-3">Sign into your account</h3>
                  <v-text-field
                    name="userEmail"
                    label="Enter E-mail"
                    v-model="email"
                    :rules="emailRules"
                  ></v-text-field>
                  <v-text-field
                    name="userPassword"
                    label="Enter Password"
                    v-model="password"
                    :append-icon="psw_show ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (psw_show = !psw_show)"
                    :type="!psw_show ? 'password' : 'text'"
                    counter
                  ></v-text-field>
                </v-card-text>
                <v-btn large flat dark class="info" type="submit">SUBMIT</v-btn>
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
import loader from '@/components/common/loader'

export default {
  data () {
    return {
      email: '',
      password: '',
      psw_show: false
    }
  },
  methods: {
    onLogin () {
      if(this.$refs.accLoginForm.validate()) {
        let user = {
          email: this.email,
          password: this.password
        }
        this.$store.dispatch('onUserLogIn', user)
        this.$router.push('/profile')
      }
    }
  },
  computed: {
    emailRules () {
      return [
        value => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'E-mail must be valid'
      ]
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
  }
}
</script>
<style lang="scss">
</style>
