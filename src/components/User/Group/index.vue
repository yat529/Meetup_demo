<template>
  <div>
    <AppViewHeader 
      v-show="!showEditTodoPage"
      :headerInfo="headerInfo"
      v-on:changeTab="getCurrentTab"></AppViewHeader>

    <div class="cus-app-view-body" v-if="group">
      <transition name="slide" mode="out-in">
        <Infomation class="section-wrapper cus-p-20" v-if="tabIndex === 0"
          :group="group"
          :planList="planList"
          v-on:showDetailSchedulePage="openDetailSchedulePage"></Infomation>
        <ToDo class="section-wrapper cus-p-20" v-else-if="tabIndex === 1"
          :group="group"
          :planList="planList"
          :scheduleList="scheduleList"
          v-on:showDetailSchedulePage="openDetailSchedulePage"
          v-on:edit="showEditTodoPage = true"
          v-on:editTodo="editTodo"
          v-on:editSchedule="editSchedule"
          v-on:addSchedule="addSchedule"></ToDo>
      </transition>
    </div>

    <transition name="slide">
    <EditTodoPage v-if="showEditTodoPage"
      :group="group"
      :planItem="loadedPlanItem"
      :scheduleItem="loadedScheduleItem"
      v-on:close="showEditTodoPage = false"></EditTodoPage>
    <EditSchedulePage v-if="showEditSchedulePage"
      :group="group"
      :planItem="loadedPlanItem"
      :scheduleItem="loadedScheduleItem"
      v-on:close="showEditSchedulePage = false"></EditSchedulePage>
    <DetailSchedulePage v-if="showDetailSchedulePage"
      :group="group"
      :planItem="loadedPlanItem"
      :scheduleList="loadedScheduleList"
      v-on:close="closeDetailSchedulePage"></DetailSchedulePage>
    </transition>
  </div>

</template>

<script>
/* eslint-disable */
import AppViewHeader from '@/components/common/header_tab'
import Infomation from './info'
import ToDo from './Todo'
import EditTodoPage from './EditTodo'
import EditSchedulePage from './EditSchedule'
import DetailSchedulePage from './Detail_Schedule'

export default {
  components: {
    AppViewHeader,
    Infomation,
    ToDo,
    EditTodoPage,
    EditSchedulePage,
    DetailSchedulePage
  },

  data () {
    return {
      headerInfo: {
        title: '你的小组',
        subtitle: '查看你的米团动态和消息',
        tabs: [
          {
            label: '简介',
            active: true
          }, 
          {
            label: '计划',
            active: false
          }, 
          {
            label: '成员',
            active: false
          }, 
        ]
      },
      tabIndex: 0,
      defaultLoadingFinished: false,
      showEditTodoPage: false,
      showEditSchedulePage: false,
      showDetailSchedulePage: false,
      // loadedPlanItem: null, // remove later
      // loadedScheduleItem: null, // remove later
      // loadedScheduleList: null, // remove later
      // loadedTodoMeta: null // remove later
    }
  },

  computed: {
    group () {
      return this.$store.state.groupModule.loadedGroup
    },

    planList () {
      return this.$store.state.groupModule.loadedPlanList
    },

    scheduleList () {
      return this.$store.state.groupModule.loadedScheduleList
    },

    loadedPlanItem () {
      return this.$store.state.groupModule.loadedPlanItem
    },

    loadedScheduleItem () {
      return this.$store.state.groupModule.loadedScheduleItem
    },

    loadingFinished () {
      return this.group && this.planList && this.defaultLoadingFinished
    }
  },

  watch: {
    // remove the loading screen if group object in the store is ready
    loadingFinished (newVal, oldVal) {
      if (newVal) {
        this.$store.commit('setLoading', false)
      }
    },

    // Check plan list length, load the plan item if the only plan in the list
    // then start watch the schedule list
    planList (newVal, oldVal) {
      if (newVal && newVal.length === 1) {
        this.$store.commit('setLoadedPlanItem', newVal[0])

        this.$store.dispatch('watchScheduleList', {
          group_key: this.group.key,
          trip_plan_key: newVal[0].key
        })
      }
    },
  },

  methods: {
    getCurrentTab (tab) {
      this.tabIndex = tab - 1
    },

    openDetailSchedulePage () {
      this.showDetailSchedulePage = true
    },

    closeDetailSchedulePage () {
      this.showDetailSchedulePage = false
    },

    editTodo () {
      this.showEditTodoPage = true
    },

    editSchedule () {
      this.showEditSchedulePage = true
    },

    addSchedule () {
      this.showEditSchedulePage = true
    }

  },

  created () {
    let group_key = this.$route.params.id

    // set loading screen
    this.$store.commit('setLoading', true)
    // load the group object, save to store
    this.$store.dispatch('watchGroup', group_key)
    // load the trip plan list, save to store
    this.$store.dispatch('watchPlanList', group_key)
    // set 2 second default loading time
    setTimeout(() => {
      this.defaultLoadingFinished = true
    }, 2000)
  },  
}
</script>

