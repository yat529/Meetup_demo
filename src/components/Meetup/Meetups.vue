<template>
  <v-container>
    <CardCarousel :meetups="meetups"></CardCarousel>
  </v-container>
</template>

<script>
/* eslint-disable */
import CardButton from '@/components/common/button'
import CardCarousel from '@/components/common/cardCarousel'

export default {
  components: {
    CardButton,
    CardCarousel
  },
  data () {
    return {
      meetups: []
    }
  },
  created () {
    // load meetups on init
    this.$store.dispatch('fetchMeetups')
    .then(meetups => {
      this.meetups = meetups
    })
  }
}
</script>

<style lang="scss">
.carousel-wrapper {
  position: relative;

  .arrow {
    position: absolute;
    top: 50%;
    cursor: pointer;
    z-index: 2;

    &.left {
      left: 0;
      transform: translate(-50%, -50%);
    }

    &.right {
      right: 0;
      transform: translate(50%, -50%);
    }
  }
}

.cards-view {
  position: relative;
  padding: 0;
  overflow: hidden;

  .cards-row {
    display: block;
    overflow: hidden;
    transition: transform 0.2s ease-in-out;
  }
}


.meetups {
  .card-wrapper {
    display: block;
    position: relative;
    float: left;
    width: 288px;
    margin: 20px;

    &:first-child {
      margin-left: 0;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  .date-wrapper {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 70px;
    border-radius: 5px;
    overflow: hidden;
    z-index: 2;
    
    .date,
    .day {
      width: 70px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      text-align: center;
    }

    .date {
      background: #fff;
    }

    .day {
      background: #000000;
      color: #fff;
      font-size: 12px;
    }
  }

  .card-item {
    box-shadow: 0 5px 15px -11px rgba(0, 0, 0, 0.4);
    border-radius: 15px !important;

    .card-item-image {
      border-radius: 15px 15px 0 0 !important;
    }

    .info_name,
    .info_desc {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }

    .info_name {
      height: 50px;
      font-size: 1.2rem;
      -webkit-line-clamp: 2;
    }

    .info_desc {
      height: 60px;
      font-size: 1rem;
      line-height: 20px;
      -webkit-line-clamp: 3;
    }
  }
}
</style>
