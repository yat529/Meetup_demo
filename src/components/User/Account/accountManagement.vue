<template>
  <v-container class="tabView" px-0 py-0>

    <v-layout class="tab-controls" py-2 row wrap justify-center mb-4>
      <v-btn flat round dark color="primary" :class="acctMngtTab === 0 ? 'btn--active' : ''" @click="acctMngtTab = 0">账户信息</v-btn>
      <v-btn flat round dark color="primary" :class="acctMngtTab === 1 ? 'btn--active' : ''" @click="acctMngtTab = 1">隐私设置</v-btn>
      <v-btn flat round dark color="primary" :class="acctMngtTab === 2 ? 'btn--active' : ''" @click="acctMngtTab = 2">安全设置</v-btn>
    </v-layout>

    <!-- privacy setting -->
    <v-container px-0 py-0 v-show="acctMngtTab === 1">
      <h3 class="primary--text section-title">显示信息</h3>
      <p class="primary--text section-subtitle">设置将公开显示账户信息</p>

      <!-- show age toggle-->
      <v-layout row wrap align-center mb-1>
        <v-flex>
          <v-subheader class="subheading primary--text">显示年龄</v-subheader>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs3>
          <v-switch :label="`${ showAge ? '开启' : '关闭'}`" color="blue darken-2" hide-details v-model="showAge"></v-switch>
        </v-flex>
      </v-layout>

      <!-- show age toggle-->
      <v-layout row wrap align-center mb-1>
        <v-flex>
          <v-subheader class="subheading primary--text">显示社交账户</v-subheader>
        </v-flex>
        <v-spacer></v-spacer>
        <v-flex xs3>
          <v-switch :label="`${ showSocial ? '开启' : '关闭'}`" color="blue darken-2" hide-details v-model="showSocial"></v-switch>
        </v-flex>
      </v-layout>

    </v-container>

    <!-- account info -->
    <v-container px-0 py-0 v-show="acctMngtTab === 0">

      <v-container px-0 py-0 mb-4>
        <h3 class="primary--text section-title">账户信息</h3>
        <p class="primary--text section-subtitle">你的账户注册方式</p>

        <!-- user account email-->
        <v-layout row wrap align-center mb-1>
          <v-flex>
            <v-subheader class="subheading primary--text">账号邮箱</v-subheader>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex>
            <v-layout row wrap justify-end>
              <v-chip text-color="white" :color="chipColor">{{ user.email }}</v-chip>
            </v-layout>
          </v-flex>
        </v-layout>

        <!-- signup method-->
        <v-layout row wrap align-center mb-1>
          <v-flex>
            <v-subheader class="subheading primary--text">注册方式</v-subheader>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex>
            <v-layout row wrap justify-end>
              <v-chip text-color="white" :color="chipColor">{{ signupMethod }}</v-chip>
            </v-layout>
          </v-flex>
        </v-layout>

        <!-- account verified-->
        <v-layout row wrap align-center mb-1>
          <v-flex>
            <v-subheader class="subheading primary--text">邮箱验证</v-subheader>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex>
            <v-layout row wrap justify-end>
              <v-chip text-color="white" :color="user.emailVerified ? 'green' : 'red'">
                <v-avatar>
                  <v-icon small v-if="user.emailVerified">far fa-check-circle</v-icon>
                  <v-icon small v-else>fas fa-exclamation-circle</v-icon>
                </v-avatar>
                {{ emailVerificationStatus }}
              </v-chip>
            </v-layout>
          </v-flex>
        </v-layout>

      </v-container>

      <v-container class="section-border-top" px-0 pt-3 pb-0 mb-4>
        <h3 class="primary--text section-title">账户信息</h3>
        <p class="primary--text section-subtitle">你的账户注册方式</p>

        <!-- user signup date-->
        <v-layout row wrap align-center mb-1>
          <v-flex>
            <v-subheader class="subheading primary--text">注册日期</v-subheader>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex>
            <v-layout row wrap justify-end>
              <v-chip text-color="white" color="primary">{{ creationTime }}</v-chip>
            </v-layout>
          </v-flex>
        </v-layout>

        <!-- user signup date-->
        <v-layout row wrap align-center mb-1>
          <v-flex>
            <v-subheader class="subheading primary--text">上次登录时间</v-subheader>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex>
            <v-layout row wrap justify-end>
              <v-chip text-color="white" color="primary">{{ lastSignInTime }}</v-chip>
            </v-layout>
          </v-flex>
        </v-layout>

      </v-container>

    </v-container>

    <!-- account security setting -->
    <v-container px-0 py-0 v-show="acctMngtTab === 2">
      <!-- setting -->
      <v-container px-0 py-0 mb-4>
        <h3 class="primary--text section-title">账户安全设置</h3>
        <p class="primary--text section-subtitle">选择一个账户安全设置操作</p>

        <!-- backup email -->
        <v-layout row wrap align-center mb-1>
          <v-flex row>
            <v-subheader class="subheading primary--text">
              <span class="pr-2">辅助邮箱</span>          
              <v-tooltip bottom>
                <v-icon small color="grey lighten-2" slot="activator">fas fa-question-circle</v-icon>
                <span>当登录邮箱账号无法使用时, 你可以使用辅助邮箱来更改登陆邮箱账号</span>
              </v-tooltip>
            </v-subheader>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex>
            <v-layout row wrap justify-end>
              <v-btn round color="primary">设置辅助邮箱</v-btn>
            </v-layout>
          </v-flex>
        </v-layout>

        <!-- sms auth -->
        <v-layout row wrap align-center mb-1>
          <v-flex row>
            <v-subheader class="subheading primary--text">
              <span class="pr-2">短信验证</span>          
              <v-tooltip bottom>
                <v-icon small color="grey lighten-2" slot="activator">fas fa-question-circle</v-icon>
                <span>当登录邮箱账号无法使用时, 你可以使用辅助邮箱来更改登陆邮箱账号</span>
              </v-tooltip>
            </v-subheader>
          </v-flex>
          <v-spacer></v-spacer>
          <v-flex>
            <v-layout row wrap justify-end>
              <v-btn round color="primary">开启短信验证</v-btn>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>

      <!-- setting -->
      <v-container class="section-border-top" px-0 pt-3 pb-0>
        <h3 class="primary--text section-title">修改账户安全信息</h3>
        <p class="primary--text section-subtitle">选择一个账户安全设置操作</p>

        <v-layout px-3 py-3 row wrap justify-center>
          <v-btn round color="primary">修改账户密码</v-btn>
          <v-flex></v-flex>
          <v-btn round color="primary">修改登录邮箱</v-btn>
        </v-layout>
      </v-container>

      <!-- delete account -->
      <v-container class="section-border-top" px-0 pt-3 pb-0>
        <h3 class="primary--text section-title">删除账户</h3>
        <p class="primary--text section-subtitle">这将彻底删除你在米团上的所有数据, 谨慎操作</p>

        <v-layout row wrap px-3 py-3>
          <v-btn round dark color="red">删除账户</v-btn>
        </v-layout>
      </v-container>
    </v-container>

  </v-container>
