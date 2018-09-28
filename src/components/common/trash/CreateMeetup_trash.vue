<template>
  <v-container pb-0 fluid fill-height :class="isMobile ? '' : 'extra-px'">
    <v-layout row wrap :class="isMobile ? 'px-0' : 'px-5'">
      <v-flex xs12 style="position: relative">
          <v-card flat color="transparent" :class="isMobile ? 'px-0' : 'px-1'" v-if="user" style="height: 100%">
            <!-- card body - form -->
            <form class="step-form-wrapper" @submit.prevent="createMeetup" style="height: 100%">
                <div class="step-form-header">
                  <h1 class="primary--text title">创建新的米团</h1>
                  <p class="primary--text mb-4">{{ '第'+ step + '/8步' }}</p>
                </div>

                <!-- type -->
                <transition name="slide" mode="out-in">
                <div class="step-page pb-fix" v-show="step === 1">
                  <v-container class="text-wrapper" :class="isMobile ? '' : ''">
                    <h3 class="text-title">类型</h3>
                    <!-- radio selection -->
                    <v-layout class="type-opt-wrapper" row wrap>
                      <v-flex class="custom-radio-group" :class="isMobile ? 'small' : ''" xs12 md7>    
                        <label class="fake-button"
                        :class="type_selected === types[index]? 'checked' : ''"
                        v-for="(item, index) in types" :key="index">
                          <span class="fake-button-icon body-1">
                            <i class="far fa-dot-circle" v-if="type_selected === types[index]"></i>
                            <i class="far fa-circle" v-else></i>
                          </span>
                          {{ typesCN[index] }}
                          <input type="radio" id="mt_public" class="fake-input"
                          name="mt_type" :value="types[index]" v-model="type_selected">
                        </label>
                      </v-flex>

                      <v-flex class="hint" xs12 md5 :class="isMobile ? 'small' : ''" v-show="type_selected">
                        <p v-show="type_selected === 'public'">对所有人可见, 并且任何人都可以参加, 适合没有人数限制的活动</p>
                        <p v-show="type_selected === 'personal'">对所有人可见, 但必须获得你的授权才能参加</p>
                        <p v-show="type_selected === 'private'">仅对你以及被你邀请的朋友可见</p>
                      </v-flex>
                    </v-layout>
                  </v-container>

                  <!-- category -->
                  <v-container class="text-wrapper">
                    <h3 class="text-title">主题</h3>
                    <!-- radio selection -->
                    <div class="custom-radio-group" :class="isMobile ? 'small' : ''">
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
                </div>
                </transition>
              
                <!-- invite friend -->
                <transition name="slide" mode="out-in">
                <div class="step-page" v-show="step === 2">
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
                  <!-- invite friend -->
                  <v-container class="text-wrapper">
                    <h3 class="text-title">通知好友</h3>
                    <v-btn small round flat class="primary--text edit-friends-list" v-show="selectedFirends.length && !selectFriendsMode"
                    @click="selectFriendsMode = true">
                      <v-icon left small>fas fa-sliders-h</v-icon>
                      编辑列表
                    </v-btn>
                    <v-layout class="person-card-wrapper" row wrap v-if="selectFriendsMode">        
                      <UserList :users="friends" :showInviteFriend="false" :isMobile="isMobile"
                      v-on:confirm="confirmFriendSelection"
                      v-on:close="selectFriendsMode = false"></UserList>
                    </v-layout>

                    <v-layout class="person-card-wrapper" row wrap v-else-if="!selectFriendsMode">
                      <v-layout class="placeholder" row justify-center align-center v-if="!selectedFirends.length">
                        <v-btn flat round color="primary" @click="selectFriends">
                          <v-icon left>add_circle_outline</v-icon>
                          选择好友
                        </v-btn>
                      </v-layout>
                      <v-layout row justify-end align-center v-else-if="selectedFirends.length">
                        <UserCards :users="selectedFirends" :isMobile="isMobile"></UserCards>
                      </v-layout>
                    </v-layout>
                  </v-container>
                </div>
                </transition>

                <!-- title & description -->
                <transition name="slide" mode="out-in">
                <div class="step-page" v-show="step === 3">
                  <v-container class="text-wrapper mb-0">
                    <h3 class="text-title">标题</h3>
                    <v-text-field
                      label="必填"
                      v-model="title"
                      :rules="[(v) => v.length <= 80 || '不超过80个字']"
                      :counter="80"
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
                      rows="8"
                    ></v-text-field>
                  </v-container>
                </div>
                </transition>

                <!-- location input -->
                <transition name="slide" mode="out-in">
                <div class="step-page" v-show="step === 4">
                  <v-container class="text-wrapper">
                    <h3 class="text-title mb-2">地址</h3>
                    <p class="primary--text mb-4">直接输入商户名称,或者详细地址. 系统会根据你输入的信息自动进行匹配. 建议直接从下拉菜单的匹配信息中直接选择.</p>
                    <setLocationMap :clear="clearMap"></setLocationMap>
                  </v-container>
                </div>
                </transition>

                <!-- image loader -->
                <transition name="slide" mode="out-in">
                <div class="step-page" v-show="step === 5">
                  <v-container class="section-wrapper">
                    <h3 class="text-title mb-2">封面图片</h3>
                    <p class="primary--text mb-4">所选图片将作为你的活动封面对外展示, 建议使用高清图片. 如果没有上传图片, 系统将使用默认图片.</p>

                    <v-tabs v-model="activeTab" color="primary" dark grow slider-color="white">
                      <v-tab ripple>
                        上传本地图片
                      </v-tab>
                      <v-tab-item>
                        <v-card flat>
                          <v-card-text class="mt-3 preview-image-section">
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
                          <v-card-text class="mt-3 preview-image-section">
                            <urlpreviewer :clear="clearUrl" :showPreview="true"></urlpreviewer>
                          </v-card-text>
                        </v-card>
                      </v-tab-item>
                    </v-tabs>
                  </v-container>
                </div>
                </transition>
              
                <!-- list -->
                <transition name="slide" mode="out-in">
                <div class="step-page" v-show="step === 6">
                  <v-container class="text-wrapper">
                    <h3 class="text-title mb-2">活动计划</h3>
                    <p class="primary--text mb-4">将以列表的形式显示, 适用于行程规划, 时间线等元素</p>
                    
                    <v-container row class="list-preview-wrapper mb-4" v-show="list.length">
                      <p class="mb-0 primary--text">计划列表预览</p>
                      <v-layout row class="mb-4">
                        <div class="list-wrapper" v-if="list.length">
                          <div class="list-item" v-for="(item, index) in list" :key="index">
                            <div class="decor"></div>
                            <div class="body">
                              <div class="body-2">{{ item.title }}</div>
                              <div class="body-1">{{ item.content }}</div>
                            </div>
                          </div>
                        </div>
                      </v-layout>
                    </v-container>

                    <v-form ref="detailList" lazy-validation>
                      <v-layout row>
                        <v-text-field
                          label="标题"
                          v-model="listTitle"
                          :rules="listTitleRule"
                          required
                        ></v-text-field>
                      </v-layout>
                      <v-layout row>
                        <v-text-field
                          label="内容"
                          v-model="listContent"
                          multi-line
                          rows="3"
                        ></v-text-field>
                      </v-layout>
                    </v-form>

                    <v-layout row justify-center>
                      <v-btn round dark color="primary" @click="addToList">
                        <v-icon small left>fas fa-plus-circle</v-icon>
                        添加计划
                      </v-btn>
                    </v-layout>
                  </v-container>
                </div>
                </transition>

                <!-- grid -->
                <transition name="slide" mode="out-in">
                <div class="step-page" v-show="step === 7">
                  <v-container class="text-wrapper">
                    <h3 class="text-title mb-2">活动事项</h3>
                    <p class="primary--text mb-4">将以方块的形式显示, 适用于重要事项,等元素, 方块会根据屏幕大小自适应</p>

                    <v-container row class="grid-preview-wrapper mb-4" v-show="grid.length">
                      <p class="mb-3 primary--text">事项方块预览</p>
                      <v-layout row>
                        <div class="grid-wrapper" v-if="grid.length">
                          <div class="grid mb-2" v-for="(item, index) in grid" :key="index">
                            <span>{{ item }}</span>
                          </div>
                        </div>
                      </v-layout>
                    </v-container>

                    <v-form ref="detailGrid" lazy-validation>
                      <v-layout row>
                        <v-text-field
                          label="内容"
                          v-model="gridContent"
                          :rules="gridContentRule"
                          hint="10个字以内"
                          max="10"
                          counter="10"
                          required
                        ></v-text-field>
                      </v-layout>
                    </v-form>

                    <v-layout row justify-center>
                      <v-btn round dark color="primary" @click="addToGrid">
                        <v-icon small left>fas fa-plus-circle</v-icon>
                        添加事项
                      </v-btn>
                    </v-layout>

                  </v-container>
                </div>
                </transition>

                <!-- date&time picker input -->
                <transition name="slide" mode="out-in">
                <div class="step-page" v-show="step === 8">
                  <v-container class="text-wrapper mb-0">
                    <h3 class="text-title mb-3">活动时间</h3>
                    <v-layout row wrap align-content-start> 
                      <!-- date picker -->
                      <v-flex xs12 md6>
                        <v-container px-0 py-0 class="text-wrapper mb-2">
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
                              color="primary"
                              readonly
                            ></v-text-field>
                            <v-date-picker v-model="date" scrollable color="primary">
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="dateModal = false">取消</v-btn>
                              <v-btn flat color="primary" @click="$refs.datePicker.save(date)">确定</v-btn>
                            </v-date-picker>
                          </v-dialog>
                        </v-container>
                      </v-flex> 

                      <!-- time picker -->
                      <v-flex xs12 md6>
                        <v-container px-0 py-0 class="text-wrapper mb-0">
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
                  </v-container>
                </div>
                </transition>

                <!-- button -->
                <div class="step-btns">
                  <v-layout row wrap justify-center v-if="step < 8">
                    <v-btn icon small color="primary" v-if="step > 1" @click="step--">
                      <v-icon small>fas fa-arrow-circle-left</v-icon>
                    </v-btn>
                    <v-spacer v-else></v-spacer>
                    <v-btn icon small color="primary" @click="step++">
                      <v-icon small>fas fa-arrow-circle-right</v-icon>
                    </v-btn>
                  </v-layout>
                  <v-layout row wrap justify-start v-else-if="step === 8">
                    <v-btn icon small color="primary" @click="step--">
                      <v-icon small>fas fa-arrow-circle-left</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                  </v-layout>
                </div>

                <div class="step-cus-btns">
                  <v-layout row wrap justify-center v-show="step === 8">
                    <v-btn round color="primary" :disabled="!validForm" class="primary" type="submit">
                      <v-icon small left>far fa-check-circle</v-icon>
                      创建米团
                    </v-btn>
                  </v-layout>

                  <v-layout row wrap justify-center v-show="step === 1">
                    <v-btn round color="primary" @click="goBack">
                      <v-icon small left>fas fa-undo</v-icon>
                      返回
                    </v-btn>
                  </v-layout>
                </div>

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
import UserList from '@/components/common/userList'
import UserCards from '@/components/common/userCards'

