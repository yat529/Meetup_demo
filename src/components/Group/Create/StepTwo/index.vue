<template>
  <div class="section-wrapper">
    <div class="cus-radio-wrapper">
      <label class="cus-radio" v-for="(item, index) in categories" :key="index">
        <input type="radio" class="fake-input" v-model="cat_selected" v-bind:value="categories[index]" />
        <span class="cus-radio-icon">
          <i class="fas fa-check-circle" v-if="cat_selected === categories[index]"></i>
          <i class="far fa-circle" v-else></i>
        </span>
        <span>{{ categories[index] }}</span>
      </label>
    </div>

    <transition name="slide">
    <div class="error-box" v-if="showError">
      <v-icon>fas fa-exclamation-circle</v-icon>
      请选择一个主题
    </div>
    </transition>

    <div class="cus-btn-container cus-pos">
      <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" @click="submit">
        下一步
      </v-btn>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data () {
    return {
      cat_selected: '',
      showError: false
    }
  },
  watch : {
    cat_selected (newVal, oldVal) {
      if (!!newVal) {
        this.showError = false
      }
    }
  },
  computed: {
    categories () {
      return this.$store.state.groupModule.category
    },
  },
  methods: {
    submit () {
      this.showError = false
      if (!!this.cat_selected) {
        this.$emit('submitCategory', this.cat_selected)
      } else {
        this.showError = true
      }
    }
  }
}
</script>


<style lang="scss">
.cus-radio-wrapper {
  display: flex;
  position: relative;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-content: space-between;
  padding: 40px 0px !important;
  z-index: 1;

  .cus-radio {
    position: relative;
    flex: 0 0 auto;
    margin: 0 10px 15px 0;
    padding: 10px 15px;
    background: #ffffff;
    border-radius: 5px;
    text-align: center;

    &::after {
      content: "";
      position: absolute;
      bottom: 5px;
      left: 50%;
      width: 95%;
      height: 15px;
      transform: translateX(-50%);
      background: #ffffff;
      box-shadow: 0 2px 13px -2px rgba(0, 0, 0, 0.5);
      z-index: -1;
    }

    .fake-input {
      position: absolute;
      visibility: hidden;
      opacity: 0;
    }

    span {
      font-size: 16px;
      font-weight: 400;
    }

    .cus-radio-icon {
      margin-right: 10px;
    }

    .fa-check-circle {
      color: #6480e6;
    }
  }
}

.error-box {
  position: relative;
  padding: 10px 15px;
  border-radius: 5px;
  border: 2px solid #ffffff;
  background: #EF5350;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;

  .icon {
    margin-right: 7px;
    color: #ffffff;
    font-size: 18px;
  }
}

</style>

