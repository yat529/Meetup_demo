<template>
  <v-container fill-height>
    <v-layout align-center justify-center row>
      <v-flex class="cus-center-box" xs12 sm6>
        <!-- alert -->
        <v-alert type="success" :value="showSuccessLoginAlert" v-if="showSuccessLoginAlert">
            Login Successful
        </v-alert>
        <v-alert type="success" :value="showSuccessLogoutAlert" v-if="showSuccessLogoutAlert">
            You've successfully logged out!
        </v-alert>
        <v-alert type="error" :value="showErrorAlet" v-if="showErrorAlet">
            {{ errorMsg }}
        </v-alert>
        <v-card flat>
          <v-toolbar class="white" light flat>
            <div class="deco-bar primary"></div>
            <v-toolbar-side-icon>
              <v-icon class="primary--text">face</v-icon>
            </v-toolbar-side-icon>
            <v-toolbar-title class="primary--text">登录米团, 探索身边的精彩</v-toolbar-title>
          </v-toolbar>
          <v-divider class="mb-4"></v-divider>
          <!-- login methods -->
          <div v-show="!selectedMethod">
            <v-container class="fixedHeight">
              <v-layout row>
                <v-flex xs10 offset-xs1>
                  <v-card-text mb-1>
                    <h3 class="primary--text title mb-3 text-xs-center">选择登录方式</h3>
                  </v-card-text>
                  <v-container d-flex justify-center py-1>
                    <v-flex xs9>
                      <v-btn block large flat dark class="google" type="button" @click="signInWithGoogle">
                        <v-icon small left>fab fa-google</v-icon>
                        Google
                      </v-btn>
                    </v-flex>
                  </v-container>
                  <v-container d-flex justify-center py-1>
                    <v-flex xs9>
                      <v-btn block large flat dark class="facebook" type="button">
                        <v-icon small left>fab fa-facebook-f</v-icon>
                        Facebook
                      </v-btn>
                    </v-flex>
                  </v-container>
                  <p class="text-xs-center primary--text mt-3">或者, 使用米团账号登录</p>
                  <v-container d-flex justify-center pt-1 pb-5>
                    <v-flex xs9>
                      <v-btn block large flat dark class="primary" type="submit" @click="selectedDefault = !selectedDefault">米团</v-btn>
                    </v-flex>
                  </v-container>
                </v-flex>
              </v-layout>
            </v-container>
            <v-divider class="mb-1"></v-divider>
            <v-container py-0>
              <v-layout class="pb-1" justify-center>
                <v-flex xs7 d-flex>
                  <v-btn flat small class="primary--text" to="/signup">没有账号? 注册</v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </div>
          <!-- origin login -->
          <div v-show="selectedDefault">     
            <v-form class="fixedHeight" ref="accLoginForm" @submit.prevent="signInUser">
              <v-container>
                <v-card-text class="px-4 py-4">
                  <h3 class="primary--text title mb-3">使用米团账号登录</h3>
                  <v-text-field
                    name="userEmail"
                    label="邮箱地址"
                    v-model="email"
                    :rules="emailRules"
                  ></v-text-field>
                  <v-text-field
                    name="userPassword"
                    label="密码"
                    v-model="password"
                    :append-icon="psw_show ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (psw_show = !psw_show)"
                    :type="!psw_show ? 'password' : 'text'"
                    counter
                  ></v-text-field>
                </v-card-text>
              </v-container>
              <v-container py-0 mb-4>
                <v-layout justify-center>
                  <v-flex xs9>
                    <v-btn block large flat dark class="primary" type="submit">登录</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
            <v-divider class="mb-1"></v-divider>
            <v-container px-0 py-0>
              <v-layout class="pb-1" align-center>
                <v-btn flat small class="primary--text" @click="goBack">
                  <v-icon left small>keyboard_arrow_left</v-icon>
                  返回
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn flat small class="primary--text">忘记密码?</v-btn>
              </v-layout>
            </v-container>
          </div>
        </v-card>     
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
/* eslint-disable */
import loader from '@/components/common/loader'
import * as firebase from 'firebase'

export default {
  data () {
    return {
      selectedGoogle: false,
      selectedFacebook: false,
      selectedDefault: false,
      email: '',
      password: '',
      psw_show: false
    }
  },
  methods: {
    signInUser () {
      if(this.$refs.accLoginForm.validate()) {
        let user = {
          email: this.email,
          password: this.password
        }
        this.$store.commit('setLoading', true)
        this.$store.dispatch('signInUser', user)
        .then((user) => {
          this.$store.commit('setLoading', false)
          this.$router.push('/profile')
        })
      }
    },

    signInWithGoogle() {
      this.$store.dispatch('signInWithGoogle')
    },

    goBack () {
      this.selectedGoogle = false
      this.selectedFacebook = false
      this.selectedDefault = false
    }
  },
  computed: {
    selectedMethod () {
      return this.selectedGoogle || this.selectedFacebook || this.selectedDefault
    },
    emailRules () {
      return [
        value => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'E-mail must be valid'
      ]
    },
    showSuccessLoginAlert () {
      return this.$store.state.successLogin
    },
    showSuccessLogoutAlert () {
      return this.$store.state.successLogout
    },
    showErrorAlet () {
      return this.$store.state.errorAlet
    },
    errorMsg () {
      return this.$store.state.error.message
    }
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
.cus-center-box {
  max-width: 500px !important;
}

.fixedHeight {
  height: 360px;
  overflow: hidden;
}

.deco-bar {
  position: relative;
  left: 0;
  top: 0;
  width: 7px;
  height: 100%;
  margin: 0 !important;
}

.google {
  background-color: #dd4b39 !important;
}
.facebook {
  background-color: #3b5998 !important;
}
</style>
