<template>
  <v-container px-5 py-0>
    <v-layout row px-5>
      <v-flex xs12>
        <v-card flat color="transparent" class="px-4 py-4" v-if="user">
          <!-- card body - form -->
          <form @submit.prevent="createMeetup">
            <v-card-text class="px-4 py-4">
              <h1 class="primary--text mb-4">发起新的米团</h1>
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
                <v-btn small round flat class="primary--text edit-friends-list" v-show="selectedFirends.length && !selectFriendsMode"
                @click="selectFriendsMode = true">
                  <v-icon left small>fas fa-sliders-h</v-icon>
                  编辑列表
                </v-btn>
                <v-layout class="person-card-wrapper" row wrap v-if="selectFriendsMode">        
                  <UserList :users="friends" :showInviteFriend="true"
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
                    <UserCards :users="selectedFirends"></UserCards>
                  </v-layout>
                </v-layout>
              </v-container>

              <!-- title input -->
              <v-container class="text-wrapper">
                <h3 class="text-title">标题</h3>
                <v-text-field
                  label="必填"
                  v-model="title"
                  :rules="[(v) => v.length <= 80 || '不超过80个字']"
                  :counter="80"
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

              <!-- list -->
              <v-container class="text-wrapper">
                <h3 class="text-title mb-2">活动计划</h3>
                <p class="subheadingfont primary--text mb-4">将以列表的形式显示, 适用于行程规划, 时间线等元素</p>
                
                <v-container row class="list-preview-wrapper mb-4" v-show="list.length">
                  <p class="subheadingfont primary--text">列表预览</p>
                  <v-layout row class="mb-4">
                    <div class="list-wrapper" v-if="list.length">
                      <div class="list" v-for="(item, index) in list" :key="index">
                        <div class="decor"></div>
                        <div class="body">
                          <div class="title">{{ item.title }}</div>
                          <div class="content">{{ item.content }}</div>
                        </div>
                      </div>
                    </div>
                  </v-layout>
                </v-container>

                <v-layout row>
                  <v-text-field
                    label="标题"
                    v-model="listTitle"
                    required
                  ></v-text-field>
                </v-layout>
                <v-layout row>
                  <v-text-field
                    label="内容"
                    v-model="listContent"
                    multi-line
                  ></v-text-field>
                </v-layout>

                <v-layout row justify-center>
                  <v-btn round dark color="primary" @click="addToList">
                    <v-icon small left>far fa-check-circle</v-icon>
                    加入列表
                  </v-btn>
                </v-layout>
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
              <v-btn large flat :disabled="!validForm" class="primary" type="submit">创建米团</v-btn>
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
      selectFriendsMode: false,
      selectedFirends: [],
      list: [],
      listTitle: '',
      listContent: '',
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
      this.list.push(item)

      this.listTitle = ''
      this.listContent = ''
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
    }
  },
  created () {
    // this.$store.commit('clearLoadedMeetUp')
  }
}
</script>
<style lang="scss">
.text-wrapper {
  position: relative;
  margin-bottom: 25px;
  padding: 25px 35px;
  background: #ffffff;
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
  background: #ffffff;
  box-shadow: 0 2px 13px -7px rgba(0, 0, 0, 0.4);

  .preview-image-section {
	  min-height: 120px;
    padding: 25px 35px;
    background: #ffffff;
  }
}

.custom-border {
  .input-group__input {
    border: 1px solid #eeeeee !important;
    background: #fff !important;
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
    // box-shadow: 0 2px 10px -7px rgba(0, 0, 0, 0.4);
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
  padding: 5px;
  max-height: 350px;
  overflow: auto;

  .placeholder {
    width: 100%;
    height: 150px;
    border-radius: 15px;
    background: #eeeeee;
  }
}

.edit-friends-list {
  position: absolute;
  top: 20px;
  right: 35px;
}

.list-preview-wrapper {
  padding: 15px;
  border: 2px solid #eeeeee;
}

.list-wrapper {
  width: 100%;
  padding: 0;

  .list {
    width: 100%;
    // height: 100%;
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

      .title {
        font-size: 15px !important;
        font-weight: 400;
        margin-bottom: 10px;
      }
      .content {
        font-size: 14px;
        font-weight: 300;
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


</style>
