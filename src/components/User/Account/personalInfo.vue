<template>
  <v-container class="tabView" px-0 py-0 v-if="user">

    <v-layout class="tab-controls" py-2 row wrap justify-center mb-4>
      <v-btn flat round dark color="primary" :class="profileTab === 0 ? 'btn--active' : ''" @click="profileTab = 0">信息</v-btn>
      <v-btn flat round dark color="primary" :class="profileTab === 1 ? 'btn--active' : ''" @click="profileTab = 1">头像</v-btn>
      <v-btn flat round dark color="primary" :class="profileTab === 2 ? 'btn--active' : ''" @click="profileTab = 2">喜好</v-btn>
    </v-layout>

    <!-- personal information -->
    <v-form class="bottom-fix" ref="personalInfoForm" lazy-validation v-show="profileTab === 0">
      <!-- basic info -->
      <v-container px-0 py-0 mb-3>
        <h3 class="primary--text section-title">个人信息</h3>
        <p class="primary--text section-subtitle">你只需要提供最基本的信息, 这些信息将公开显示</p>
        <!-- f&l name -->
        <v-layout row wrap align-center mb-4>
          <v-flex xs3>
            <v-subheader class="primary--text">名字</v-subheader>
          </v-flex>
          <v-flex xs9>
            <v-layout row wrap>
              <v-flex xs12 sm6 px-4>
                <v-text-field name="lname" label="姓" id="lname" v-model="lname" 
                required 
                validate-on-blur
                :rules="requiredRule"
                counter="15"
                hint="不超过15个字符"
                :disabled="!updateMode"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 px-4>
                <v-text-field name="fname" label="名" id="fname" v-model="fname" 
                required 
                validate-on-blur
                :rules="requiredRule"
                counter="15"
                hint="不超过15个字符"
                :disabled="!updateMode"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>

        <!-- nickname -->
        <v-layout row wrap align-center mb-4>
          <v-flex xs3>
            <v-subheader class="primary--text">昵称</v-subheader>
          </v-flex>
          <v-flex xs9 d-flex px-4>
            <v-text-field name="nickname" label="昵称" id="nickname" v-model="nickname" 
            :rules="requiredRule"
            counter="15"
            validate-on-blur
            required
            hint="昵称将作为你的名称公开显示" 
            persistent-hint 
            :disabled="!updateMode"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <!-- sex -->
        <v-layout row align-center>
          <v-flex xs3>
            <v-subheader class="primary--text">性别</v-subheader>
          </v-flex>
          <v-flex xs9 px-4>
            <v-radio-group v-model="sex" row>
              <v-radio label="男生" :disabled="!updateMode" value="male"></v-radio>
              <v-radio label="女生" :disabled="!updateMode" value="female"></v-radio>
            </v-radio-group>
          </v-flex>
        </v-layout>

        <!-- birthday -->
        <v-layout row align-center>
          <v-flex xs3>
            <v-subheader class="primary--text">生日</v-subheader>
          </v-flex>
          <v-flex xs9 px-4>
            <v-container px-0 py-0>
              <v-dialog
                ref="datePicker"
                persistent
                v-model="dateModal"
                lazy
                full-width
                width="290px"
                :return-value.sync="birthday"
                :disabled="!updateMode"
              >
                <v-text-field
                  slot="activator"
                  label="选择日期"
                  v-model="birthday"
                  prepend-icon="event"
                  color="primary"
                  :disabled="!updateMode"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="birthday" scrollable color="primary">
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="dateModal = false">取消</v-btn>
                  <v-btn flat color="primary" @click="$refs.datePicker.save(birthday)">确定</v-btn>
                </v-date-picker>
              </v-dialog>
            </v-container>
          </v-flex>
        </v-layout>
      </v-container>

      <!-- residence info -->
      <!-- <v-container px-0 py-0>

      </v-container> -->

      <!-- social account info -->
      <v-container px-0 py-0>
        <h3 class="primary--text section-title">社交账户信息</h3>
        <p class="primary--text section-subtitle">你的社交账户页面</p>

        <!-- QQ -->
        <v-layout row wrap align-center mb-2>
          <v-flex xs3>
            <v-subheader class="primary--text">
              <v-icon>fab fa-qq</v-icon>
            </v-subheader>
          </v-flex>
          <v-flex xs9 d-flex px-4>
            <v-text-field name="qq" label="QQ号码" id="qq" v-model="qq" 
            hint="QQ账号格式....."
            :disabled="!updateMode"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <!-- Wechat -->
        <v-layout row wrap align-center mb-2>
          <v-flex xs3>
            <v-subheader class="primary--text">
              <v-icon>fab fa-weixin</v-icon>
            </v-subheader>
          </v-flex>
          <v-flex xs9 d-flex px-4>
            <v-text-field name="qq" label="微信号码" id="wechat" v-model="wechat" 
            hint="微信账号格式...." 
            :disabled="!updateMode"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <!-- Weibo -->
        <v-layout row wrap align-center mb-2>
          <v-flex xs3>
            <v-subheader class="primary--text">
              <v-icon>fab fa-weibo</v-icon>
            </v-subheader>
          </v-flex>
          <v-flex xs9 d-flex px-4>
            <v-text-field name="weibo" label="微博账号" id="weibo" v-model="weibo" 
            hint="微博账号格式...." 
            :disabled="!updateMode"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <!-- facebook -->
        <v-layout row wrap align-center mb-2>
          <v-flex xs3>
            <v-subheader class="primary--text">
              <v-icon>fab fa-facebook</v-icon>
            </v-subheader>
          </v-flex>
          <v-flex xs9 d-flex px-4>
            <v-text-field name="facebook" label="Facebook用户名" id="facebook" v-model="facebook"
            hint="Facebook的用户名" 
            :disabled="!updateMode"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <!-- instagram -->
        <v-layout row wrap align-center mb-2>
          <v-flex xs3>
            <v-subheader class="primary--text">
              <v-icon>fab fa-instagram</v-icon>
            </v-subheader>
          </v-flex>
          <v-flex xs9 d-flex px-4>
            <v-text-field name="instagram" label="Instagram用户名" id="instagram" v-model="instagram"
            hint="Instagram用户名" 
            :disabled="!updateMode"
            ></v-text-field>
          </v-flex>
        </v-layout>

        <!-- snapchat -->
        <v-layout row wrap align-center mb-2>
          <v-flex xs3>
            <v-subheader class="primary--text">
              <v-icon>fab fa-snapchat-square</v-icon>
            </v-subheader>
          </v-flex>
          <v-flex xs9 d-flex px-4>
            <v-text-field name="snapchat" label="Snapchat用户名" id="snapchat" v-model="snapchat"
            hint="Snapchat用户名" 
            :disabled="!updateMode"
            ></v-text-field>
          </v-flex>
        </v-layout>

      </v-container>


      <v-layout class="action-btns" py-3 justify-center align-center row wrap>
        <v-btn round color="primary" v-if="!updateMode" @click="toUpdate">更新</v-btn>
        <v-btn round dark color="green lighten-1" v-else @click="confirmUpdate">确认</v-btn>
        <v-flex xs2></v-flex>
        <v-btn round color="primary" @click="resetForm">取消</v-btn>
      </v-layout>
    </v-form>

    <!-- avatar -->
    <v-container class="bottom-fix" px-0 py-0 v-show="profileTab === 1">
      <h3 class="subheading primary--text mb-3">{{ user.photoURL ? '当前头像' : '还没有上传头像'}}</h3>
      <v-tabs v-model="activeTab" color="primary" dark grow slider-color="white" v-if="updateMode">
        <v-tab>
          上传本地图片
        </v-tab>
        <v-tab-item>
          <v-card flat class="transparent">
            <v-card-text class="mt-3 preview-image-section">
              <!-- image insertion -->
              <fileloader :showPreview="false"></fileloader>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <!-- tab 2 -->
        <v-tab>
          使用网络图片
        </v-tab>
        <v-tab-item>
          <v-card flat class="transparent">
            <v-card-text class="mt-3 preview-image-section">
              <urlpreviewer :showPreview="false" :defaultUrl="user.photoURL || ''"></urlpreviewer>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
      <div class="avatar-preview-wrapper mb-4">
        <div class="avatar-preview" :style="avatarUrl"></div>
      </div>

      <v-layout class="action-btns" py-3 justify-center align-center row wrap>
        <v-btn round color="primary" v-if="!updateMode" @click="toUpdate">更新</v-btn>
        <v-btn round dark color="green lighten-1" v-else @click="confirmUpdate">确认</v-btn>
        <v-flex xs2></v-flex>
        <v-btn round color="primary" @click="resetForm">取消</v-btn>
      </v-layout>
    </v-container>
    
  </v-container>
