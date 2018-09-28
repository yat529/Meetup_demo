<template>
  <v-form class="section-wrapper" ref="groupScheduleForm" lazy-validation @submit.prevent="validateInput">
    <div class="input-wrapper pos-fix">
      <!-- date -->
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
          color="primary"
          prepend-icon="fas fa-calendar-alt"
          hint="点击并从选择活动时间"
          :rules="[() => !!date || '请选择活动日期']"
          persistent-hint
          required
          readonly></v-text-field>

        <v-date-picker v-model="date" scrollable color="primary">
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="dateModal = false">取消</v-btn>
          <v-btn flat color="primary" @click="$refs.datePicker.save(date)">确定</v-btn>
        </v-date-picker>
      </v-dialog>

      <!-- time -->
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
          prepend-icon="fas fa-clock"
          hint="点击并从选择活动时间"
          persistent-hint
          :rules="[() => !!time || '请选择活动时间']"
          required
          readonly
        ></v-text-field>
        <v-time-picker v-model="time" actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="timeModal = false">取消</v-btn>
          <v-btn flat color="primary" @click="$refs.timePicker.save(time)">确定</v-btn>
        </v-time-picker>
      </v-dialog>


    </div>

    <div class="cus-btn-container cus-pos">
      <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" type="submit">
        下一步
      </v-btn>
    </div>
  </v-form>
</template>

<script>
/* eslint-disable */
export default {
  data () {
    return {
      dateModal: false,
      timeModal: false,
      date: null,
      time: null,
    }
  },

  methods: {
    validateInput () {
      let form = this.$refs.groupScheduleForm

      if ( form.validate() ) {
        this.$emit('submitDateTime', {
          date: this.date,
          time: this.time
        })
      }
    }
  }
}
</script>

<style lang="scss">
.pos-fix {
    margin-top: 15px;
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>


