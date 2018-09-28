<template>
  <div class="cus-full-page">     
    <div class="cus-card no-boxshadow">
      <div class="cus-card-section cus-pb-20">编辑小组任务</div>
      <div class="cus-card-section">
        <div class="cus-title cus-text-title">小组任务</div>

        <div class="todo-list cus-mb-15">
          <div class="todo-item cus-pd-25"
            :class="index + 1 < groupTodoList.length? 'cus-mb-25' : ''" 
            v-for="(item, index) in groupTodoList" :key="item.key">
            <v-icon class="primary--text cus-editpage-mt-fix">fas fa-circle</v-icon>
            <div class="todo-content">
              <textarea class="cus-text-p cus-textarea" v-model="item.content" @input="edit(item)"></textarea>
              <v-icon class="trash-icon" color="grey" v-show="!item.edited" @click="openDialog('group', item.key)">fas fa-trash-alt</v-icon>

              <transition name="slide" mode="out-in">
              <div class="cus-editpage-action-btn cus-flex-row" v-show="item.edited">
                <div class="cus-mr-15 confirm" @click="updateListItem(item, 'group')">
                  <v-icon>fas fa-check-circle</v-icon>
                  <span>确认修改</span>
                </div>
                <div class="cancel" @click="cancel('group', item)">
                  <v-icon>fas fa-times-circle</v-icon>
                  <span>取消</span>
                </div>
              </div>
              </transition>

              <div class="share-with-wrapper cus-mt-15">
                <v-icon class="cus-rotate-90 primary--text">fas fa-level-up-alt</v-icon>
                <div class="share-with">
                  <div class="cus-avatar-with-name" v-for="(member, index) in item.complete" :key="index">
                    <!-- <div class="check-icon-bg" v-if="member.complete">
                      <v-icon color="green">far fa-check-circle</v-icon>
                    </div> -->
                    <div class="cus-avatar-sm cus-mb-0" :style="getAvatarBg(member)"></div>
                    <!-- <p class="cus-text-p cus-avatar-name">{{ member.nickname }}</p> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="todo-list-placeholder" style="height: 50px; background: none">
          <div class="cus-todo-btn">
            <v-icon>fas fa-plus-circle</v-icon>
            <span>新建小组任务</span>
          </div>
        </div>

      </div>
      <div class="cus-card-section cus-pb-20">
        <div class="cus-title cus-text-title">个人任务</div>
        <div class="todo-list cus-mb-15">
          <div class="todo-item"
            :class="index + 1 < userTodoList.length ? 'cus-mb-15' : ''"
            v-for="(item, index) in userTodoList" :key="index">
            <v-icon class="primary--text cus-editpage-mt-fix">fas fa-circle</v-icon>
            <div class="todo-content">
              <textarea class="cus-text-p cus-textarea" v-model="item.content" @input="edit(item)"></textarea>
              <v-icon class="trash-icon" color="grey" v-show="!item.edited" @click="openDialog('user', item.key)">fas fa-trash-alt</v-icon>

              <transition name="slide" mode="out-in">
              <div class="cus-editpage-action-btn cus-flex-row" v-show="item.edited">
                <div class="cus-mr-15 confirm" @click="updateListItem(item, 'user')">
                  <v-icon>fas fa-check-circle</v-icon>
                  <span>确认修改</span>
                </div>
                <div class="cancel" @click="cancel('user', item)">
                  <v-icon>fas fa-times-circle</v-icon>
                  <span>取消</span>
                </div>
              </div>
              </transition>

            </div>
          </div>

          <!-- add new todo -->
          <div class="todo-item cus-mt-15" v-show="showUserTodoInput">
            <v-icon class="primary--text cus-editpage-mt-fix">fas fa-circle</v-icon>
            <div class="todo-content">
              <textarea class="cus-text-p cus-textarea" v-model="newItem.content" @input="edit(newItem)"></textarea>
              <v-icon class="trash-icon" color="grey" @click="closeUserTodoInput">fas fa-trash-alt</v-icon>
              <transition name="slide" mode="out-in">
              <div class="cus-editpage-action-btn cus-flex-row" v-show="newItem.edited">
                <div class="cus-mr-15 confirm" @click="addListItem('user', newItem.content)">
                  <v-icon>fas fa-check-circle</v-icon>
                  <span>确认</span>
                </div>
                <div class="cancel" @click="cancel('newItem', newItem)">
                  <v-icon>fas fa-times-circle</v-icon>
                  <span>清除</span>
                </div>
              </div>
              </transition>

            </div>
          </div>
        </div>

        <div class="todo-list-placeholder" style="height: 50px; background: none">
          <div class="cus-todo-btn" @click="showUserTodoInput = true">
            <v-icon>fas fa-plus-circle</v-icon>
            <span>新建个人任务</span>
          </div>
        </div>
      </div>

      <div class="cus-card-section cus-flex-row cus-pb-20">
        <div @click="closeEditPage">关闭</div>
      </div>

    </div>

    <ConfirmModal ref="confirmModal"
      v-on:confirm="deleteItem"
      v-on:cancel="cancelDeletion"></ConfirmModal>
  </div>
