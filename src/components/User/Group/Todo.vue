<template>
  <div class="temp">
    <ScheduleList class="cus-pt-15" v-if="planList.length <= 1"
      :group="group"
      :scheduleList="scheduleList"
      :planItem="planList[0]"
      v-on:editTodo="editTodo"
      v-on:editSchedule="editSchedule"
      v-on:addSchedule="addSchedule"></ScheduleList>

    <PlanList class="cus-card cus-pt-20 cus-pb-20 cus-px-20" v-else
      :planList="planList" 
      v-on:showDetailSchedulePage="showDetailSchedulePage"></PlanList>
  </div>
</template>

<script>
/* eslint-disable */
import PlanList from './Components/PlanList'
import ScheduleList from './Components/ScheduleList'

export default {
  components: {
    ScheduleList,
    PlanList
  },

  props: {
    group: {
      type: Object,
      required: true
    },

    planList: {
      type: Array,
    },

    scheduleList: {
      type: Array,
    }
  },

  data () {
    return {
      // 
    }
  },

  computed: {
    uid () {
      return this.$store.state.userModule.user_ref.uid
    },
  },

  methods: {
    loadTodoList (item) {
      this.$store.dispatch('watchTodoList', {
        group_key: this.group.key,
        trip_plan_key: this.planItem.key,
        trip_schedule_key: item.key
      })
    },

    resetTodoList (item) {
      this.$store.dispatch('stopWatchTodoList', {
        group_key: this.group.key,
        trip_plan_key: this.planItem.key,
        trip_schedule_key: item.key
      })
    },

    openEditPage () {
      this.$emit('edit')
    },

    showDetailSchedulePage (tripPlanItem) {
      this.$emit('showDetailSchedulePage', tripPlanItem)
    },

    editTodo (todoMeta) {
      this.$emit('editTodo', todoMeta)
    },

    editSchedule () {
      this.$emit('editSchedule')
    },

    addSchedule () {
      this.$emit('addSchedule')
    }
  },

  beforeDestroy () {
    this.$store.commit('resetLoadedGroupTodoList')
    this.$store.commit('resetLoadedUserTodoList')
  }
}
</script>

<style lang="scss">

</style>

