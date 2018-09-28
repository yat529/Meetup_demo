<template>
  <div class="cldr-wrapper custom-dimension-class">
    <div class="clamp">
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
    <div class="month red">
      <span>{{ month }}</span>
    </div>
    <div class="day">
      <span>{{ day }}日</span>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    date: {
      type: Object,
      default () {
        return {
          month: 4,
          day: 13
        }
      }
    }
  },
  computed: {
    month () {
      if (this.date) {
        let monthList = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            month = parseInt(this.date.month)
        
        return monthList[month - 1]
      }
    },
    day () {
      if (this.date) {
        return parseInt(this.date.day)
      }
    }
  }
}
</script>

<style lang="scss">
.cldr-wrapper {
  position: relative;
  border-radius: 8px;
  box-shadow: 0 2px 10px -5px rgba(0, 0, 0, 0.5);

  > .month,
  > .day  {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    min-width: 60px;
  }

  > .month {
    justify-content: flex-start;
    align-items: flex-end;
    padding-left: 7px;
    min-height: 27px;
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    border-radius: 8px 8px 0 0;
  }

  > .day {
    min-height: 33px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 0 0 8px 8px;
  }

  > .clamp {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-width: 60px;
    height: 20%;
    min-height: 10px;
    transform: translateY(-50%);

    .bar {
      position: absolute;
      width: 10%;
      height: 20%;
      min-height: 10px;
      background: #f1f1f1;
      border-radius: 3px;

      &:first-child {
        left: 22%;
      }
      &:last-child {
        right: 22%;
      }
    }
  }
}
</style>

