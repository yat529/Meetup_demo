<template>
  <v-container px-5 py-0>
    <v-layout row px-5>
      <v-flex xs12>
        <v-card flat class="px-4 py-4">
          <!-- card body - form -->
          <form @submit.prevent="createMeetup">
            <v-card-text class="px-4 py-4">
              <h1 class="primary--text mb-4">发起新的MEETUP</h1>
              <!-- type -->
              <v-container class="text-wrapper">
                <h3 class="text-title">类型</h3>
                <!-- radio selection -->
                <v-layout class="type-opt-wrapper" row wrap>
                  <v-flex class="custom-radio-group" xs12 md7>    
                    <label class="fake-button" 
                    :class="type_selected === types[index]? 'checked' : ''"
                    v-for="(item, index) in types" :key="index">
                      <span class="fake-button-icon">
                        <i class="far fa-dot-circle" v-if="type_selected === types[index]"></i>
                        <i class="far fa-circle" v-else></i>
                      </span>
                      {{ types[index] }}
                      <input type="radio" id="mt_public" class="fake-input"
                      name="mt_type" :value="types[index]" v-model="type_selected">
                    </label>
                  </v-flex>

                  <v-flex class="hint" xs12 md5 v-show="type_selected">
                    <p v-show="type_selected === '公开'">对所有人可见, 并且任何人都可以参加, 适合没有人数限制的活动</p>
                    <p v-show="type_selected === '半公开'">对所有人可见, 但必须获得创办人授权才能参加</p>
                    <p v-show="type_selected === '私人'">仅对创办人以及被通知的朋友可见</p>
                  </v-flex>
                </v-layout>
              </v-container>

              <!-- category -->
              <v-container class="text-wrapper">
                <h3 class="text-title">主题</h3>
                <!-- radio selection -->
                <div class="custom-radio-group">
                  <label class="fake-button" v-for="(item, index) in categories" :key="index">
                    <input type="radio" class="fake-input" v-model="cat_selected" v-bind:value="categories[index]" />
                    <span class="fake-button-icon">
                      <i class="fas fa-check-circle" v-if="cat_selected === categories[index]"></i>
                      <i class="far fa-circle" v-else></i>
                    </span>
                    {{ categories[index] }}
                    </label>
                </div>
              </v-container>

              <v-container class="text-wrapper">
                <h3 class="text-title">通知好友</h3>
                <div class="person-card-wrapper">
                  <!-- <div class="person-card" @click="addFriend(friend)" v-for="friend in user.friends" :key="friend.uid"> -->
                  <div class="person-card">
                    <div class="avatar" :style="avatarBgUrl"></div>
                    <div class="name primary--text">{{ user.nickname }}</div>
                    <div class="indicator">
                      <!-- <i class="fas fa-check-circle" v-if="friend.selected === true"></i> -->
                      <i class="fas fa-check-circle" v-if="true"></i>
                    </div>
                  </div>
                </div>
              </v-container>

              <!-- title input -->
              <v-container class="text-wrapper">
                <h3 class="text-title">标题</h3>
                <v-text-field
                  label="必填"
                  v-model="title"
                  :rules="[(v) => v.length <= 25 || '不超过25个字']"
                  :counter="25"
                  required
                ></v-text-field>
              </v-container>

              <!-- location input -->
              <v-container class="text-wrapper">
                <h3 class="text-title">地址</h3>
                <setLocationMap :clear="clearMap"></setLocationMap>
              </v-container>

              <!-- image loader -->
              <v-container class="px-0 py-0 section-wrapper">
                <v-tabs v-model="activeTab" color="primary" dark grow slider-color="yellow">
                  <v-tab ripple>
                    上传本地图片
                  </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text class="mt-3 image-section">
                        <!-- image insertion -->
                        <fileloader></fileloader>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                  <!-- tab 2 -->
                  <v-tab ripple>
                    使用网络图片
                  </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text class="mt-3 image-section">
                        <urlpreviewer :clear="clearUrl"></urlpreviewer>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </v-container>

              <!-- group size/seats -->
              <v-container class="text-wrapper">
                <h3 class="text-title">活动人数</h3>
                <v-select
                  :items="sizes"
                  v-model="groupSize"
                  v-if="!isCustomSize"
                  label="选择人数"
                  required
                ></v-select>
                <v-text-field
                  label="输入活动人数"
                  v-model="customGroupSize"
                  v-if="isCustomSize"
                  hint="请输入数字, 上限为999人"
                  persistent-hint
                  mask="###"
                  required
                ></v-text-field>
              </v-container>
              
              <!-- description textarea -->
              <v-container class="text-wrapper">
                <h3 class="text-title">活动介绍</h3>
                <v-text-field
                  class="custom-border"
                  label="点击输入"
                  v-model="description"
                  textarea
                  rows="10"
                ></v-text-field>
              </v-container>

              <!-- date&time picker input -->
              <v-layout row>
                <!-- date picker -->
                <v-flex xs-6 pr-3>
                  <v-container class="text-wrapper">
                    <v-dialog
                      ref="datePicker"
                      persistent
                      v-model="dateModal"
                      lazy
                      full-width
                      width="290px"
                      :return-value.sync="date"
                    >
                      <v-text-field
                        slot="activator"
                        label="选择日期"
                        v-model="date"
                        prepend-icon="event"
                        readonly
                      ></v-text-field>
                      <v-date-picker v-model="date" scrollable>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="dateModal = false">取消</v-btn>
                        <v-btn flat color="primary" @click="$refs.datePicker.save(date)">确定</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-container>
                </v-flex> 

                <!-- time picker -->
                <v-flex xs-6 pl-3>
                  <v-container class="text-wrapper">
                    <v-dialog
                      ref="timePicker"
                      persistent
                      v-model="timeModal"
                      lazy
                      full-width
                      width="290px"
                      :return-value.sync="time"
                    >
                      <v-text-field
                        slot="activator"
                        label="选择时间"
                        v-model="time"
                        prepend-icon="access_time"
                        readonly
                      ></v-text-field>
                      <v-time-picker v-model="time" actions>
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="timeModal = false">取消</v-btn>
                        <v-btn flat color="primary" @click="$refs.timePicker.save(time)">确定</v-btn>
                      </v-time-picker>
                    </v-dialog>
                  </v-container>
                </v-flex>
              </v-layout>
            </v-card-text>
            <!-- button -->
            <v-layout class="px-4 py-4" row wrap>
              <v-btn large flat :disabled="!validForm" class="primary" type="submit">创建MEETUP</v-btn>
              <v-spacer></v-spacer>
              <v-btn large flat outline class="primary--text" type="button" @click="goBack">返回</v-btn>
            </v-layout>
          </form>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>
