<template>
  <v-layout row justify-center style="position: absolute" v-if="meetupKey">
    <v-dialog v-model="dialog" persistent max-width="490">
      <v-card>
        <v-card-title class="headline">更改活动日期与时间</v-card-title>

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
        <!-- action buttons -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="update">更新</v-btn>
          <v-btn color="green darken-1" flat @click.native="cancel">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  
</template>

<script>
/* eslint-disable */
export default {
  props: {
    meetupKey: {
      type: String
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    initialDate: {
      type: String
    },
    initialTime: {
      type: String
    },
  },
  data () {
    return {
      dialog: this.showDialog,
      date: this.initialDate,
      dateModal: false,
      time: this.initialTime,
      timeModal: false,
    }
  },
  methods: {
    update () {
      // update actions
      this.$store.dispatch('updateMeetupDateTime', {
        meetup_key: this.meetupKey,
        date: this.date,
        time: this.time
      })
      .then(() => {
        this.$emit('update')
        this.dialog = false
        console.log('update date and time successful')
      })
    },
    cancel () {
      this.$emit('cancel')
      this.dialog = false
    }
  }
}
</script>

<style lang="scss">

</style>