</template>

<script>
/* eslint-disable */ 
export default {
  props: {
    user: {
      type: Object
    }
  },

  data () {
    return {
      acctMngtTab: 0,
      showAge: true,
      showSocial: false,
    }
  },

  computed: {
    signupMethod () {
      let method,
          providerId = this.user.providerId

      switch (providerId) {
        case 'password':
          method = '邮件注册'
          break
        case 'google.com':
          method = 'Google账号注册'
          break
      }

      return method
    },

    chipColor () {
      let providerId = this.user.providerId,
          color

      switch (providerId) {
        case 'password':
          color = 'primary'
          break
        case 'google.com':
          color = 'red darken-1'
          break
      }

      return color
    },

    emailVerificationStatus () {
      if (this.user.emailVerified) {
        return '已验证'
      }
      return '未验证'
    },

    creationTime () {
      if (this.user.metadata) {
        let creationTime = this.user.metadata.creationTime

        let tmstmp = new Date (creationTime),
            localeDate = tmstmp.toLocaleDateString(),
            localeTime = tmstmp.toLocaleTimeString()

        return localeDate + ' ' + localeTime   
      }
    },

    lastSignInTime () {
      if (this.user.metadata) {
        let lastSignInTime = this.user.metadata.lastSignInTime

        let tmstmp = new Date (lastSignInTime),
            localeDate = tmstmp.toLocaleDateString(),
            localeTime = tmstmp.toLocaleTimeString()

        return localeDate + ' ' + localeTime   
      }
    }

  }
}
</script>

<style lang="scss">
.section-border-top {
  border-top: 1px solid #eeeeee;
}
</style>