<script>
/* eslint-disable */
import fileloader from '@/components/common/fileloader'
import urlpreviewer from '@/components/common/urlpreviewer'
import setLocationMap from '@/components/common/setLocation'

export default {
  components: {
    fileloader,
    urlpreviewer,
    setLocationMap
  },
  data () {
    return {
      title: '',
      activeTab: null,
      description: '',
      date: null,
      dateModal: false,
      time: null,
      timeModal: false,
      sizes: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,'自定'],
      groupSize: null,
      customGroupSize: null,
      clearMap: false,
      clearUrl: false,
      type_selected: '',
      cat_selected: '',
      selectedFirends: [this.user],
    }
  },
  methods: {
    createMeetup () {
      const meetup = {
        type: this.type_selected,
        category: this.cat_selected,
        title: this.title,
        location: this.location,
        size: this.isCustomSize ? this.customGroupSize : this.groupSize,
        description: this.description,
        date: this.date,
        time: this.time,
        uid: this.$store.state.userModule.user_ref.uid,
        organizer: {
          nickname: this.$store.state.userModule.user_ref.nickname,
          photoURL: this.$store.state.userModule.user_ref.photoURL,
          sex: this.$store.state.userModule.user_ref.sex
        },
        date_created: Date.now()
      }

      if (this.validForm) {
        this.$store.dispatch('createMeetup', meetup)
        .then(() => {
          this.$router.push('/meetups')
        })
      }
    },
    addFriend (firend) {
      if (friend.selected === undefined) {
        Vue.set(friend, 'selected', false)
      }
      friend.selected = !friend.selected
      this.selectedFirends.push(firend)
    },
    goBack () {
      this.$router.go(-1)
    }
  },
  computed: {
    validForm () {
      return this.title.length && 
      this.location.address.length &&
      (this.isCustomSize ? this.customGroupSize : this.groupSize) &&
      this.description.length &&
      this.date && this.time
    },
    location () {
      return this.$store.state.gmLocation
    },
    isCustomSize () {
      return this.groupSize === '自定'
    },
    types () {
      return this.$store.state.meetupModule.type
    },
    categories () {
      return this.$store.state.meetupModule.category
    },
    user () {
      return this.$store.state.userModule.user_ref
    },
    avatarBgUrl () {
      if (this.user) {
        let photoURL = this.user.photoURL
        return `background-image: url("${ photoURL }")`
      }
    }
  },
  created () {
    // this.$store.commit('clearLoadedMeetUp')
  }
}
</script>
<style lang="scss">
.text-wrapper {
  margin-bottom: 25px;
  padding: 25px 35px;
  background: #fafafa;
  box-shadow: 0 2px 13px -7px rgba(0, 0, 0, 0.4);

  .text-title {
    position: relative;
    padding-left: 20px;
    margin-bottom: 10px;
    height: 30px;
    line-height: 30px;
    font-size: 20px;
    color: #a1887f !important;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      width: 5px;
      height: 20px;
      transform: translateY(-50%);
      background: #a1887f;
    }
  }
}

