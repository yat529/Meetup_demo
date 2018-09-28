<template>
  <div class="schedule-pg cus-full-page">
    <Header :date="date" 
      :title="planItem.content"
      v-on:close="close"></Header>

    <div class="scheduel-pg-body cus-p-20">
      <ScheduleList :list="scheduleList"
        :planItem="planItem"
        :group="group"
        v-on:editTodo="editTodo"></ScheduleList>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Header from './header'
import ScheduleList from '../Components/ScheduleList'

export default {
  components: {
    Header,
    ScheduleList
  },

  props: {
    group: {
      type: Object
    },

    planItem: {
      type: Object
    },

    scheduleList: {
      type: Array
    }
  },

  data () {
    return {
      // 
    }
  },

  computed: {
    date () {
      let date = this.planItem.date
      return {
        month: parseInt(date.split("-")[1]),
        day: parseInt(date.split("-")[2])
      }
    },

  },

  methods: {
    close () {
      this.$emit('close')
    },

    editTodo (todoMeta) {
      console.log(todoMeta)
      this.$emit('editTodo', todoMeta)
    }
  },

  beforeDestroy () {
    this.$store.commit('resetLoadedGroupTodoList')
    this.$store.commit('resetLoadedUserTodoList')
  }
}
</script>

<style lang="scss">
.cus-full-page {
  position: fixed;
  top: 50px;
  bottom: 0px;
  left: 0px;
  width: 100%;
  background: #ffffff;
  overflow: scroll;
  z-index: 99;
}

.cus-px-30 {
  padding-left: 30px;
  padding-right: 30px;
}

.cus-py-30 {
  padding-top: 30px;
  padding-bottom: 30px;
}

.cus-pr-15 {
  padding-right: 15px;
}

.cus-p-15 {
  padding: 15px;
}

.cus-p-20 {
  padding: 20px;
}

.cus-mb-0 {
  margin-bottom: 0;
}

.cus-mt-15 {
  margin-top: 15px !important;
}
.cus-mb-15 {
  margin-bottom: 15px !important;
}

.schedule-pg {
  background: #F6F8FA !important;
}

.scheduel-pg-body {
  position: absolute;
  top: 90px;
  left: 0;
  width: 100%;
}
</style>