</template>


<script>
/* eslint-disable */

// helper function
/* 
  Deep Copy Object
  Note: used to create a copy of the todo item object
*/
function deepObjCopy (obj) {
  let copy = {}

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      copy[key] = deepObjCopy(obj[key])
    } else {
      copy[key] = obj[key]
    }
  })

  return copy
}

// Vue part
import ConfirmModal from './Components/Modal.vue'

export default {
  components: {
    ConfirmModal
  },

  props: {
    group: {
      type: Object,
      required: true
    },

    planItem: {
      type: Object,
      required: true
    },

    scheduleItem: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      itemToDeleteKey: undefined,
      itemToDeleteType: undefined,
      newItem: {
        content: ''
      },
      showUserTodoInput: false,
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
  },
  
  methods: {
    closeEditPage () {
      this.$emit('close')
    },

    getAvatarBg (member) {
      return `background-image: url("${member.photoURL}")`
    },

    addListItem (type, content) {
      this.$store.dispatch('handleTodoItem', {
        action: 'add',
        type: type,
        group_key: this.group.key,
        trip_plan_key: this.planItem.key,
        trip_schedule_key: this.scheduleItem.key,
        content: content
      })
      .then(key => {
        if (type === 'user') {
          this.showUserTodoInput = false
          this.$delete(this.newItem, 'edited')
          this.newItem = {
            content: ''
          }
        } else if (type === 'group') {
          // Need to work on the complete obj
        }
      })

    },

    updateListItem (item, type) {
      this.$store.dispatch('handleTodoItem', {
        action: 'update',
        type: type,
        group_key: this.group.key,
        trip_plan_key: this.planItem.key,
        trip_schedule_key: this.scheduleItem.key,
        trip_todo_key: item.key,
        content: item.content
      })
      .then(() => item.edited = false)
    },

    cancel (type, item) {
      if (type === 'group') {
        item.content = this.groupTodoList[item.key].content
      } else if (type === 'user') {
        item.content = this.userTodoList[item.key].content
      } else if (type === 'newItem') {
        item.content = ''
      }
      item.edited = false
    },

    edit (item) {
      this.$set(item, 'edited', true)
    },

    openDialog (type, key) {
      this.$refs.confirmModal.dialog = true
      this.itemToDeleteType = type
      this.itemToDeleteKey = key
    },

    deleteItem () {
      this.$store.dispatch('handleTodoItem', {
        action: 'delete',
        type: this.itemToDeleteType,
        group_key: this.group.key,
        trip_plan_key: this.planItem.key,
        trip_schedule_key: this.scheduleItem.key,
        trip_todo_key: this.itemToDeleteKey
      })
      .then(() => {
        this.itemToDeleteType = undefined
        this.itemToDeleteKey = undefined
      })
    },

    cancelDeletion () {
      this.itemToDeleteType = undefined
      this.itemToDeleteKey = undefined
    },

    closeUserTodoInput () {
      this.showUserTodoInput = false,
      this.$delete(this.newItem, 'edited')
      this.newItem = {
        content: ''
      }
    }
  },

  // automate textarea height @ mount hook
  mounted () {
    let tas = document.querySelectorAll('.cus-textarea'),
        limit = 120

    for(let ta of tas) {
      ta.oninput = () => {
        ta.style.height = "40px";
        ta.style.height = Math.min(ta.scrollHeight, limit) + "px";
      }
    }
  }
}
</script>

<style lang="scss">
.cus-editpage-action-btn {
  // display: none;
  padding: 5px;

  > div {
    display: flex;
    align-items: center;
    padding: 5px 15px;
    background: #6480e6;
    border-radius: 20px;
  }

  .icon, span {
    font-size: 14px;
    color: #ffffff;
  }

  .icon {
    margin-right: 5px;
  }
}

.cus-textarea {
  position: relative;
  padding: 10px 50px 10px 10px;
  width: 100%;
  height: 40px;
  outline: none;
  border: 2px dashed #ffffff;;
  border-radius: 5px;

  &:focus {
    border: 2px solid #ffffff;
    background: #ffffff;
  }
}

.cus-editpage-mt-fix {
  margin-top: 12px;
}

.cus-full-page {
  position: fixed;
  top: 50px;
  bottom: 0px;
  left: 0px;
  width: 100%;
  background: #ffffff;
  overflow: scroll;
  z-index: 99;
}
</style>