<style lang="scss">
.temp {
  position: relative;
  width: 100%;
  padding: 20px;
  z-index: 1;
}

.cus-card {
  position: relative;
  background: #ffffff;
  border-radius: 5px;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 10px;
    width: 95%;
    height: 20px;
    background: #ffffff;
    box-shadow: 0 2px 30px -3px rgba(0, 0, 0, 0.5);
    transform: translateX(-50%);
    z-index: -1;
  }

  .cus-card-section {
    position: relative;
    padding: 25px 20px 50px 20px;
    border-bottom: 1px solid #F6F8FA;

    .cus-title {
      display: inline-block;
      position: absolute;
      padding: 5px 0 5px 20px;
      top: 0;
      left: 0;
      transform: translateY(-50%);
      background: #ffffff;

      &::after {
        content: "";
        position: absolute;
        top: 50%;
        right: -10px;
        width: 5px;
        height: 15px;
        background: #6480e6;
        transform: translateY(-50%);
      }
    }
  }
}


// avatar with name below
.cus-avatar-with-name {
  display: inline-block;
  position: relative;
  z-index: 1;

  .cus-avatar-sm {
    display: block;
    position: relative;
    margin-bottom: 5px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 3px solid #F6F8FA;
    background-color: bisque;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;

    &::after {
      content: "";
      position: absolute;
      bottom: 5px;
      left: 50%;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      transform: translateX(-50%);
      background: #ffffff;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      z-index: -1;
    }
  }

  .check-icon-bg {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    width: 18px;
    height: 18px;
    background: #ffffff;
    border-radius: 50%;
    z-index: 2;

    >.icon {
      font-size: 15px;
    }
  }

  .cus-avatar-name {
    display: block;
    text-align: center;
  }
}


// flex layout
.cus-flex-row {
  display: flex;
  flex-flow: row nowrap;
}

.cus-flex-item {
  flex: 1 0;
}

.cus-flex-spacer {
  flex: 1 0 auto;
}

// font-size
.cus-text-title {
  font-size: 14px;
  font-weight: 400;
}

.cus-text-p {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px !important;
  margin-bottom: 0px !important;
}

.cus-text-link {
  font-weight: 500;
  color: #6480e6;
  text-decoration: none;
}

.cus-text-bold {
  font-weight: 500;
}

// spacing
.cus-mb-0 {
  margin-bottom: 0px !important;
}
.cus-mb-5 {
  margin-bottom: 5px !important;
}
.cus-mb-15 {
  margin-bottom: 15px !important;
}
.cus-mb-25 {
  margin-bottom: 25px !important;
}

.cus-mt-15 {
  margin-top: 15px !important;
}
.cus-mt-25 {
  margin-top: 25px !important;
}

.cus-mr-10 {
  margin-right: 10px !important;
}
.cus-mr-15 {
  margin-right: 15px !important;
}

.cus-pt-15 {
  padding-top: 15px !important;
}
.cus-pt-20 {
  padding-top: 20px !important;
}
.cus-pt-25 {
  padding-top: 25px !important;
}

.cus-pb-20 {
  padding-bottom: 20px !important;
}
.cus-pb-25 {
  padding-bottom: 25px !important;
}
.cus-pr-15 {
  padding-right: 15px;
}

.cus-px-20 {
  padding-left: 20px !important;
  padding-right: 20px !important;
}

// box shadow
.no-boxshadow {
  box-shadow: none !important;

  &::after {
    box-shadow: none !important;
  }
}
</style>


