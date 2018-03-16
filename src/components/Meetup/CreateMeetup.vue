<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <!-- header toolbar -->
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Create a new Meetup</v-toolbar-title>
          </v-toolbar>
          <!-- card body - form -->
          <form @submit.prevent="createMeetup">
            <v-card-text class="px-4 py-4">
              <span class="title">Meetup Info</span>
              <v-text-field
                label="Title"
                class="mt-5"
                v-model="title"
                required
              ></v-text-field>
              <v-text-field
                label="Location"
                hint="This field is not required"
                v-model="location"
              ></v-text-field>
              <v-text-field
                label="Image URL"
                persistent-hint
                v-model="imageUrl"
                required
              ></v-text-field>
              <div v-if="imageUrl">
                <p class="info--text mb-1">Image Preview</p>
                <img :src="imageUrl" class="preview">
              </div> 
              <v-text-field
                label="Description"
                v-model="description"
                multi-line
              ></v-text-field>
              <small>*indicates required field</small>
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
export default {
  data () {
    return {
      title: '',
      location: '',
      imageUrl: '',
      description: ''
    }
  },
  methods: {
    createMeetup () {
      const meetup = {
        title: this.title,
        location: this.location,
        imageUrl: this.imageUrl,
        description: this.description,
        date: new Date(),
        id: 'c'
      }
      this.$store.dispatch('createMeetup', meetup)
      this.$router.push('/meetups')
    }
  },
  computed: {
    validForm () {
      return this.title.length && 
      this.location.length && 
      this.imageUrl.length && 
      this.description.length
    }
  }
}
</script>
<style lang="scss">
.preview {
  width: 100%;
}
</style>
