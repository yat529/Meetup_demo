<template>
  <div class="site-msg-wrapper">
    <div class="msg" v-for="(message, index) in messages" :key="index">
      <div class="sender" :style="getUserAvatar(message)"></div>
      <div class="msg-body">
        <h3 class="msg-title">{{ message.message.title }}</h3>
        <p class="msg-content">{{ message.message.content }}</p>
      </div>
      <div class="action">
        <v-btn flat icon color="grey lighten-1" @click="dismiss(message.key)">
          <v-icon>far fa-times-circle</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    messages: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      // 
    }
  },
  methods: {
    getUserAvatar (sender) {
      return `background-image: url("${ sender.photoURL }")`
    },
    dismiss (key) {
      this.$store.dispatch('dismissNotificationMessage', key)
    }
  }
}
</script>

<style lang="scss">
.site-msg-wrapper {
  position: relative;
  padding: 10px;
  width: 100%;
  min-height: 90px;
  max-height: 400px;
  border: 3px dashed #ffffff;
  border-radius: 15px;
  overflow: auto;

  .msg {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    padding: 5px 15px;
    margin-bottom: 10px;
    width: 100%;
    height: 70px;
    border-radius: 15px;
    background: #ffffff;
    transition: all 0.2s ease;
    cursor: pointer;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      box-shadow: 0 2px 15px -7px rgba(0, 0, 0, 0.4);
    }

    .sender {
      display: block;
      flex: 0 0 auto;
      margin-right: 25px;
      width: 50px;
      height: 50px;
      background-position: center;
      background-size: cover;
      border: 2px solid #eeeeee;
      border-radius: 50%;
    }

    .action {
      display: block;
      flex: 0 0 auto;
      margin-left: 25px;
      width: 50px;
      height: 50px;
    }

    .msg-body {
      flex: 1 0 auto;
      height: 50px;
      min-width: 350px;

      .msg-title,
      .msg-content {
        width: 100%;
        height: 25px;
        line-height: 25px;
        text-align: left;
        font-size: 15px;
        font-weight: 500;
      }
      .msg-content {
        font-size: 13px;
        font-weight: 400;
      }
    }
  }
}
</style>
