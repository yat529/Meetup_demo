<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs3 v-for="item in meetups" :key="item.id" class="mr-3 mb-3">
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
            <v-btn flat color="orange">Join</v-btn>
            <v-btn flat color="orange">More</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
/* eslint-disable */
export default {
  computed: {
    meetups () {
      return this.$store.getters.loadedMeetups
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  min-height: 65px;
}
</style>
