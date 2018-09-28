<template>
  <!-- <v-app :style="bgImg"> -->
  <v-app>

    <Navbar class="cus-app-navbar" :isMobile="isMobile"></Navbar>

    <v-container class="cus-app-container" :class="isMobile ? 'mobile-fix' : ''">
      <router-view class="cus-view-container" :isMobile="isMobile" :isTablet="isTablet" 
      v-on:needFullScreenBg="setFullScreenBg"/>
    </v-container>
  
    <!-- <popUp :isMobile="isMobile"></popUp> -->
    <loader></loader>

  </v-app>
</template>

<script>
/* eslint-disable */ 
import Navbar from '@/components/Navbar'
import loader from '@/components/common/loader'
import popUp from '@/components/common/popup'

export default {
  name: 'App',
  components: {
    Navbar,
    loader,
    popUp
  },
  data () {
    return {
      isMobile: false,
      isTablet: false,
      fullScreenBg: false,
      bgImgUrl: 'https://image.shutterstock.com/z/stock-photo-party-with-friends-group-of-cheerful-young-people-carrying-sparklers-and-champagne-flutes-499219201.jpg'
    }
  },

  methods: {
    setFullScreenBg (payload) {
      console.log(payload)
      if (payload) {
        this.fullScreenBg = true
      } else {
        this.fullScreenBg = false
      }
    },
  },

  computed: {
    bgImg () {
      if (this.fullScreenBg) {
        return `background-image: url('${ this.bgImgUrl }')`
      }
    },

  },
  created () {
    this.$store.dispatch('initUserWatch')
  },

  mounted () {
    this.$forceUpdate()
  },

  updated () {
    // check if signin or signup
    let path = this.$route.path
    if (path === '/signin' || path === '/signup') {
      this.fullScreenBg = true
    } else {
      this.fullScreenBg = false
    }

    // check veiwport width
    let app = this.$el
    if (app) {
      let viewWidth = app.offsetWidth

      if (viewWidth < 450) {
        console.log(app.offsetWidth)
        this.isMobile = true
      }

      if (viewWidth < 960) {
        this.isTablet = true
      }
    }
  },
}
</script>
<style lang="scss">
$bgColor: rgb(250, 250, 250);

#app {
  // default bg color
  background-color: #F6F8FA !important;
  // default font color
  color: #676767;

  
  // app container class
  .cus-app-container {
    position: absolute;
    max-width: 1200px;
    width: 100%;
    padding: 0;
    top: 50px;
    bottom: 0;

    .cus-view-container {
      position: relative;
      height: 100%;
    }
  }

  // placed inside .cus-app-container
  .cus-app-navbar {
    position: relative;
    width: 100%;

    .toolbar__content {
      height: 50px !important;
    }
  }

  // placed inside .cus-app-container
  .cus-app-view-body {
    position: absolute;
    top: 120px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: auto;
  }

  // placed inside .cus-app-view-body
  .app-view-container {
    position: absolute;
    top: 20px;
    left: 45px;
    right: 45px;
  }

  // fixes
  .extra-px {
    padding: 50px 8% !important;
  }
}


// Signin/up Page Common
.login-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  .login-main {
    width: 100%;
    height: 100%;
    overflow: hidden;

    .login-header {
      position: relative;
      margin: 20px 30px 0 30px;
      height: 56px;
      line-height: 56px;
      font-size: 16px;
      font-weight: 400;

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0px;
        width: 100%;
        height: 1px;
        background-image: linear-gradient(to left, #7167D5, #53A0FD);
      }
    }

    .login-body {
      position: absolute;
      top: 76px;
      bottom: 0;
      width: 100%;
      overflow: auto;

      .login-body-header {
        position: relative;
        padding-top: 25px;
        margin: 0 30px;
        height: 45px;

        .title {
          font-size: 20px;
          font-weight: 400;
        }

        .subtitle {
          font-size: 13px;
          font-weight: 400;
          line-height: 16px;
        }
      }

      .login-body-view {
        position: relative;
        width: 100%;
        top: 0;
        bottom: 60px;
        overflow: auto;
      }

      .login-body-footer {
        position: fixed;
        width: 100%;
        height: 60px;
        left: 0px;
        bottom: 0px;
        padding: 10px 30px;
        background: #F6F8FA;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 30px;
          right: 30px;
          height: 1px;
          background-image: linear-gradient(to left, #7167D5, #53A0FD);
        }

        .login-footer-btn {

          .btn__content {
            padding: 0 !important;
          }
        }
      }

      .login-input-group {
        position: relative;
        margin: 27px 30px;

        .login-input {
          position: relative;
          width: 251px;
          margin: 0 auto 10px auto;

          &:last-child {
            margin-bottom: 0px;
          }
        }
      }
    }
  }

  .login-btn-wrapper {
    margin: 25px 30px auto;
    overflow: auto;
  }

  
}

