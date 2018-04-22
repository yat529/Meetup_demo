<template>
  <v-container fluid px-0 py-0 class="meetup-page-wrapper" v-if="item.uid">
    <div class="float-pan" v-show="showFloatPan">
      <div class="minimize" @click="showFloatPan = false">
        <i class="fas fa-minus-circle"></i>
      </div>
      <div class="date-info" :class="EditMode ? 'highlight-border' : ''">
        <!-- edit  -->
        <v-btn icon small fab absolute right top dark color="blue" v-if="EditMode" @click="onEditDateInfo">
          <v-icon small>fas fa-pencil-alt</v-icon>
        </v-btn>
        <DateTimeModal v-if="showDateInfoModal&&EditMode"
        :meetupKey="item.key"
        :showDialog="showDateInfoModal"
        :initialDate="item.date"
        :initialTime="item.time"
        v-on:update="showDateInfoModal = false"
        v-on:cancel="showDateInfoModal = false">
        </DateTimeModal>
        <div class="box">
          <calendarIcon :date="dateObj"></calendarIcon>
        </div>
        <!-- display -->
        <div class="box-grow">
          <div class="time">
            {{ item.time }}开始
          </div>
          <div class="vacancy" v-if="vancancyCount > 0">
            还剩{{ vancancyCount }}个位置
          </div>
          <div class="vacancy" v-else>
            小组已满员
          </div>
        </div>
  
      </div>
      <div class="address-wrapper" :class="EditMode ? 'highlight-border' : ''">
        <v-btn icon small fab absolute right top dark color="blue" v-if="EditMode" @click="onEditAddress">
          <v-icon small>fas fa-pencil-alt</v-icon>
        </v-btn>
        <AddressModal v-if="showAddressModal&&EditMode"
        :meetupKey="item.key"
        :showDialog="showAddressModal"
        :initalLocation="item.location"
        v-on:update="showAddressModal = false"
        v-on:cancel="showAddressModal = false">
        </AddressModal>
        <div class="address-label">
          地址
        </div>
        <div class="address" v-html="formatedAddress(item)" v-if="item.location.address"></div>
      </div>
      <div class="map">
        <loadLocationMap :item="item" v-if="item.location.LatLng"></loadLocationMap>
      </div>
      <div class="button-group">
        <!-- <CardButton :item="item" :inMeetup="true"
          v-on:register="registerMeetup(item)" 
          v-on:more="unregisterMeetup(item)" 
          v-on:enterEdit="editMeetup"
          v-on:exitEdit="stopEditMeetup"
          v-on:goback="closeMeetup()"></CardButton> -->

        <MeetupButton :showEditMeetup="isOrganizer" :showRegisterMeetup="!isOrganizer"
        :registered="isRegistered" :pending="isPending"
        v-on:register="registerMeetup"
        v-on:close="closeMeetup"
        v-on:enterEditMode="editMeetup"
        v-on:exitEditMode="stopEditMeetup"
        ></MeetupButton>

      </div>
    </div>
    <v-layout row class="header" v-if="item.uid">
      <v-container px-4>
        <v-layout row wrap justify-center align-center>
          <v-flex xs12 md7>
            <h1 :class="EditMode ? 'highlight-border' : ''">
              {{ item.title }}
              <v-btn icon small fab absolute right top dark color="blue" v-if="EditMode" @click="onEditTitle">
                <v-icon small>fas fa-pencil-alt</v-icon>
              </v-btn>
              <TitleContentModal v-if="showTitleModal&&EditMode"
              :meetupKey="item.key"
              :showDialog="showTitleModal"
              :initialTitle="item.title"
              v-on:update="showTitleModal = false"
              v-on:cancel="showTitleModal = false"></TitleContentModal>
            </h1>
            <v-container class="user-info px-0 py-0">
              <v-layout>
                <div class="organizer">
                  <!-- <div class="avatar" :style="avatarBgUrl"></div> -->
                  <Avatar class="organizer-avatar" :user="item.organizer" :showName="false"
                  :showRedirectAndAddFriend="true"></Avatar>
                  <div class="organizer-name">{{ item.organizer.nickname }}</div>
                </div>
              </v-layout>
            </v-container>
          </v-flex>
          <v-flex xs12 md5 pl-5 py-5>
            <v-layout align-center justify-end v-show="!showFloatPan">
              <div class="box" style="margin-right: 50px">
                <calendarIcon :date="dateObj"></calendarIcon>
              </div>
              <v-btn round color="primary" @click="showFloatPan = true">
                <v-icon left small>fas fa-plus-circle</v-icon>
                更多信息
              </v-btn>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 class="meetup">
        <v-card flat>
          <!-- image -->
          <v-card-media :src="getImgUrl(item)" height="500px" class="mb-3">
          </v-card-media>
          <!-- card body -->
          <v-container>
            <!-- members -->
            <v-layout class="seats px-2 py-2 mb-5" row wrap align-center>
              <v-flex xs12 sm2 class="text-xs-center my-4">
                <h3 class="primary--text mb-1">小组成员</h3>
              </v-flex>
              <v-flex xs12 sm9 offset-sm1 :class="EditMode ? 'highlight-border' : ''">
                <Seats :group="groupMembers" :size="item.size" :meetupKey="item.key"
                :showRedirectAndAddFriend="!EditMode"
                :showRemoveMember="EditMode"></Seats>
              </v-flex>
            </v-layout>
            <!-- description -->
            <v-layout class="orgnizer px-2 py-2 mb-5" row wrap align-center>
              <v-flex xs12 sm2 class="text-xs-center my-4">
                <h3 class="primary--text mb-1">活动介绍</h3>
              </v-flex>
              <v-flex xs12 sm9 offset-sm1 class="content" :class="EditMode ? 'highlight-border' : ''">
                {{ item.description }}
                <v-btn icon small fab absolute right top dark color="blue" v-if="EditMode" @click="onEditContent">
                  <v-icon small>fas fa-pencil-alt</v-icon>
                </v-btn>
                <TitleContentModal v-if="showContentModal&&EditMode"
                :meetupKey="item.key"
                :showDialog="showContentModal"
                :initialContent="item.description"
                v-on:update="showContentModal = false"
                v-on:cancel="showContentModal = false"></TitleContentModal>
              </v-flex>
            </v-layout>

            <!-- schedules -->
            <v-layout class="orgnizer px-2 py-2 mb-5" row wrap align-center>
              <v-flex xs12 sm2 class="text-xs-center my-4">
                <h3 class="primary--text mb-1">活动计划</h3>
              </v-flex>
              <v-flex xs12 sm9 offset-sm1>
                <div class="list-wrapper">
                  <div class="list" v-for="(item, index) in list" :key="index">
                    <div class="decor"></div>
                    <div class="body">
                      <div class="title">{{ item.title }}</div>
                      <div class="content">{{ item.content }}</div>
                    </div>
                  </div>
                </div>
              </v-flex>
            </v-layout>

            <!-- details -->
            <v-layout class="orgnizer px-2 py-2 mb-5" row wrap align-center>
              <v-flex xs12 sm2 class="text-xs-center my-4">
                <h3 class="primary--text mb-1">其它信息</h3>
              </v-flex>
              <v-flex xs12 sm9 offset-sm1>
                <v-layout class="grid-wrapper" row wrap>
                  <v-flex class="px-2 py-2" xs6 sm3
                  v-for="(item, index) in card" :key="index">
                    <div class="grid">
                      <span>{{ item }}</span>
                    </div>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>

            <v-layout v-if="EditMode" justify-center align-center>
              <v-btn round dark color="red" @click="showDeleteMeetupModal = true">
                <v-icon left small>far fa-trash-alt</v-icon>
                删除活动
              </v-btn>
            </v-layout>
            <v-layout row justify-center>
              <v-dialog v-model="showDeleteMeetupModal" persistent max-width="290">
                <v-card>
                  <v-card-title class="headline">删除这个活动</v-card-title>
                  <v-card-text>此活动将从你的数据库中移除. 请确认删除.</v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat @click.native="deleteMeetup(item)">确认</v-btn>
                    <v-btn color="green darken-1" flat @click.native="showDeleteMeetupModal = false">取消</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-layout>
            

          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