export default {
  components: {
    UserList,
    UserCards,
    fileloader,
    urlpreviewer,
    setLocationMap
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      step: 1,
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
      selectFriendsMode: false,
      selectedFirends: [],
      list: [],
      listTitle: '',
      listContent: '',
      grid: [],
      gridContent: '',
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
        list: this.list,
        grid: this.grid,
        date: this.date,
        time: this.time,
        uid: this.$store.state.userModule.user_ref.uid,
        organizer: {
          nickname: this.$store.state.userModule.user_ref.nickname,
          photoURL: this.$store.state.userModule.user_ref.photoURL,
          gender: this.$store.state.userModule.user_ref.gender
        },
        date_created: Date.now()
      }

      if (this.validForm) {
        this.$store.dispatch('createMeetup', meetup)
        .then(key => {
          // invite friend
          let invitedFriends = this.selectedFirends
          if (invitedFriends.length) {
            invitedFriends.forEach(friend => {
              // remove the checked property
              this.$delete(friend, 'checked')
              this.$store.dispatch('sendGroupInvitation', {
                target_user: friend, 
                meetup_key: key
              })
            })
          }
          this.$router.push('/meetup/' + key)
        })
      }
    },

    confirmFriendSelection (list) {
      this.selectedFirends = list
      this.selectFriendsMode = false
    },

    selectFriends () {
      this.selectFriendsMode = true
    },
    
    goBack () {
      this.$router.go(-1)
    },

    addToList () {
      let item = {
        title: this.listTitle,
        content: this.listContent
      }

      if ( this.$refs.detailList.validate() ) {
        this.list.push(item)
        this.$refs.detailList.reset()
      }
    },

    addToGrid () {
      let item = this.gridContent
      if ( this.$refs.detailGrid.validate() ) {
        this.grid.push(item)
        this.$refs.detailGrid.reset()
      }
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
    typesCN () {
      return this.$store.state.meetupModule.typeCN
    },
    categories () {
      return this.$store.state.meetupModule.category
    },
    user () {
      return this.$store.state.userModule.user_ref
    },
    friends () {
      let array = [],
          user = this.user
      if (user.friends) {
        for(let key in user.friends) {
          array.push(user.friends[key])
        }
      }
      return array
    },
    avatarBgUrl () {
      if (this.user) {
        let photoURL = this.user.photoURL
        return `background-image: url("${ photoURL }")`
      }
    },
    listTitleRule () {
      return [value => !!value || '必须输入标题']
    },
    gridContentRule () {
      return [
        value => !!value || '必须输入内容',
        value => {
          if (value) {
            return value.length <= 10 || '不能超过10个字'
          }
          return false
        }
      ]
    }
  },
  created () {
    // this.$store.commit('clearLoadedMeetUp')
  }
}
</script>
<style lang="scss">
$primaryColor: #a1887f;