/* 
 * Text Field
 */

.cus-input-group {
	display: flex;
	align-items: center;
	position: relative;
	width: 100%;
	margin-bottom: 15px;

	&:last-child {
		margin-bottom: 0px;
	}

	.cus-label-icon {
    position: relative;
		width: 30px;
    height: 30px;
    margin-right: 25px;
    text-align: center;
    z-index: 1;
    

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: #6480E6;
      z-index: -1;
    }

		.icon,
    .text {
      position: absolute;
      top: 50%;
      left: 50%;
      // width: 100%;
      // height: 100%;
      transform: translate(-50%, -50%);
			font-size: 16px;
      color: #ffffff;
      z-index: 2;
		}
	}

  .cus-input {
    flex: 1;
  }

  // nested inside .cus-input-group 
  .cus-radio-group{
    display: flex;
    flex: 1;
    align-items: center;
    position: relative;
    width: 100%;
    height: 75px;
    margin-bottom: 15px;
    box-sizing: border-box;

    &:last-child {
      margin-bottom: 0px;
    }

    .cus-radio-item {
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      flex: 1;
      height: 100%;
      border-radius: 5px;
      border: 3px solid transparent;
      box-sizing: border-box;

      &.selected {
        border: 3px solid #6480E6;
      }

      img {
        display: block;
        flex-basis: 33px;
        width: 27px;
        height: 33px;
        margin-bottom: 3px;
      }

      .img-label {
        flex-basis: 16px;
        height: 16px;
        line-height: 16px;
        font-size: 13px;
        font-weight: 400;
      }
    }
  }
}




/* 
 *  Buttons
 */
.cus-btn-container {
  position: relative;
  margin: 0 auto;
  width: 235px;
  height: 38px;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 3px;
    width: 92%;
    height: 17px;
    transform: translateX(-50%);
    box-shadow: 0 2px 15px -3px rgba(7, 75, 87, 0.5), 0 1px 10px 0 rgba(0, 0, 0, 0.5);
    z-index: -1;
  }

  &:last-child {
    margin-bottom: 31px;
  }

  .btn-cus {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }
  
  // outlined btn
  .my-btn,
  .cus-btn-outline {
    position: relative;
    background-color: #ffffff;
    background-image: linear-gradient(to left, #7167D5, #53A0FD);
    z-index: 1;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 228px;
      height: 32px;
      margin: 3px;
      border-radius: 4px;
      background-color: #ffffff;
      z-index: 2;
    }

    .my-btn-text,
    .cus-btn-outline-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
  }

  .my-btn-solid,
  .cus-btn-solid {
      position: relative;
      background-color: #ffffff;
      background-image: linear-gradient(to left, #7167D5, #53A0FD);
    }
}

.login-btn {
  @extend .cus-btn-container;
  margin-bottom: 22px;
}


/* 
 *  transition css
 */

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease-in;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter {
  transform: translateX(30px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.2s ease-in-out;
}

.rotate-enter,
.rotate-leave-to {
  transform: rotate(-90deg);
  opacity: 0;
}


/* 
 *  custom action
 */
.cus-action-align-center {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>
