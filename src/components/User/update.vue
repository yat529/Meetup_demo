<template>
  <v-container>
    <h1 class="primary--text text-xs-center mt-3 mb-4" v-if="user"><span style="margin-right: 5px">Hi,</span>{{ user.nickname }}</h1>
    <v-layout row>
      <!-- side -->
      <v-flex xs12 sm3 px-3>
        <div class="text-xs-cente">
          <div class="avatar-wrapper">
            <div class="avatar mb-3" :style="getUserAvatar"></div>
          </div>
          <v-layout justify-center>
            <v-btn dark small color="primary">Change Avatar</v-btn> 
          </v-layout>
        </div>
      </v-flex>

      <!-- main -->
      <v-flex xs12 sm9 px-3 v-if="user">
        <v-layout>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>Nickname</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field
                name="nickname"
                label="Nickname"
                :value="user.nickname"
                id="nickname"
                disabled
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-layout>
        <v-layout>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>Email</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field
                name="email"
                label="Email"
                :value="user.email"
                id="email"
                disabled
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-layout>
        <v-layout>
          <v-layout row>
            <v-flex xs4>
              <v-subheader>Sex</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field
                name="sex"
                label="Sex"
                :value="user.sex"
                id="sex"
                disabled
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-layout>


      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
export default {
  data () {
    return {
      // 
    }
  },
  computed: {
    user () {
      return this.$store.state.userModule.user_ref
    },
    getUserAvatar () {
      if (this.user)
      return `background-image: url("${ this.user.photoURL }")`
    }
  },
  mounted () {
    // 
  }
}
</script>

<style lang="scss">
.avatar {
  display: block;
  width: 65px;
  height: 65px;
  margin: 0 auto;
  border: 4px solid #fff;
  border-radius: 50%;
  background-position: center;
  background-size: cover;
  box-shadow: 0 1px 10px -6px rgba(0, 0, 0, 0.5)
}
</style>
