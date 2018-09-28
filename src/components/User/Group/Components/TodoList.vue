<template>
  <div>
    <div class="cus-card-section with-top-border">
      <div class="cus-title cus-text-title">小组任务</div>
      <div class="todo-list" v-if="groupTodoList.length">
        <div class="todo-item cus-pd-25"
          :class="index + 1 < groupTodoList.length? 'cus-mb-25' : ''" 
          v-for="(item, index) in groupTodoList" :key="item.key">
          <v-icon class="primary--text" v-if="!item.complete[group.uid].complete" @click="checkTodo('group', item.key)">far fa-circle</v-icon>
          <v-icon color="green" v-else @click="uncheckTodo('group', item.key)">far fa-check-circle</v-icon>
          <div class="todo-content">
            <p class="cus-text-p">{{ item.content }}</p>
            <div class="share-with-wrapper cus-mt-15">
              <v-icon class="cus-rotate-90 primary--text">fas fa-level-up-alt</v-icon>
              <div class="share-with">

                <div class="cus-avatar-with-name" v-for="(member, index) in item.complete" :key="index">
                  <div class="check-icon-bg" v-if="member.complete">
                    <v-icon color="green">far fa-check-circle</v-icon>
                  </div>
                  <div class="cus-avatar-sm cus-mb-0" :style="getAvatarBg(member)"></div>
                  <!-- <p class="cus-text-p cus-avatar-name">{{ member.nickname }}</p> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="todo-list-placeholder" v-else>
        <div>
          <span>暂无小组任务</span>
        </div>
      </div>
    </div>

    <div class="cus-card-section cus-pb-20">
      <div class="cus-title cus-text-title">个人任务</div>
      <div class="todo-list" v-if="userTodoList.length">
        <div class="todo-item"
          :class="index + 1 < userTodoList.length ? 'cus-mb-15' : ''"
          v-for="(item, index) in userTodoList" :key="item.key">
          <v-icon class="primary--text" v-if="!item.complete" @click="checkTodo('user', item.key)">far fa-circle</v-icon>
          <v-icon color="green" v-else @click="uncheckTodo('user', item.key)">far fa-check-circle</v-icon>
          <div class="todo-content">
            <p class="cus-text-p">{{ item.content }}</p>
          </div>
        </div>
      </div>

      <div class="todo-list-placeholder" v-else>
        <div>
          <span>暂无个人任务</span>
        </div>
      </div>
    </div>

    <!-- slot for add/edit todo, edit schedule item -->
    <slot name="action"></slot>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    groupTodoList: {
      type: Array,
      required: true
    },

    userTodoList: {
      type: Array,
      required: true
    }
  },

  computed: {
    group () {
      return this.$store.state.groupModule.loadedGroup
    },

    planItem () {
      return this.$store.state.groupModule.loadedPlanItem
    },

    scheduleItem () {
      return this.$store.state.groupModule.loadedScheduleItem
    },
  },

  methods: {
    getAvatarBg (member) {
      return `background-image: url("${member.photoURL}")`
    },

    checkTodo (type, itemKey) {
      this.$store.dispatch('handleTodoItem', {
        action: 'check',
        type: type,
        group_key: this.group.key,
        trip_plan_key: this.planItem.key,
        trip_schedule_key: this.scheduleItem.key,
        trip_todo_key: itemKey
      })
    },

    uncheckTodo (type, itemKey) {
      this.$store.dispatch('handleTodoItem', {
        action: 'uncheck',
        type: type,
        group_key: this.group.key,
        trip_plan_key: this.planItem.key,
        trip_schedule_key: this.scheduleItem.key,
        trip_todo_key: itemKey
      })
    },
  },
}
</script>

<style lang="scss">
.cus-rotate-90 {
  transform: rotate(90deg);
}

.cus-pos-relative {
  position: relative !important;
}

.with-top-border {
  border-top: 1px solid #F6F8FA;
}

.todo-list-placeholder {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  height: 100px;
  background:#F6F8FA;
  border-radius: 5px;

  > div {
    padding: 10px 20px;
    line-height: 17px;
    border-radius: 5px;
    background: #F6F8FA;
    transition: background-color 0.1s ease-in;

    &.cus-todo-btn {
      background: #6480e6;

      .icon, span {
        color: #ffffff;
      }

      &:hover {
        background:#F6F8FA;

        .icon, span {
          color: #676767
        }
      }
    }

    .icon {
      font-size: 16px;
      margin-right: 5px;
      line-height: 17px;
      vertical-align: top;
    }

    span {
      font-size: 16px;
      line-height: 17px;
      vertical-align: top;
    }

  }
}

.todo-item {
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;
  padding: 20px;
  background: #F6F8FA;
  border-radius: 5px;

  > .icon {
    width: 16px;
    height: 16px;
    font-size: 18px;
    margin-right: 15px;
  }

  .todo-content {
    position: relative;
    flex: 1;

    .trash-icon {
      position: absolute;
      top: 13px;
      right: 18px;
      font-size: 15px;
    }

    .share-with-wrapper {
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      z-index: 1;

      > .icon {
        width: 11px;
        height: 15px;
        font-size: 15px;
        margin-right: 5px;
      }

      .share-with {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex: 1;
        position: relative;
        padding: 5px 10px;
        background: #ffffff;
        border-radius: 5px;

        &::after {
          content: "";
          position: absolute;
          bottom: 5px;
          left: 50%;
          width: 95%;
          height: 5px;
          transform: translateX(-50%);
          background: #ffffff;
          box-shadow: 0 2px 13px -2px rgba(0, 0, 0, 0.5);
          z-index: -1;
        }
      }
    }
  }
}
</style>
