<template>
  <div>
    <!-- radio selection -->
    <div class="type-opt-wrapper">

      <div class="type-opts">    
        <label class="type-opt"
        :class="type_selected === types[index]? 'checked' : ''"
        v-for="(item, index) in types" :key="index">
          <span class="type-opt-icon">
            <i :class="types[index] === 'public'? 'fas fa-users' : ''" v-if="types[index] === 'public'"></i>
            <i :class="types[index] === 'personal'? 'fas fa-user-lock' : ''" v-if="types[index] === 'personal'"></i>
            <i :class="types[index] === 'private'? 'far fa-eye-slash' : ''" v-if="types[index] === 'private'"></i>
          </span>
          <span>{{ typesCN[index] }}</span>
          <input type="radio" id="mt_public" class="fake-input"
          name="mt_type" :value="types[index]" v-model="type_selected">
        </label>
      </div>

      <div class="hint" v-show="type_selected">
        <p v-show="type_selected === 'public'">对所有人可见, 并且任何人都可以参加, 适合没有人数限制的活动</p>
        <p v-show="type_selected === 'personal'">对所有人可见, 但必须获得你的授权才能参加</p>
        <p v-show="type_selected === 'private'">仅对你以及被你邀请的朋友可见</p>
      </div>

    </div>

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
      type_selected: 'public',
    }
  },
  computed: {
    types () {
      return this.$store.state.groupModule.type
    },
    typesCN () {
      return this.$store.state.groupModule.typeCN
    },
  },
  methods: {
    getTypesCN () {
      let index = this.types.indexOf(this.type_selected)
      return this.typesCN[index]
    },

    submit () {
      let typeCN = this.getTypesCN()
      this.$emit('submitType', typeCN)
    }
  }
}
</script>


<style lang="scss">
.type-opt-wrapper {
  padding: 20px 25px;

  .type-opts {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    position: relative;
    padding: 20px 0;
    z-index: 1;

    .type-opt {
      flex: 0 0 98px;
      display: flex;
      flex-flow: row wrap;
      padding-top: 10px;
      width: 98px;
      height: 80px;
      border-radius: 5px;
      background: #ffffff;
      transition: background-color 0.1s ease-in;

      &.checked {
        position: relative;
        background: #6480E6;
        color: #ffffff;

        &::after {
          content: "";
          position: absolute;
          bottom: 5px;
          left: 50%;
          width: 83px;
          height: 21px;
          transform: translateX(-50%);
          background: #ffffff;
          box-shadow: 0 2px 25px -2px rgba(0, 0, 0, 0.8);
          z-index: -1;
        }
      }

      span {
        flex: 0 0 100%;
        text-align: center;
      }

      .type-opt-icon {
        font-size: 25px;
      }

      .fake-input {
        visibility: hidden;
        opacity: 0;
      }
    }
  }

  

  .hint {
    padding: 15px 20px;
    width: 100%;
    border-radius: 5px;
    background: #eeeeee;
  }
}

.cus-pos {
  position: absolute;
  margin: 0 !important;
  left: 50%;
  bottom: 45px;
  transform: translateX(-50%);
}
</style>