/* eslint-disable */
// common components
import Avatar from '@/components/common/avatarWithModal'
import calendarIcon from '@/components/common/calenderIcon'
import Seats from '@/components/common/seats'
import MeetupButton from '@/components/common/meetupButton'
import loadLocationMap from '@/components/common/loadLocation'
// local components
import DateTimeModal from './EditingModal/datetimeModal'
import AddressModal from './EditingModal/addressModal'
import TitleContentModal from './EditingModal/titleContentModal'


export default {
  components: {
    Avatar,
    calendarIcon,
    Seats,
    MeetupButton,
    loadLocationMap,
    DateTimeModal,
    AddressModal,
    TitleContentModal
  },
  data() {
    return {
      organizer: {},
      showFloatPan: true,
      list: [
        {
          title: '第一天行程 - 跑路 + 滑雪',
          content: '早上6点半起床, 7点集合上车开拔, 预计10点到滑雪场, 之后各自活动, 晚上8点山下集合, 吃饭, 宾馆CHECK-IN'
        },
        {
          title: '第二天行程 - 滑雪',
          content: '早上8点半起床, 预计9点到滑雪场, 之后各自活动, 晚上8点山下集合, 吃饭'
        },
        {
          title: '第三天行程 - 滑雪 + 返家',
          content: '早上8点半起床, 预计9点到滑雪场, 之后各自活动, 下午6点山下集合, 返家, 晚饭路上随便解决'
        },
      ],
      card: ['眼镜', '滑雪服', '帽子', '鞋', '滑雪板'],
      // edit mode
      EditMode: false,
      showDateInfoModal: false,
      showAddressModal: false,
      showTitleModal: false,
      showContentModal: false,
      showDeleteMeetupModal: false
    }
  },
  methods: {
    registerMeetup () {
      let user = this.user,
          item = this.item

      if (user.uid && item.key) {
        this.$store.dispatch('sendJoinRequest', item)
        .then(() => {
          console.log('join request sent')
        })
      } else {
        this.$router.push('/signin')
      }
    },
    closeMeetup () {
      this.$router.go(-1)
    },
    editMeetup () {
      this.EditMode = true
    },
    deleteMeetup () {
      let key = this.item.location
      if (key) {
        this.$store.commit('setLoading', true)
        this.$store.dispatch('deleteMeetup', key)
        .then(() => {
          this.showDeleteMeetupModal = false
          this.$store.commit('setLoading', false)
          console.log('im after promise all')
          this.closeMeetup()
        })
      }
    },
    stopEditMeetup () {
      this.EditMode = false
    },
    getImgUrl () {
      let urls = this.item.imageURLs
      if (urls) {
        return urls[Object.keys(urls)[0]]
      }
    },
    formatedAddress () {
      let location = this.item.location
      if (location) {
        let address = location.address.split(','),
            html = ''

        address.forEach((line, index) => {
          if (index === 0) {
            html += `<div>${line}</div>`
          } else {
            html += `<span>${line}</span>`
          }
        })
        return html
      }
    },
    // edit methods
    onEditDateInfo () {
      this.showDateInfoModal = true
    },
    onEditAddress () {
      this.showAddressModal = true
    },
    onEditTitle () {
      this.showTitleModal = true
    },
    onEditContent () {
      this.showContentModal = true
    }
  },
  computed: {
    groupMembers () {
      if (this.item.organizer) {
        let organizer = this.item.organizer,
            members = this.item.registeredMembers,
            array = []

        organizer.uid = this.item.uid // important! no uid under organizer entry from db
        array[0] = organizer
        for (let key in members) {
          array.push(members[key])
        }
        return array
      }
    },
    avatarBgUrl () {
      if (!this.item.organizer) return
      let photoURL = this.item.organizer.photoURL
      return `background-image: url("${ photoURL }")`
    },
    vancancyCount () {
      if (this.item) {
        let occupied = this.item.registeredMembers ? Object.keys(this.item.registeredMembers).length : 0
        return this.item.size - occupied - 1
      }
    },
    dateObj () {
      if (this.item.date) {
        let regexp = /[\d]{4}-([\d]{1,2})-([\d]{1,2})/,
            match = regexp.exec(this.item.date)

        if (match) {
          return {
            month: match[1],
            day: match[2]
          }
        }
      }
    },
    item () {
      return this.$store.state.meetupModule.loadedMeetup
    },
    user () {
      return this.$store.state.userModule.user_ref
    },
    isOrganizer () {
      if (this.user && this.item) {
        return this.user.uid === this.item.uid
      }
    },
    isRegistered () {
      let uid = this.user.uid
      if (this.item.registeredMembers && uid) {
        return Object.keys(this.item.registeredMembers).find(key => {
          return key === uid
        }) ?
        true :
        false
      }
      return false
    },
    isPending () {
      if (this.user.pendingMeetups && this.item.key) {
        for (let key in this.user.pendingMeetups) {
          if (key === this.item.key) {
            return true
          }
        }
      }
      return false
    },
  },
  watch: {
    item (newVal, oldVal) {
      this.$store.dispatch('fetchUser', this.item.uid)
      .then(user_snap => {
        this.organizer = user_snap
      })
    }
  },
  created () {
    let key = this.$route.params.id  
    this.$store.dispatch('watchMeetup', key)
  },
}
</script>
<style lang="scss">

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

