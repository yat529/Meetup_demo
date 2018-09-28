<template>
  <div class="cus-item-list">
    <div class="item-card-wrapper" v-for="(item, index) in scheduleList" :key="index">
      <div class="item-card-top cus-pr-15 " :class="index === 0 ? 'first-item' : ''">
        <div class="cus-flex-item item-content">
          <div class="cus-text-title cus-text-bold primary--text cus-mb-0">{{ item.time }}</div>
          <div class="cus-text-p">{{ item.content }}</div>
          <div class="meta-bar cus-mt-15">
            <div class="meta-bar-item">
              <v-icon>fas fa-map-marker-alt</v-icon>
              {{1}}个目的地
            </div>
            <div class="meta-bar-item">
              <v-icon>fas fa-check-square</v-icon>
              {{2}}个计划
            </div>
          </div>
        </div>
        <div class="more-btn" @click="toggleDetails(item, index)">
          <v-icon>fas fa-ellipsis-h</v-icon>
        </div>
      </div>

      <div class="item-card-bottom" ref="cardBottom">
        <div class="cus-card-section cus-pb-25">
          <div v-html="locationAddress(item)"></div>
        </div>

        <Map v-show="showMap"
          :width="mapWidth"
          :height="mapHeight"
          :location="item.location"></Map>

        <TodoList style="margin-top: 37px" v-if="todoListLoaded"
          :groupTodoList="groupTodoList"
          :userTodoList="userTodoList"
          v-on:editTodo="editTodo"
          v-on:editSchedule="editSchedule">

            <div class="cus-card-section cus-flex-row cus-pb-20" slot="action">
              <div class="cus-flex-item" @click="editTodo()">{{ userTodoList.length && groupTodoList.length ? '编辑任务' : '新建任务' }}</div>
              <div class="cus-flex-item" @click="editSchedule(item)">编辑计划</div>
            </div>

          </TodoList>
          
      </div>
    </div> <!-- item-card -->

    <div class="item-card-wrapper">
      <div class="item-card-top">
        <div class="item-content" @click="addSchedule">新建事件</div>
      </div>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
import Map from '@/components/common/embededMap'
import TodoList from '../Components/TodoList'

export default {
  components: {
    Map,
    TodoList
  },

  props: {
    group: {
      type: Object
    },

    planItem: {
      type: Object
    },

    scheduleList: {
      type: Array
    }
  },

  data () {
    return {
      loadedItemIndex: null, //required, used as index of the cardBottom DOM List,
      mapWidth: null,
      mapHeight: null,
    }
  },

  computed: {
    groupTodoList () {
      return this.$store.state.groupModule.loadedGroupTodoList
    },

    userTodoList () {
      return this.$store.state.groupModule.loadedUserTodoList
    },

    uid () {
      return this.$store.state.userModule.user_ref.uid
    },

    todoListLoaded () {
      return !!this.groupTodoList && !!this.userTodoList
    },

    showMap () {
      return !!this.mapWidth && !!this.mapHeight
    }
  },

  watch: {
    todoListLoaded (newVal, oldVal) {
      if (newVal === true) {
        this.$nextTick(() => {
     
          let $bottom = this.$refs.cardBottom[this.loadedItemIndex]
          $bottom.style.display = "block"

          let transition = $bottom.style.transition,
              height = $bottom.scrollHeight

          $bottom.style.height = 0 + "px"
          $bottom.style.transition = ''

          requestAnimationFrame( () => {
            $bottom.style.transition = transition

            requestAnimationFrame( () => {
              $bottom.style.height = height + "px"
            })
          })

          // remove the inline height style when transition ends - !!important
          $bottom.addEventListener('transitionend', removeStyleHeight)

          function removeStyleHeight () {
            $bottom.removeEventListener('transitionend', removeStyleHeight)
            $bottom.style.height = null
          }

          // assign google map ifram width when load details
          this.mapWidth = $bottom.scrollWidth
          this.mapHeight = 300
        })
      }
    }
  },

  methods: {
    locationAddress (item) {
      let locationName = item.location.name,
          address = item.location.address,
          addArr = [],
          street, city, stateZip

      addArr = address.split(', ')
      street = addArr[0]
      city = addArr[1]
      stateZip = addArr[2]

      return `<p class="cus-text-p cus-text-bold">${locationName}</p>
              <p class="cus-text-p">${street}</p>
              <p class="cus-text-p">${city}, ${stateZip}</p>`
    },

    loadTodoList (item) {
      this.$store.dispatch('watchTodoList', {
        group_key: this.group.key,
        trip_plan_key: this.planItem.key,
        trip_schedule_key: item.key
      })
    },

    resetTodoList (item) {
      this.$store.dispatch('stopWatchTodoList', {
        group_key: this.group.key,
        trip_plan_key: this.planItem.key,
        trip_schedule_key: item.key
      })
    },

    toggleDetails(item, index) {
      let $bottom = this.$refs.cardBottom[index]

      let transition = $bottom.style.transition,
          height = $bottom.scrollHeight

      function collapeItem () {
        $bottom.removeEventListener('transitionend', collapeItem)
        $bottom.style.display = null
      }

      // init property collapsed to be TRUE
      if(!item.hasOwnProperty('collapsed')) this.$set(item, 'collapsed', true)
      
      if (item.collapsed) {
        this.$store.commit('setLoadedScheduleItem', item)
        this.loadTodoList(item)
        this.loadedItemIndex = index
        item.collapsed = false
      } else {
        $bottom.style.transition = ''
        $bottom.style.height = height + "px"
        $bottom.addEventListener('transitionend', collapeItem)

        requestAnimationFrame( () => {
          $bottom.style.transition = transition

          requestAnimationFrame( () => {
            $bottom.style.height = 0 + "px"
            this.loadedItemIndex = null
            item.collapsed = true
            this.$store.commit('resetLoadedScheduleItem')
            this.resetTodoList(item)
          })
        })

        this.mapWidth = null
        this.mapHeight = null
 
      }
    },

    // open editTodo page
    editTodo () {
      this.$emit('editTodo')
    },

    // open editSchedule Page
    editSchedule () {
      this.$emit('editSchedule')
    },

    // open editSchedule Page w/o loading loadedScheduleItem from the store
    addSchedule () {
      this.$emit('addSchedule')
    }
  },

}
</script>