.text-wrapper,
.section-wrapper {
  position: relative;
  margin-bottom: 25px;
  padding-top: 0px !important;

  &:last-child {
    margin-bottom: 0px;
  }

  .text-title {
    position: relative;
    padding-left: 20px;
    margin-bottom: 10px;
    height: 30px;
    line-height: 30px;
    color: $primaryColor;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 5px;
      height: 20px;
      transform: translateY(-50%);
      background: $primaryColor;
    }
  }
}

.section-wrapper {
  margin-bottom: 25px;

  .preview-image-section {
	  min-height: 120px;
    padding: 25px 35px;
  }
}

.custom-border {
  .input-group__input {
    border: 1px solid #eeeeee !important;
    background: transparent !important;
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
      transform: translateY(-50%);
    }
    p {
      position: relative;
      top: 50%;
      padding: 15px;
      line-height: 20px;
      color: $primaryColor;
      transform: translateY(-50%);
    }

    &.small {
      padding-left: 0px;

      &::before {
        display: none;
      }

      p {
        margin-top: 15px;
        margin-bottom: 0px !important;
      }
    }
  }
}

.custom-radio-group {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  align-self: center;
  overflow: hidden;

  &.small {
    justify-content: flex-start;

    .fake-button {
      flex: 0 0 auto;
      top: auto;
      padding: 5px 10px;
      margin-right: 0px;
      margin-bottom: 0px;
    }
  }

  .fake-button {
    display: block;
    position: relative;
    top: 7px;
    float: left;
    padding: 10px 25px;
    margin-right: 25px;
    margin-bottom: 15px;
    color: $primaryColor;
    border-radius: 5px;
    cursor: pointer;

    &.checked {
      background: $primaryColor;
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
  padding: 5px;
  max-height: 350px;
  overflow: auto;

  .placeholder {
    width: 100%;
    height: 150px !important;
    border-radius: 15px;
    background: #eeeeee;
  }
}

.edit-friends-list {
  position: absolute;
  top: 24px;
  right: 1px;
  margin: 0;
}

.list-preview-wrapper,
.grid-preview-wrapper  {
  padding: 15px;
  border: 2px solid #eeeeee;
}

.list-wrapper {
  width: 100%;
  padding: 0;

  .list-item {
    width: 100%;
    padding: 0px;
    overflow: hidden;

    .body {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 15px 30px 15px 60px;

      &::before,
      &::after {
        content: '';
        position: absolute;
        left: 10px;
      }

      &::before {
        top: 0;
        width: 5px;
        height: 100%;
        background: #eeeeee;
        transform: translateX(-50%);
      }

      &::after {
        top: 50%;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: bisque;
        transform: translate(-50%, -50%);
        box-shadow: 0 2px 5px -2px rgba(0, 0, 0, 0.5);
      }
    }

    &:first-child {
      .body::before {
        top: 50%;
        width: 5px;
        height: 50%;
        background: #eeeeee;
        transform: translateX(-50%);
      }
    }

    &:last-child {
      .body::before {
        bottom: 50%;
        width: 5px;
        height: 50%;
        background: #eeeeee;
        transform: translateX(-50%);
      }
    }
  }
}

.grid-wrapper {
  position: relative;
  width: 100%;

  .grid {
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-content: center;
    width: 100%;
    min-height: 80px;
    background: #ffffff;
    border-radius: 15px;
    // box-shadow: 0 2px 10px -6px rgba(0, 0, 0, 0.3);
    text-align: center;
  }
}

.step-form-wrapper {
  position: relative;
  height: 100%;

  .step-form-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    z-index: 2;
  }

  .step-page {
    position: absolute;
    top: 0;
    left: 0;
    padding-top: 80px;
    width: 100%;
    height: 100%;
    overflow: auto;
    z-index: 1;
    
    &.pb-fix {
      padding-bottom: 60px;
    }

    > .container {
      padding-left: 0px !important;
      padding-right: 0px !important;
    }
  }

  .step-btns {
    position: absolute;
    top: 0;
    right: 0;
    width: 88px;
    background: #eeeeee;
    border-radius: 18px;
    z-index: 3;

    button {
      box-shadow: 0 2px 10px -3px rgba(0, 0, 0, 0.9) !important;
    }
  }

  .step-cus-btns {
    position: fixed;
    padding: 0;
    left: 0;
    width: 100%;
    bottom: 24px;
    z-index: 3;
  }
}

.input-group__prepend-icon {
  color: $primaryColor !important;
}

// transition css
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease-in-out;
}

.slide-enter {
  transform: translateX(50%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-50%);
  opacity: 0;
}

</style>
