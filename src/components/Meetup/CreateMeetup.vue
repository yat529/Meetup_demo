<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <v-card>
          <!-- header toolbar -->
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Create a new Meetup</v-toolbar-title>
          </v-toolbar>
          <!-- card body - form -->
          <form @submit.prevent="createMeetup">
            <v-card-text class="px-4 py-4">
              <span class="title">Meetup Info</span>
              <!-- title input -->
              <v-text-field
                label="Title"
                class="mt-5"
                v-model="title"
                required
              ></v-text-field>

              <!-- location input -->
              <setLocationMap class="mb-5"></setLocationMap>
              
              <!-- image insertion -->
              <fileloader></fileloader>

              <!-- description textarea -->
              <v-text-field
                label="Description"
                v-model="description"
                multi-line
              ></v-text-field>

              <!-- date&time picker input -->
              <v-layout row>
                <!-- date picker -->
                <v-flex xs-6>
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
                      label="Pick a date"
                      v-model="date"
                      prepend-icon="event"
                      readonly
                    ></v-text-field>
                    <v-date-picker v-model="date" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="dateModal = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.datePicker.save(date)">OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-flex> 

                <!-- time picker -->
                <v-flex xs-6>
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
                      label="Pick a time"
                      v-model="time"
                      prepend-icon="access_time"
                      readonly
                    ></v-text-field>
                    <v-time-picker v-model="time" actions>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="timeModal = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.timePicker.save(time)">OK</v-btn>
                    </v-time-picker>
                  </v-dialog>
                </v-flex>
              </v-layout>
            </v-card-text>
            <!-- button -->
            <v-flex class="px-4 py-4">
              <v-btn large flat :disabled="!validForm" class="info" type="submit">CREATE MEETUP</v-btn>
            </v-flex>
          </form>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>
<script>
/* eslint-disable */
import fileloader from '@/components/common/fileloader'
import setLocationMap from '@/components/common/setLocation'

export default {
  components: {
    fileloader,
    setLocationMap
  },
  data () {
    return {
      title: '',
      description: '',
      date: null,
      dateModal: false,
      time: null,
      timeModal: false
    }
  },
  methods: {
    createMeetup () {
      const meetup = {
        title: this.title,
        location: this.location,
        description: this.description,
        date: this.formattedDate
      }

      if (this.validForm) {
        this.$store.dispatch('createMeetup', meetup)
          .then(() => {
            this.$router.push('/meetups')
          })
      }
    }
  },
  computed: {
    validForm () {
      return this.title.length && 
      this.$store.state.gmLocation.address.length &&
      this.description.length
    },
    formattedDate () {
      return `${this.date} ${this.time}`
    },
    location () {
      return this.$store.state.gmLocation
    }
  },
  created () {
    this.$store.commit('clearLoadedMeetUp')
  }
}
</script>
<style lang="scss">
</style>