<style lang="scss">
.cus-item-list {
  position: relative; 
  overflow: hidden;
  z-index: 1;
}

.item-card-wrapper {
  &:last-child {
    margin-bottom:  30px;
  }
}

.item-card-top {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  position: relative;
  margin-top: 30px;
  width: 100%;
  min-height: 100px;
  border-radius: 5px 5px 0 0;
  background: #ffffff;

  &.first-item {
    margin-top: 0px;
    &::before {
      display: none;
    }
  }

  // link
  &::before {
    content: "";
    position: absolute;
    right: 23.5px;
    bottom: 50px;
    width: 3px;
    height: 80px;
    background: #6480E6;
    z-index: -1;
  }

  // shadow
  &::after {
    content: '';
    position: absolute;
    height: 70px;
    bottom: 9px;
    left: 10px;
    right: 10px;
    background: #ffffff;
    box-shadow: 0 2px 30px -5px rgba(0, 0, 0, 0.5);
    z-index: -1;
  }

  .item-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    min-height: 100px;
    padding: 10px 20px;

    .meta-bar {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      width: 100%;

      .meta-bar-item {
        margin-right: 20px;
        font-size: 14px;
        font-weight: 300;
        color: #9B9B9B;
        line-height: 16px;
        vertical-align: top;
        .icon {
          font-size: 14px;
          color: #9B9B9B;
          vertical-align: top;
        }
      }
    }
  }

  .more-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    line-height: 20px;
    background: #6480E6;
    border-radius: 50%;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);

    .icon {
      font-size: 13px;
      color: #ffffff;
    }
  }
}

.item-card-bottom {
  display: none;
  width: 100%;
  background: #ffffff;
  border-radius: 0 0 5px 5px;
  transition: height 0.4s cubic-bezier(0.54, 0.19, 0.29, 0.91);
  overflow: hidden;
}

.cus-card-section {
  position: relative;
  padding: 25px 20px 50px 20px;
  border-bottom: 1px solid #F6F8FA;

  &.with-top-border {
    border-top: 1px solid #F6F8FA;
  }

  .cus-title {
    display: inline-block;
    position: absolute;
    padding: 5px 0 5px 20px;
    top: 0;
    left: 0;
    transform: translateY(-50%);
    background: #ffffff;

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      right: -10px;
      width: 5px;
      height: 15px;
      background: #6480e6;
      transform: translateY(-50%);
    }
  }
}

</style>


