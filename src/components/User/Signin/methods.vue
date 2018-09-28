<template>
  <div>
      <div class="login-body-header primary--text text-xs-center">
        <h3 class="title">选择登录方式</h3>
      </div>

      <div class="login-methods">
        <div class="login-btn">
          <v-btn flat dark class="google btn-cus mx-0 my-0" type="button" @click="chooseMethod('google')">
            <v-flex class="button-divider-google" xs2 d-flex align-center justify-center>
              <v-icon small left>fab fa-google</v-icon>
            </v-flex>
            <v-flex xs10>Google</v-flex>
          </v-btn>
        </div>

        <div class="login-btn">
          <v-btn flat dark class="facebook btn-cus mx-0 my-0" type="button" @click="chooseMethod('facebook')">
            <v-flex class="button-divider-facebook" xs2 d-flex align-center justify-center>
              <v-icon small left>fab fa-facebook-f</v-icon>
            </v-flex>
            <v-flex xs10>Facebook</v-flex>
          </v-btn>
        </div>

        <div class="text-divider text-xs-center primary--text">
          或者, 使用米团账号登录
        </div>

        <div class="login-btn">
          <v-btn flat dark class="my-btn btn-cus mx-0 my-0 primary--text" type="submit" @click="chooseMethod('account')">
            <span class="my-btn-text primary--text">米团</span>
          </v-btn>
        </div>

      </div>

      <div class="login-body-footer d-flex justify-center">
        <v-btn flat small class="primary--text" to="/signup">没有账号? 注册</v-btn>
      </div>

  </div>

</template>

<script>
/* eslint-disable */
export default {
  methods: {
    chooseMethod (methodName) {
      switch (methodName) {
        case 'google':
          this.$emit('methodChoosed', 'google')
          break
        case 'facebook':
          this.$emit('methodChoosed', 'facebook')
          break
        case 'account':
          this.$emit('methodChoosed', 'account')
          break
      }
    }
  }
}
</script>

<style lang="scss">
$googleRed: #DF4B37;
$facebookBlue: #3A579E;

.login-methods {
  position: relative;
  width: 100%;
  margin-top: 40px;

  .text-divider {
    position: relative;
    width: 100%;
    height: 18px;
    margin-bottom: 20px;
    line-height: 18px;
    font-size: 13px;
  }
}

// social login btn colors
.google {
  background-color: $googleRed !important;
}

.facebook {
  background-color: $facebookBlue !important;
}

.button-divider-google {
  border-right: 1px solid darken($googleRed, 15%);
}

.button-divider-facebook {
  border-right: 1px solid darken($facebookBlue, 15%);
}

</style>

