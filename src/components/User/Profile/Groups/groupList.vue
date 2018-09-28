<template>
  <div class="group-list-wrapper" v-if="groups.length">
    <!-- search bar -->
    <div class="search-bar">
      <v-icon class="search-icon primary--text">fas fa-search</v-icon>
      <input type="text" class="search-input" placeholder="查找你的米团">
      <v-icon class="search-filter primary--text">fas fa-filter</v-icon>
    </div>

    <div class="group-wrapper" :style="GroupCoverBg(group) ? GroupCoverBg(group) : DefaultGroupCoverBg" v-for="(group, index) in groups" :key="index">
      <!-- mask -->
      <div class="mask"></div>

      <!-- left portion -->
      <div class="left">
        <div class="list-title">{{ group.title }}</div>

        <div class="list-meta-bar">
          <!-- group size -->
          <div class="meta-item">
            <img class="icon" :src="SeatIcon">
            <span>{{ group.group_size }}</span>
          </div>
          <!-- member count -->
          <div class="meta-item">
            <img class="icon" :src="UsersIcon">
            <span>{{ countMember(group) }}</span>
          </div>
          <!-- right portion -->
          <div class="meta-item">
            <img class="icon" :src="MarkerIcon">
            <span>{{ group.location.name }}</span>
          </div>
        </div>

      </div>

      <!-- right portion -->
      <div class="right">
        <Calender class="calender"
          :date="formatDate(group)"></Calender>

        <div class="cus-btn" @click="load(group)">
          <v-icon>fas fa-ellipsis-h</v-icon>
        </div>
      </div>
      
    </div>
  </div>

  <NoResultPage v-else
    :noResultText="noResultText"
    :buttonText="buttonText"
    v-on:btnClick="btnClick"></NoResultPage>

</template>

<script>
/* eslint-disable */

// import icons
import MarkerIcon from './icons/Marker.svg'
import SeatIcon from './icons/Seat.svg'
import UsersIcon from './icons/Users.svg'

// import image - to be replace by a default cover url *******
import DefaultGroupCover from './images/Default_cover.jpg'

// import component
import Calender from '@/components/common/calenderIcon'
import NoResultPage from '@/components/common/noResultPage'

export default {
  props: {
    // 传入米团列表
    groups: {
      type: Array,
      default () {
        return [
          {
            title: '这是一个标题',
            group_size: 4,
            members: {
              1: true,
              2: true,
              3: true
            },
            location: {
              address: 'New York, NY, USA'
            },
            date: '2018-05-13',
          }
        ]
      }
    },
    // 没有结果显示文字
    noResultText: {
      type: String,
      default: '你还没有加入任何米团活动'
    },
    // 按钮文字
    buttonText: {
      type: String,
      default: '寻找米团'
    }
  },

  components: {
    Calender,
    NoResultPage
  },

  data () {
    return {
      // icon url
      MarkerIcon: MarkerIcon,
      SeatIcon: SeatIcon,
      UsersIcon: UsersIcon,
    }
  },

  computed: {
    DefaultGroupCoverBg () {
      return `background-image: url("${ DefaultGroupCover }")`
    },
  },

  methods: {
    countMember (group) {
      if (group.members) {
        return Object.keys(group.members).length
      }
      return 0
    },

    formatDate (group) {
      let reg = /\d{4}-(\d{2})-(\d{2})/,
          date = {},
          month, day, match

      if (group.date) {
        match = reg.exec(group.date)
        month = match[1] || 4
        day = match[2] || 13

        return {
          month: month,
          day: day
        }

      }

      return {
        month: 4,
        day: 13
      }
    },

    GroupCoverBg (group) {
      if (group.image_url) {
        return `background-image: url("${ group.image_url }")`
      }
      return false
    },

    load (group) {
      let key = group.key || 'asd'
      this.$emit('load', key)
    },

    btnClick () {
      this.$emit('btnClick')
    }
  }
}
</script>

<style lang="scss">
#profile_groups .group-list-wrapper {
  position: relative;
  z-index: 1;
}

#profile_groups .group-wrapper {
  position: relative;
  margin-bottom: 15px;
  width: 100%;
  height: 120px;
  padding-right: 65px;
  border-radius: 5px;
  background-color: wheat;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &:last-child {
    margin-bottom: 0px;
  }

  // box-shadow
  &::after {
    content: "";
    position: absolute;
    bottom: 0px;
    left: 50%;
    width: 95%;
    height: 110px;
    transform: translateX(-50%);
    background: #ffffff;
    box-shadow: 0 2px 30px -5px rgba(0, 0, 0, 0.5);
    z-index: -1;
  }

  // bg mask
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #2A2A2A;
    opacity: 0.3;
    border-radius: 5px;
  }

  .left, .right {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }

  .left {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 5px 0 0 5px;
    overflow: hidden;

    // right border
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 1px;
      height: 100%;
      background: #ffffff;
      opacity: 0.5;
    }

    .list-title {
      width: 100%;
      padding: 0 15px;
      margin-bottom: 5px;
      font-size: 18px;
      font-weight: 500;
      color: #ffffff;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .list-meta-bar {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      width: 100%;
      padding: 0 15px;

      .meta-item {
        margin-right: 15px;

        span {
          display: inline-block;
          font-size: 13px;
          font-weight: 500;
          line-height: 16px;
          vertical-align: bottom;
          color: #ffffff;
        }

        .icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 5px;
        }
      }
    }
  }

  .right {
    position: absolute;
    top: 0;
    right: 0;
    // flex: 0 0 65px;
    width: 65px;
    height: 100%;
    border-radius: 0 5px 5px 0;
    z-index: 1;

    .calender {
      width: 40px;
      margin-bottom: 15px;

      // overwrite component style
      .clamp {
        height: 6px;
        min-width: auto;
        min-height: auto;

        .bar {
          height: 100%;
          min-height: auto;
        }
      }

      .month, .day {
        height: 20px;
        min-width: auto;
        min-height: auto;
        font-size: 13px;
        font-weight: 400;
      }

      .day {
        background: #ffffff;
      }
    }

    .cus-btn {
      position: relative;
      width: 30px;
      height: 30px;
      border-radius: 100%;
      background: #ffffff;

      .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
      }
    }
  }
}

// #profile_groups .no-result {
//   display: flex;
//   flex-flow: column nowrap;
//   position: absolute;
//   top: 0;
//   left: 0;
//   padding-top: 60px;
//   width: 100%;
//   z-index: 1;
  
//   img.art {
//     display: block;
//     width: 80%;
//     max-width: 300px;
//     height: auto;
//     margin: 0 auto 30px auto;
//   }

//   .text {
//     font-size: 16px;
//     font-weight: 500;
//     text-align: center;
//     margin-bottom: 60px;
//   }
  
// }

#profile_groups .search-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  width: 100%;
  height: 40px;
  margin-bottom: 25px;
  border-bottom: 0px;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 1px;
    background: #ffffff;
  }

  .search-input {
    flex: 1 0 auto;
    display: block;
    padding: 7px 15px 7px 54px;
    height: 35px;
    outline: none;
    border-radius: 100px;
    background: #ffffff;
  }

  .search-icon {
    position: absolute;
    top: 50%;
    left: 17px;
    transform: translateY(-50%);
    font-size: 16px;
  }

  .search-filter {
    flex: 0 0 auto;
    font-size: 20px;
    margin-left: 15px;
  }
}
</style>


