<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm8 offset-sm2>
        <v-card flat>
          <!-- header toolbar -->
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Create a new Meetup</v-toolbar-title>
          </v-toolbar>
          <!-- card body - form -->
          <form @submit.prevent="createMeetup">
            <v-card-text class="px-4 py-4">
              <h2 class="primary--text">Meetup Info</h2>
              <!-- title input -->
              <v-text-field
                label="Title"
                class="mt-5"
                v-model="title"
                required
              ></v-text-field>

              <!-- location input -->
              <setLocationMap class="mb-5" :clear="clearMap"></setLocationMap>

              <v-layout row>
                <v-flex xs12>
                  <v-tabs v-model="activeTab" color="primary" dark grow slider-color="yellow">
                    <v-tab ripple>
                      Upload local file
                    </v-tab>
                    <v-tab-item>
                      <v-card flat>
                        <v-card-text>
                          <!-- image insertion -->
                          <fileloader class="mb-3"></fileloader>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>
                    <!-- tab 2 -->
                    <v-tab ripple>
                      Use online image
                    </v-tab>
                    <v-tab-item>
                      <v-card flat>
                        <v-card-text>
                          <urlpreviewer class="mb-3" :clear="clearUrl"></urlpreviewer>
                        </v-card-text>
                      </v-card>
                    </v-tab-item>
                  </v-tabs>
                </v-flex>
              </v-layout>
              
              

              <!-- group size/seats -->
              <v-layout row>
                <v-flex xs12>
                  <v-select
                    :items="sizes"
                    v-model="groupSize"
                    v-if="!isCustomSize"
                    label="Group Size"
                    required
                  ></v-select>
                  <v-text-field
                    label="Group Size"
                    v-model="customGroupSize"
                    v-if="isCustomSize"
                    :rules="[rules.numberOnly]"
                    hint="Must be a number"
                    persistent-hint
                    error
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
              <v-btn large flat :disabled="!validForm" class="primary" type="submit">CREATE MEETUP</v-btn>
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
import urlpreviewer from '@/components/common/urlpreviewer'
import setLocationMap from '@/components/common/setLocation'

export default {
  components: {
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
      sizes: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,'Other'],
      groupSize: null,
      customGroupSize: null,
      rules: {
        numberOnly: (value) => typeof value === 'number' || 'Must be a number'
      },
      clearMap: false,
      clearUrl: false
    }
  },
  methods: {
    createMeetup () {
      const meetup = {
        title: this.title,
        location: this.location,
        size: this.isCustomSize ? this.customGroupSize : this.groupSize,
        description: this.description,
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
        .then(() => {
          this.$router.push('/meetups')
        })
      }
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
      return this.groupSize === 'Other'
    }
  },
  created () {
    // this.$store.commit('clearLoadedMeetUp')
  }
}
</script>
<style lang="scss">
</style>
