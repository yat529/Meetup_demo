<template>
  <div class="carousel-card">
    <div class="thumnail-img" :style="cardCoverBg"></div>
    <div class="card-title">{{ card.title }}</div>
    
    <slot name="card-btn-groups"></slot>
  </div>
</template>

<script>
/* eslint-disable */

export default {
  props: {
    card: {
      type: Object
    }
  },

  computed: {
    cardCoverBg () {
      return `background-image: url("${this.card.image_url}")`
    }
  }
}
</script>

<style lang="scss">
.carousel-card {
  position: relative;
  float: left;
  margin-right: 15px;
  width: 140px;
  height: 190px;
  border-radius: 5px;
  background: #ffffff;

  &:last-child {
    margin-right: 0px;
  }

  &::after {
    content: '';
    position: absolute;
    width: 110px;
    height: 70px;
    left: 15px;
    bottom: 5px;
    box-shadow: 0 2px 35px -5px rgba(0, 0, 0, 0.5);
    z-index: -1;
  }

  .thumnail-img {
    position: relative;
    width: 100%;
    height: 90px;
    border-radius: 5px 5px 0 0;
    background-color: thistle;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .card-title {
    position: relative;
    margin: 5px 7px;
    font-size: 13px;
    font-weight: 500;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .card-btn-container {
    display: flex;
    justify-content: center;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 10px;

    .card-btn {
      position: relative;
      width: 80px;
      // height: 24px;

      .icon {
        position: absolute;
        left: 5px;
      }
    }
  }
}
</style>

