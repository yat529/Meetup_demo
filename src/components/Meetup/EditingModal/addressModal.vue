<template>
  <v-layout row justify-center style="position: absolute" v-if="meetupKey">
    <v-dialog v-model="dialog" persistent max-width="690">
      <v-card>
        <v-card-title class="headline">更改活动地址</v-card-title>

        <v-container class="px-4">
          <setLocationMap :initalLocation="initalLocation"></setLocationMap>
        </v-container>

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
import setLocationMap from '@/components/common/setLocation'

export default {
  components: {
    setLocationMap
  },
  props: {
    meetupKey: {
      type: String
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    initalLocation: {
      type: Object
    },
  },
  data () {
    return {
      dialog: this.showDialog,
    }
  },
  methods: {
    update () {
      // update actions
      this.$store.dispatch('updateMeetupAddress', {
        meetup_key: this.meetupKey,
        location: this.location
      })
      .then(() => {
        this.$emit('update')
        this.dialog = false
        console.log('update location successful')
      })
    },
    cancel () {
      this.$emit('cancel')
      this.dialog = false
    }
  },
  computed: {
    location () {
      return this.$store.state.gmLocation
    },
  }
}
</script>
