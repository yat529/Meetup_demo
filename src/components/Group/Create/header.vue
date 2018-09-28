<template>
  <div class="cus-app-view-header">
    <!-- header -->
		<div class="header-section">
      <transition name="fade">
			<div class="header-text" v-for="(item, index) in headerInfo" :key="'cus-header-' + index">
				<div class="title">{{ item.title }}</div>
				<div class="subtitle">{{ item.subtitle }}</div>
			</div>
      </transition>

			<div class="header-controls" v-if="showArrowBtn">
				<v-btn icon small dark color="primary" class="cus-icon-btn mx-0 my-0" @click="prevStep">
					<v-icon small>fas fa-chevron-left</v-icon>
				</v-btn>
				<div class="header-control-step-indicator">
					{{ step }}/{{ steps }}
				</div>
				<v-btn icon small dark color="primary" class="cus-icon-btn mx-0 my-0" @click="nextStep">
					<v-icon small>fas fa-chevron-right</v-icon>
				</v-btn>
			</div>
		</div>

		<!-- tab or nav -->
    <div class="cus-stepper-fw" v-for="(stepper, stepperIndex) in stepperInfo" :key="stepperIndex" v-if="step == stepperIndex + 1">
      <div class="stepper-indicator" v-if="showStepperIndicator">
        <span>{{ step }}</span>
      </div>
      <div class="stepper-icon" v-else>
        <v-icon>fas fa-check-circle</v-icon>
      </div>
      <transition name="fade">
      <div class="stepper-content">
        <span>{{ stepper.step }}</span>
        <span>{{ stepper.content }}</span>
      </div>
      </transition>
    </div>
    
	</div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    step: {
      type: Number,
      default: 1
    },
    headerInfo: {
      type: Array,
      default: [
        {
          title: '标题',
          subtitle: '副标题',
        },
      ]
    },
    stepperInfo: {
      type: Array,
      default: [
        {
          step: '第一步:',
          content: '步骤内容',
        },
      ]
    },
    showArrowBtn: {
      type: Boolean,
      default: true
    },
    showStepperIndicator: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      // step: 1,
    }
  },

  computed: {
    steps () {
      return this.stepperInfo.length
    }
  },

  methods: {
    nextStep () {
      if (this.step < this.steps) {
        this.$emit('nextStep')
      }
    },
    prevStep () {
      if (this.step > 1) {
        this.$emit('prevStep')
      }
    },
  }
}
</script>

<style lang="scss">
.cus-app-view-header {
	position: relative;
	width: 100%;
  z-index: 2;

	.header-section {
		position: relative;
		padding: 0 20px;
		height: 70px;
		overflow: hidden;
    background: #ffffff;
		border-bottom: 1px solid #eeeeee;
    // z-index: 1;

		.header-text {
			position: absolute;
			top: 50%;
      left: 20px;
			transform: translateY(-50%);

			.title {
				font-size: 20px;
				font-weight: 500;
				line-height: 28px !important;
			}

			.subtitle {
				font-size: 13px;
				font-weight: 400;
				line-height: 16px;
			}
		}

		.header-controls {
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: absolute;
			top: 50%;
			right: 20px;
			padding: 5px 9px;
			width: 125px;
			height: 40px;
			transform: translateY(-50%);
			background: #F0F0F0;
			border-radius: 20px;
			z-index: 1;

			.header-control-step-indicator {
				font-size: 16px;
				font-weight: 500;
			}

			.cus-icon-btn {
				position: relative;

				&::before {
					content: '';
					position: absolute;
					bottom: 0px;
					left: 50%;
					width: 74%;
					height: 74%;
					transform: translateX(-50%);
					background: #ffffff;
					border-radius: 50%;
					box-shadow: 0 1px 7px 0 rgba(0, 0, 0, 0.8);
					z-index: -1;
				}
			}
		}

	}

  .cus-stepper-fw {
    position: relative;
    width: 100%;
    height: 50px;
    background: #ffffff;

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 10px;
      width: 95%;
      height: 50%;
      transform: translateX(-50%);
      background: #ffffff;
      box-shadow: 0 2px 40px 0 rgba(0, 0, 0, 0.5);
      z-index: -1;
    }

    .stepper-indicator,
    .stepper-icon {
      position: absolute;
      left: 0;
      top: 0;
      width: 65px;
      height: 100%;

      &::after {
        content: "";
        position: absolute;
        right: 0;
        top: 50%;
        width: 2px;
        height: 20px;
        background: #eeeeee;
        transform: translateY(-50%);
      }

      span {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 22px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        font-size: 12px;
        border-radius: 50%;
        background: #6480e6;
        color: #ffffff;
        transform: translate(-50%, -50%);
      }

      .icon {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #73AF2D;
        font-size: 20px;
      }
    }


    .stepper-content {
      width: 100%;
      height: 100%;
      text-align: center;

      span {
        font-size: 16px;
        font-weight: 500;
        line-height: 50px;
        vertical-align: middle;

        &:first-child {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>


