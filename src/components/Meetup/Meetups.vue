<template>
  <v-container class="meetups" v-if="meetups">
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 xl3 v-for="item in meetups" :key="item.key" class="px-2 py-2">
        <v-badge left overlap color="green" class="card-wrapper">
          <v-icon slot="badge" dark v-if="registered(item)">check_circle</v-icon>
          <v-card flat>
            <v-card-media :src="item.imageUrl" height="200px">
            </v-card-media>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0 primary--text">{{ item.title }}</h3>
                <div class="mb-2">{{ item.date | DateFilter}}</div>
                <div class="content">{{ item.description }}</div>
              </div>
            </v-card-title>

            <CardButton :item="item" v-on:register="registerMeetup(item)" v-on:unregister="unregisterMeetup(item)" v-on:more="loadMeetup(item)" :showDelete="false"></CardButton>
          </v-card>
        </v-badge>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
/* eslint-disable */
import CardButton from '@/components/common/button'
export default {
  components: {
    CardButton
  },
  computed: {
    meetups () {
      return this.$store.getters.loadedMeetups
    }
  },
  methods: {
    loadMeetup (item) {
      this.$router.push('/meetup/' + item.key)
    },
    registerMeetup (item) {
      this.$store.dispatch('registerMeetup', item)
    },
    unregisterMeetup (item) {
      this.$store.dispatch('unregisterMeetup', item)
    },
    registered (item) {
      return item.registered
    }
  }
}
</script>
<style lang="scss" scoped>
.meetups {
  .card-wrapper {
    width: 100%;

    .content {
      height: 65px;
      overflow: hidden;
    } 
  }
}
</style>
