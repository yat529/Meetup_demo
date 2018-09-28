<template>
  <div v-if="group">

    <div class="group-pg-header">
      <div class="bg" :style="bg"></div>
      <div class="cus-mx-30 cus-my-30">
        <div class="meta cus-flex-row">
          <div class="meta-item">
            <v-icon color="white">fas fa-unlock-alt</v-icon>
            {{ group.type }}
          </div>
          <div class="meta-item">
            <v-icon color="white">fas fa-tag</v-icon>
            {{ group.category }}
          </div>
        </div>
        <div class="cus-flex-row cus-mt-15 cus-flex-space-between cus-flex-v-center">
          <div class="cus-title">{{ group.title }}</div>
          <div class="mark">
            <v-icon color="yellow" v-show="!archived" @click="archived = true">far fa-star</v-icon>
            <v-icon color="yellow" v-show="archived" @click="archived = false">fas fa-star</v-icon>
            <span>收藏</span>
          </div>
        </div>
      </div>
    </div>

    <div class="group-pg-body">
      <div class="cus-card-container">
        <Info :group="group"></Info>
      </div>
    </div>
  </div>
  
</template>

<script>
/* eslint-disable */
import Info from "../User/Group/info"

export default {
  components: {
    Info
  },
  data () {
    return {
      archived: false,
      group: null,
    }
  },

  computed: {
    bg () {
      return `background-image: url("https://lonelyplanetimages.imgix.net/mastheads/GettyImages-538096543_medium.jpg?sharp=10&vib=20&w=1200")`
    }
  },

  created () {
    let key = this.$route.params.id,
        promiseArr

    this.$store.commit('setLoading', true)

    promiseArr = [
      new Promise((resolve, reject) => {
        this.$store.dispatch('fetchGroup', key)
        .then(group => {
          this.group = Object.assign({}, this.group, group)
          resolve()
        })
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => resolve(), 2000)
      })
    ]
    
    Promise.all(promiseArr).then(results => {
      this.$store.commit('setLoading', false)
    })

  }
}
</script>



<style lang="scss">
.cus-mx-30 {
  margin-left: 30px;
  margin-right: 30px
}

.cus-my-30 {
  margin-top: 30px;
  margin-bottom: 30px
}

.cus-flex-space-between {
  justify-content: space-between;
}

.cus-flex-v-center {
  align-items: center;
}


// flex layout
.cus-flex-row {
  display: flex;
  flex-flow: row nowrap;
}

.cus-flex-item {
  flex: 1 0;
}

.cus-flex-spacer {
  flex: 1 0 auto;
}



// font-size
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

.cus-text-link {
  font-weight: 500;
  color: #6480e6;
  text-decoration: none;
}

.cus-text-bold {
  font-weight: 500;
}

// spacing
.cus-mb-0 {
  margin-bottom: 0px !important;
}
.cus-mb-5 {
  margin-bottom: 5px !important;
}
.cus-mb-15 {
  margin-bottom: 15px !important;
}
.cus-mb-25 {
  margin-bottom: 25px !important;
}

.cus-mt-15 {
  margin-top: 15px !important;
}
.cus-mt-25 {
  margin-top: 25px !important;
}

.cus-mr-10 {
  margin-right: 10px !important;
}
.cus-mr-15 {
  margin-right: 15px !important;
}

.cus-pt-25 {
  padding-top: 25px !important;
}

.cus-pb-20 {
  padding-bottom: 20px !important;
}
.cus-pb-25 {
  padding-bottom: 25px !important;
}

// box shadow
.no-boxshadow {
  box-shadow: none !important;

  &::after {
    box-shadow: none !important;
  }
}

.group-pg-header {
  position: fixed;
  top: 50px;
  left: 0;
  width: 100%;
  height: 240px;
  overflow: auto;
  z-index: 1;

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 240px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat; 
    z-index: -1;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.45;
      background: #000000;
      z-index: 1;
    }
  }

  .content {

    z-index: 2;
  }

  .meta-item {
    margin-right: 10px;
    font-size: 13px;
    font-weight: 500;
    line-height: 15px;
    vertical-align: top;
    color: #ffffff;

    .icon {
      font-size: 13px;
      line-height: 15px;
      vertical-align: top;
    }
  }

  .cus-title {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 20px;
    font-weight: 450;
    color: #ffffff;
    line-height: 25px;
  }

  .mark {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0;
    margin-left: 30px;

    .icon {
      font-size: 25px;
    }

    > span {
      margin-top: 5px;
      font-size: 13px;
      color: #ffffff;
    }
  }
}

.group-pg-body {
  position: relative;
  top: 240px;
  left: 0;
  width: 100%;
  z-index: 2;

  .cus-card-container {
    position: relative;
    top: -70px;
    margin: 0 30px;
    background: #ffffff;
    // border-radius: 5px;

    &::after {
      content: '';
      position: absolute;
      top: 10px;
      bottom: 10px;
      left: 50%;
      width: 90%;
      background: #ffffff;
      transform: translateX(-50%);
      box-shadow: 0 2px 30px rgba(0, 0, 0, 0.5);
      z-index: -1;
    }
  }
}
</style>
