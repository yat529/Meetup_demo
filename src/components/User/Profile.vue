<template>
  <v-container>
    <h3 class="title mb-3 primary--text">My Meetups</h3>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 xl3 v-for="item in meetups" :key="item.id" class="px-2 py-2">
        <v-card>
          <v-card-media :src="item.imageUrl" height="200px">
          </v-card-media>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0 primary--text">{{ item.title }}</h3>
              <div class="mb-2">{{ item.date | DateFilter}}</div>
              <div class="content">{{ item.description }}</div>
            </div>
          </v-card-title>
          <v-card-actions>
            <v-btn flat color="orange">Edit</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
/* eslint-disable */
export default {
  data() {
    return {}
  },
  methods: {},
  computed: {
    meetups () {
      return this.$store.getters.myMeetups
    }
  }
}
</script>
<style lang="scss">

</style>