</template>

<script>
/* eslint-disable */
import fileloader from '@/components/common/fileloader'
import urlpreviewer from '@/components/common/urlpreviewer'

export default {
  components: {
    fileloader,
    urlpreviewer
  },

  props: {
    user: {
      type: Object
    }
  },

  data () {
    return {
      updateMode: false,
      profileTab: 0,
      activeTab: null,
      fname: this.user.fullname,
      lname: this.user.fullname,
      nickname: this.user.nickname,
      sex: this.user.sex,
      birthday: this.user.birthday,
      dateModal: false,

      // social usrnames
      qq: this.user.social,
      wechat: this.user.social,
      weibo: this.user.weibo,
      facebook: this.user.social,
      instagram: this.user.instagram,
      snapchat: this.user.snapchat,
    }
  },

  computed: {
    requiredRule () {
      return [
        value => !!value || '必须填写'
      ]
    },

    avatarUrl () {
			if (this.user) {
				let url = this.$store.state.flimageTempUrl || this.user.photoURL
				return `background-image: url("${ url }")`
			}
		},
  },

  methods: {
    toUpdate () {
      this.updateMode = true
    },

    confirmUpdate () {
      // update
    },

    resetForm () {
      if (this.updateMode) {
        let form = this.$refs.personalInfoForm
        form.reset()
        this.fname = this.user.fullname
        this.lname = this.user.fullname
        this.nickname = this.user.nickname
        this.sex = this.user.sex
        this.updateMode = false
      }
    }
  },

  watch: {
    // 
  }
}
</script>

<style lang="scss">

.tab-controls {
  border-top: 1px solid #eeeeee;
  border-bottom: 1px solid #eeeeee;
}

.action-btns {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: rgba(250, 250, 250, 0.8);
  border-top: 1px solid #eeeeee;
}

.section-title {
  padding: 0 16px;
  font-size: 18px;
  font-weight: 500;
}

.section-subtitle {
  padding: 0 16px;
  font-size: 13px;
  font-weight: 400;
}

.bottom-fix {
  padding-bottom: 80px !important;
}

.avatar-preview-wrapper {
	position: relative;
	width: 100%;
	height: 150px;
	background: #eeeeee;

	.avatar-preview {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100px;
		height: 100px;
		transform: translate(-50%, -50%);
		border: 4px solid #fff;
		border-radius: 50%;
		background-position: center;
		background-size: cover;
		background-repeat: no-repeat;
	}
}
</style>

