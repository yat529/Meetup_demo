<template>
  <div class="cus-app-view-header">
    <!-- header -->
		<div class="header-section">
			<div class="header-text">
				<div class="title">{{ headerInfo.title }}</div>
				<div class="subtitle">{{ headerInfo.subtitle }}</div>
			</div>

			<div class="header-controls">
				<v-btn icon small dark color="primary" class="cus-icon-btn mx-0 my-0" @click="prevStep">
					<v-icon small>fas fa-chevron-left</v-icon>
				</v-btn>
				<div class="header-control-step-indicator">
					{{ tab }}/{{ tabs }}
				</div>
				<v-btn icon small dark color="primary" class="cus-icon-btn mx-0 my-0" @click="nextStep">
					<v-icon small>fas fa-chevron-right</v-icon>
				</v-btn>
			</div>
		</div>

		<!-- tab -->
    <div class="cus-stepper">
      <div class="cus-stepper-item" :class="item.active ? 'active-item' : ''"
      v-for="(item, index) in headerInfo.tabs" :key="'cus-stepper-' + index"
      @click="clickTab(item, index)">
        <div class="cus-stepper-text">{{ item.label }}</div>
      </div>
    </div>
	</div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    headerInfo: {
      type: Object,
      default: {
        title: '标题',
        subtitle: '副标题',
        tabs: [
          {
            label: '标记',
            active: false
          }, 
        ]
      },
      
    },
  },

  data () {
    return {
      tab: 1,
    }
  },

  computed: {
    tabs () {
      if (this.headerInfo.tabs) {
        return this.headerInfo.tabs.length
      }
    }
  },

  methods: {
    nextStep () {
      if (this.tab < this.tabs) {
        this.tab ++
        // active tab
        let nextTab = this.headerInfo.tabs[this.tab - 1]
        this.syncTab(nextTab)
        // change tab
        this.emitTabChange(this.tab)
      }
    },

    prevStep () {
      if (this.tab > 1) {
        this.tab --
        // active tab
        let nextTab = this.headerInfo.tabs[this.tab - 1]
        this.syncTab(nextTab)
        // change tab
        this.emitTabChange(this.tab)
      }
    },

    syncTab (item) {
      this.headerInfo.tabs.forEach(tab => {
        tab.active = false
      });
      item.active = true
    },

    clickTab (item, index) {
      this.headerInfo.tabs.forEach(tab => {
        tab.active = false
      });
      item.active = true
      this.tab = index + 1
      this.emitTabChange(this.tab)
    },

    emitTabChange (tab) {
      this.$emit('changeTab', tab)
    }
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
    z-index: 1;

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

  .cus-stepper {
    display: flex;
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

    .cus-stepper-item {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      height: 100%;
      flex: 1 0;
      flex-flow: row wrap;

      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0px;
        width: 0%;
        height: 2px;
        background-image: linear-gradient(to left, #7167D5, #53A0FD);
        // transition: width 0.2s cubic-bezier(0.9, 0, 0.51, 1);
      }

      &.active-item {
        
        &::before {
          width: 100%;
        }
      }

      .cus-stepper-indicator {
        position: relative;

        .indicator {
          border-radius: 50%;
          width: 20px;
          height: 20px;
          // font-size: 16px;
          line-height: 20px;
          text-align: center;
          color: #ffffff;
        }
      }

      .cus-stepper-text {
        margin-left: 12px;
      }
    }
  }
}
</style>