.section-wrapper {
  margin-bottom: 25px;
  background: #fafafa;
  box-shadow: 0 2px 13px -7px rgba(0, 0, 0, 0.4);

  .image-section {
    padding: 25px 35px;
    background: #fafafa;
  }
}

.custom-border {
  .input-group__input {
    border: none !important;
    background: #fff !important;

    &:focus {
      box-shadow: 0 2px 10px -5px rgba(0, 0, 0, 0.4);
    }
  }
}

.type-opt-wrapper {
  margin-top: 25px;

  .hint {
    position: relative;
    height: 70px;
    padding-left: 15px;
    align-self: center;

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      width: 4px;
      height: 45px;
      background: #ffffff;
      transform: translateY(-50%);
    }
    p {
      position: relative;
      top: 50%;
      padding: 15px;
      font-size: 16px;
      font-weight: 500;
      line-height: 20px;
      color: #a1887f;
      transform: translateY(-50%);
    }
  }
}

.custom-radio-group {
  align-self: center;
  overflow: hidden;

  .fake-button {
    display: block;
    position: relative;
    top: 7px;
    float: left;
    padding: 10px 25px;
    margin-right: 25px;
    margin-bottom: 15px;
    background: #ffffff;
    font-size: 18px;
    font-weight: 500;
    color: #a1887f;
    border-radius: 5px;
    box-shadow: 0 2px 10px -7px rgba(0, 0, 0, 0.4);
    cursor: pointer;

    &.checked {
      background: #a1887f;
      color: #ffffff;
    }

    .fake-input {
      position: absolute;
      visibility: hidden;
    }
  }
  .fake-button-icon {
    margin-right: 10px;
  }
}

.person-card-wrapper {
  margin-top: 25px;
  overflow: hidden;

  .person-card {
    position: relative;
    float: left;
    padding: 5px 10px;
    margin-right: 15px;
    margin-bottom: 15px;
    width: 105px;
    height: 125px;
    background: #ffffff;
    border-radius: 10px;
    transition: all 0.1s ease-in;
    overflow: hidden;
    cursor: pointer;

    &:hover {
      box-shadow: 0 2px 10px -6px rgba(0, 0, 0, 0.4);
    }

    .avatar {
      display: block;
      width: 60px;
      height: 60px;
      margin: 10px auto 5px auto;
      border-radius: 50%;
      border: 3px solid #eeeeee;
      background-position: center;
      background-size: cover;
    }
    .name {
      width: 100%;
      padding: 5px 10px;
      margin-bottom: 10px;
      text-align: center;
      font-weight: 400;
      font-size: 13px;
    }

    .indicator {
      position: absolute;
      top: -22px;
      right: -22px;
      width: 45px;
      height: 45px;
      font-size: 12px;
      color: #ffffff;
      text-align: center;
      background: green;
      transform: rotate(45deg);

      i {
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%) rotate(-45deg);
        font-size: 12px;
      }
    }
  }
}


</style>
