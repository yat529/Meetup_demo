<template>
  <div class="fill-height no-result">
    <img class="art" :src="NoResultBg" alt="没有结果">
    <div class="text">{{ noResultText }}</div>
    <div class="cus-btn-container">
      <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" @click="btnClick">
        {{ buttonText }}
      </v-btn>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import WhoopsImg from '@/assets/Whoops.png'

export default {
  props: {
    // 没有结果显示文字
    noResultText: {
      type: String,
      default: '你还没有加入任何米团活动'
    },
    // 按钮文字
    buttonText: {
      type: String,
      default: '寻找米团'
    }
  },

  computed: {
    NoResultBg () {
      return WhoopsImg
    }
  },

  methods: {
    btnClick () {
      this.$emit('btnClick')
    }
  }
}
</script>

<style lang="scss">
.no-result {
  display: flex;
  flex-flow: column nowrap;
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 60px !important;
  width: 100%;
  z-index: 1;
  
  img.art {
    display: block;
    width: 80%;
    max-width: 300px;
    height: auto;
    margin: 0 auto 30px auto;
  }

  .text {
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 60px;
  }
  
}
</style>
