<template>
  <div class="complete-wrapper">
    <div class="art-wrapper">
      <img src="" alt="">
    </div>
    <div class="text-wrapper">
      <p class="title">太棒了! {{nickname}}</p>
      <p>你的米团已成功创建</p>
    </div>

    <div class="cus-btn-container">
      <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" @click="redirect">
        查看你的活动
      </v-btn>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    nickname: {
      type: String
    }
  },

  methods: {
    redirect () {
      this.$emit('redirect')
    }
  }
}
</script>


<style lang="scss">
.complete-wrapper {
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;

  .art-wrapper {
    width: 100%;
    height: 100px;
    background: #eeeeee;
    margin-bottom: 25px;
  }

  .text-wrapper {
    margin-bottom: 30px;

    p {
      text-align: center;
      margin-bottom: 0px;
      font-size: 16px;
      font-weight: 400;
    }
    p.title {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 5px;
    }
  }
}
</style>

