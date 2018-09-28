<template>
  <div class="schedule-wrapper">
    <div class="schedule-item" v-for="(item, index) in planList" :key="index">
      <div class="dot" :class="{'first-dot': index === 0, 'last-dot': index + 1 === 3}"></div>
      <div class="item-content">
        <div class="cus-text-title cus-text-bold primary--text cus-mb-0">{{ formatDate(item.date) }}</div>
        <div class="cus-text-p cus-mb-15">{{ item.content }}</div>
        <div class="meta-bar">
          <!-- <div class="meta-bar-item">
            <v-icon>fas fa-map-marker-alt</v-icon>
            {{1}}个目的地
          </div> -->
          <div class="meta-bar-item">
            <v-icon>fas fa-check-square</v-icon>
            {{2}}个计划
          </div>
        </div>
      </div>
      <div class="more-btn" @click="showDetailSchedulePage(item)">
        <v-icon>fas fa-ellipsis-h</v-icon>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    planList: {
      type: Array,
      required: true
    }
  },

  methods: {
    // set loadedPlanItem in the store and load detail schedule page
    showDetailSchedulePage (planItem) {
      this.$store.commit('setLoadedPlanItem', planItem)
      this.$emit('showDetailSchedulePage')
    },

    formatDate (date) {
      let arr = date.split('-')
      return `${parseInt(arr[1])}月${parseInt(arr[2])}日`
    }
  }
}
</script>


<style lang="scss">
.schedule-item {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  position: relative;
  width: 100%;
  // min-height: 120px;
  z-index: 1;

  .dot {
    position: relative;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #6480E6;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);

    &::before {
      content: "";
      position: absolute;
      left: 9px;
      bottom: 10px;
      width: 2px;
      height: 60px;
      background: #D8D8D8;
      z-index: -1;
    }

    &::after {
      content: "";
      position: absolute;
      left: 9px;
      top: 10px;
      width: 2px;
      height: 60px;
      background: #D8D8D8;
      z-index: -1;
    }

    &.first-dot {
      &::before {
        display: none;
      }
    }

    &.last-dot {
      &::after {
        display: none;
      }
    }
  }

  .item-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    min-height: 120px;
    padding: 10px 20px;

    .meta-bar {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      width: 100%;
      // height: 24px;
      // background: antiquewhite;

      .meta-bar-item {
        margin-right: 20px;
        font-size: 14px;
        font-weight: 300;
        color: #9B9B9B;
        line-height: 16px;
        vertical-align: top;
        .icon {
          font-size: 14px;
          color: #9B9B9B;
          vertical-align: top;
        }
      }
    }
  }

  .more-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    line-height: 20px;
    background: #6480E6;
    border-radius: 50%;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);

    .icon {
      font-size: 13px;
      color: #ffffff;
    }
  }
}
</style>
