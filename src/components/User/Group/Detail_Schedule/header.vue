<template>
  <div class="schedule-pg-header cus-px-30">
    <Calender class="calender cus-mr-15" :date="date"></Calender>
    <div class="cus-flex-item">
      <p class="cus-text-p">{{ formattedDate }}</p>
      <h1 class="cus-text-title cus-text-bold">{{ title }}</h1>
    </div>
    <div class="close-btn" @click="close">
      <v-icon>fas fa-times</v-icon>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import Calender from '@/components/common/calenderIcon'

export default {
  components: {
    Calender
  },

  props: {
    date: {
      type: Object,
      default () {
        return {
          month: 4,
          day: 13
        }
      }
    },
    title: {
      type: String
    }
  },

  data () {
    return {
      // 
    }
  },

  computed: {
    formattedDate () {
      return `${this.date.month}月${this.date.day}日行程`
    }
  },

  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.cus-flex-item {
  flex: 1;
}

.cus-px-30 {
  padding-left: 30px;
  padding-right: 30px;
}

.cus-mr-15 {
  margin-right: 15px;
}

.cus-text-title {
  font-size: 16px;
  font-weight: 400;
}

.cus-text-p {
  font-size: 16px;
  font-weight: 400;
  line-height: 20px !important;
  margin-bottom: 0px !important;
}

.cus-text-bold {
  font-weight: 500;
}


.schedule-pg-header {
  display: flex;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 90px;
  background: #ffffff;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 10px;
    left: 10px;
    right: 10px;
    background: #ffffff;
    box-shadow: 0 2px 30px rgba(0, 0, 0, 0.5);
    z-index: -1;
  }

  .calender {
    display: inline-block;
    width: 44px;
    height: 44px;

    // overwrite component style
    .clamp {
      height: 6px;
      min-width: auto;
      min-height: auto;

      .bar {
        height: 100%;
        min-height: auto;
      }
    }

    .month, .day {
      height: 20px;
      min-width: auto;
      min-height: auto;
      font-size: 13px;
      font-weight: 400;
    }

    .day {
      background: #ffffff;
    }
  }

  .close-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    line-height: 25px;
    background: #6480E6;
    border-radius: 50%;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);

    .icon {
      font-size: 16px;
      color: #ffffff;
    }
  }
}


</style>


