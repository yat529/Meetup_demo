<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 xl3 class="px-2 py-2">
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
    item () {
      return this.$store.state.loadedMeetup
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  min-height: 65px;
}
</style>
