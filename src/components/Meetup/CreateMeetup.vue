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
              <fileloader class="mb-3"></fileloader>

              <!-- group size/seats -->
              <v-layout row>
                <!-- <v-flex xs6>
                  <div class="title">Group Size</div>
                </v-flex> -->
                <v-flex xs12>
                  <v-select
                    :items="sizes"
                    v-model="groupSize"
                    v-if="!customSize"
                    label="Group Size"
                    required
                  ></v-select>
                  <v-text-field
                    label="Group Size"
                    v-model="size"
                    v-if="customSize"
                    mask="###"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>
              

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
      timeModal: false,
      groupSize: null,
      size: null,
      sizes: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,'Other']
    }
  },
  methods: {
    createMeetup () {
      const meetup = {
        title: this.title,
        location: this.location,
        size: this.customSize ? (typeof this.size === 'number' ? this.size : parseInt(this.size)) : this.groupSize,
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
      (this.customSize ? this.size : this.groupSize) &&
      this.description.length &&
      this.date && this.time
    },
    formattedDate () {
      return `${this.date} ${this.time}`
    },
    location () {
      return this.$store.state.gmLocation
    },
    customSize () {
      return this.groupSize === 'Other'
    }
  },
  created () {
    this.$store.commit('clearLoadedMeetUp')
  }
}
</script>
<style lang="scss">
</style>