.grid-wrapper {
  position: relative;
  width: 100%;

  .grid {
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    align-content: center;
    width: 100%;
    min-width: 150px;
    height: 80px;
    margin-bottom: 15px;
    background: #fafafa;
    border-radius: 15px;
    box-shadow: 0 2px 10px -6px rgba(0, 0, 0, 0.3);
    text-align: center;
  }
}

.meetup-page-wrapper {
  position: relative;
}

.float-pan {
  position: fixed;
  top: 50%;
  right: 8%;
  width: 20%;
  min-width: 350px;
  max-width:380px;
  padding: 15px 15px 0 15px;
  background: #ffffff;
  box-shadow: 0 3px 15px -7px rgba(0, 0, 0, 0.5);
  transform: translateY(-50%);
  z-index: 10;

  .minimize {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;

    i {
      font-size: 16px;
      color: #eeeeee;
    }

    &:hover {
      i {
        color: darken(#eeeeee, 10%);
      }
    }
  }

  .address-wrapper {
    display: flex;
    flex-flow: row wrap;
    padding: 5px 10px 5px 10px;
    margin-top: 15px;
    margin-bottom: 15px;
    align-items: center;

    .address-label {
      flex: 0 0 auto;
      margin-right: 25px;
      font-size: 15px;
      font-weight: 400;
    }

    .address {
      flex: 0 0 auto;
      font-size: 13px;
      font-weight: 300;
    }
  }

  .map {
    position: relative;
    width: 100%;
    height: 300px;;
  }
}

.date-info {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  padding: 20px 10px 15px 10px;
  border-bottom: 1px solid #fafafa;

  .box {
    flex: 0 0 auto;
  }
  
  .box-grow {
    flex: 1 0 auto;
  }

  .time,
  .vacancy {
    width: 100%;
    text-align: center;
  }

  .time {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 5px;
  }
  .vacancy {
    font-size: 14px;
    font-weight: 400;
  }
}

.header {
  position: relative;
  width: 100%;
  height: 320px;
  background: rgba(255, 255, 255, 0.5);
  border-top: 1px solid #ffffff;

  h1 {
    margin-bottom: 20px;
  }

  .user-info {
    .organizer {
      position: relative;
      text-align: center;
      overflow: hidden;

      .organizer-avatar {
        float: left;
        position: relative;
        margin-right: 10px;
        margin: 0;
      }

      .organizer-name {
        float: left;
        position: relative;
        padding: 0 15px;
        margin: 0 15px 0 0;
        height: 30px;
        line-height: 30px;
        font-size: 15px;
        font-weight: bold;
        vertical-align: top;
        
        &::after {
          content: "发起人";
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: 30px;
          line-height: 30px;
          font-size: 13px;
          font-weight: normal;
        }
      }
    }
    .status {
      align-self: center;
    }
  }

  .address-info {
    position: relative;

    .address {
      padding: 5px 10px;
    }
  }
}

.highlight-border {
  position: relative;
  padding: 15px 20px;
  margin-top: 25px;
  // margin-bottom: 35px;
  border: 1px dashed #2196F3;
  border-radius: 5px;
}

</style>
