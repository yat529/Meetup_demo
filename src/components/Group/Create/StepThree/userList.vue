<template>
  <div class="user-list-container">

    <div class="action-bar" v-if="users.length">
      <transition name="slide" mode="out-in">
      <div class="tool-bar" v-show="!showSearchBar">
        <div class="slt-all tool-bar-action" @click="selectAll(users)" v-show="!selectedUsers.length">
          <v-icon>fas fa-check-square</v-icon>
          <span>全部选择</span>
        </div>

        <div class="clr-all tool-bar-action" @click="clearAll(users)" v-show="selectedUsers.length">
          <v-icon>fas fa-undo-alt</v-icon>
          <span>清除选择</span>
        </div>

        <div class="search tool-bar-action" @click="openSearchBar">
          <v-icon>fas fa-search</v-icon>
          <span>查找朋友</span>
        </div>
      </div>
      </transition>

      <transition name="slide" mode="out-in">
      <div class="search-bar" v-show="showSearchBar">
        <v-icon class="search-icon primary--text">fas fa-search</v-icon>
        <input type="text" class="search-input" placeholder="查找好友">
        <v-icon class="search-filter primary--text" @click="closeSearchBar">fas fa-times-circle</v-icon>
      </div>
      </transition>
    </div>

    <div id="list-item-parent" v-if="users.length">

      <div class="list-item-container" v-for="(person, index) in users" :key="index">
        <div class="list-item">
          <div class="avatar"></div>
          <div class="item-body">
            <p> {{person.name}} </p>
            <div class="meta-bar">
              <v-icon class="gender female" v-if="person.gender === 'female'">fas fa-venus</v-icon>
              <v-icon class="gender male" v-else>fas fa-mars</v-icon>
              <span> {{person.age}}岁 </span>
            </div>
          </div>

          <div class="actions" :class="person.actionOn ? 'expanded' : ''">
            <transition name="fade" mode="out-in">
              <v-icon color="primary" v-if="!person.actionOn && !person.approved" 
              @click="toggleAction(person)">fas fa-ellipsis-h</v-icon>

              <v-icon color="green" v-else-if="!person.actionOn && person.approved"
              @click="toggleAction(person)">fas fa-check-circle</v-icon>
              <div v-else>

                <v-icon color="green" class="mr-2" @click="approve(person)">fas fa-check-circle</v-icon>
                <v-icon color="red lighten-1" @click="decline(person)">far fa-times-circle</v-icon>
              </div>
            </transition>
          </div>
        </div>
      </div>

    </div>

    <slot name="placeholder" v-else></slot>

    <div class="cus-btn-container" style="width: 210px; margin: 25px auto 25px auto" :class="users.length ? '' : 'cus-pos'">
      <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" v-if="selectedUsers.length" @click="confirm">
        确认
      </v-btn>
      <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" v-else @click="skip">
        跳过
      </v-btn>
    </div>

  </div>
</template>

<script>
/* eslint-disable */

// helper functions
function findParent (startElem, parentId) {
  let parentNode = startElem.parentElement,
      parent

  if (parentNode && parentNode.id == parentId) {
    return parentNode
  } else {
    parent = findParent(parentNode, parentId)
  }

  return parent
}



// exporting
export default {
  props: {
    users: {
      type: Array
    }
  },

  data () {
    return {
      showSearchBar: false,
      selectedUsers: []
    }
  },

  methods: {
    toggleAction (person) {
      if ('actionOn' in person === false) {
        this.$set(person, 'actionOn', true)
      } else {
        person.actionOn = !person.actionOn
      }
    },

    approve (person) {
      if ('approved' in person === false) {
        this.$set(person, 'approved', true)
      } else {
        person.approved = true
      }
      person.actionOn = false
      // this.$emit('approve', person)
      this.selectUser(person)
    },

    decline (person) {
      // if ('deleted' in person === false) {
      //   this.$set(person, 'deleted', true)
      // } else {
      //   person.deleted = true
      // }
      if ('approved' in person === false) {
        this.$set(person, 'approved', false)
      } else {
        person.approved = false
      }

      person.actionOn = false
      // this.$emit('decline', person)
      this.unselectUser(person)
    },

    selectAll (users) {
      let that = this
      that.selectedUsers = []

      users.forEach(person => {
        if ('approved' in person === false) {
          that.$set(person, 'approved', true)
        } else {
          person.approved = true
        }
        // that.$emit('approve', person)    
        that.selectUser(person)
      })
    },

    clearAll (users) {
      users.forEach(person => {
        if ('approved' in person === false) {
          this.$set(person, 'approved', false)
        } else {
          person.approved = false
        }
        // this.$emit('decline', person)
      })
      this.selectedUsers = []
    },

    selectUser (user) {
      let hasUser = false
      this.selectedUsers.forEach(selectUser => {
        if (selectUser.uid === user.uid) {
          hasUser = true
        }
      })
      if (!hasUser) {
        this.selectedUsers.push(user)
      }
    },

    unselectUser (user) {
      this.selectedUsers.forEach((selectedUser, index) => {
        if (selectedUser.uid === user.uid) {
          this.selectedUsers.splice(index, 1)
        }
      })
    },

    openSearchBar () {
      this.showSearchBar = true
    },

    closeSearchBar () {
      this.showSearchBar = false
    },

    confirm () {
      this.$emit('confirm', this.selectedUsers)
    },

    skip () {
      this.$emit('skip', this.selectedUsers)
    },

    // // transition hook methods
    // beforeListItemLeave (el) {
    //   let parent = findParent(el, 'list-item-parent'),
    //       child = el.firstElementChild

    //   parent.style.transition = ''
    //   parent.style.height = parent.scrollHeight + 'px'
    //   parent.style.transition = 'height 0.3s cubic-bezier(.95, .04, .55, .9)'

    //   el.style.height = el.scrollHeight + 'px'
    //   el.style.overflow = 'visible'
    // },

    // listItemLeave (el, done) {
    //   let child = el.firstElementChild,
    //       parent = findParent(el, 'list-item-parent'),
    //       parentNewHeight = parent.scrollHeight - el.scrollHeight

    //   Velocity(child, { translateX: '100px', opacity: 0 }, { 
    //     easing: 'ease-out',
    //     duration: 600
    //   })
    //   Velocity(el, { height: '0px' }, { 
    //     easing: 'ease',
    //     delay: 300,
    //     duration: 300,
    //   })
    //   Velocity(parent, { height: parentNewHeight + 'px' }, { 
    //     easing: 'ease',
    //     delay: 300,
    //     duration: 300, 
    //     complete: done 
    //   })
    // },

    // afterItemLeave (el) {
    //   el.style = ''
    // },
  }
}
</script>

<style lang="scss">
#group_creation .user-list-container {
  position: relative;
  margin: 0 15px;
  padding: 10px 20px;

  .action-bar {
    position: relative;
    height: 40px;
  }

  .tool-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #ffffff;

    .tool-bar-action {
      display: flex;
      align-items: center;
      margin-right: 15px;

      .icon {
        font-size: 13px;
        color: #6480E6;
      }

      span {
        margin-left: 6px;
      }
    }

    .slt-all, .clr-all {
      position: absolute;
      top: 0;
      left: 0;
      height: 40px;
      line-height: 40px;
    }

    .search {
      float: right;
      margin-right: 0;
      height: 40px;
      line-height: 40px;

      .icon {
        font-size: 13px;
      }
    }
  }
  
  .search-bar {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    border-bottom: 0px;

    .search-input {
      flex: 1 0 auto;
      display: block;
      padding: 7px 15px 7px 54px;
      height: 35px;
      outline: none;
      border-radius: 100px;
      background: #ffffff;
    }

    .search-icon {
      position: absolute;
      top: 50%;
      left: 17px;
      transform: translateY(-50%);
      font-size: 16px;
    }

    .search-filter {
      flex: 0 0 auto;
      font-size: 20px;
      margin-left: 15px;
    }
  }

  #list-item-parent {
    margin-top: 10px;
    position: relative;
  }

  .list-item-container {
    position: relative;
    overflow: hidden;
    z-index: 1 !important;

    .list-item {
      display: flex;
      align-items: center;
      position: relative;
      height: 85px;
      margin-bottom: 15px;
      border-radius: 5px;
      background: #ffffff;

      &::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 0px;
        transform: translateX(-50%);
        width: 98%;
        height: 30px;
        background: #ffffff;
        box-shadow: 0 2px 20px -5px rgba(0, 0, 0, 0.3);
        z-index: -1;
      }

      .avatar {
        flex: 0 0 70px;
        display: block;
        position: relative;
        width: 70px;
        height: 70px;
        margin: 0 15px;
        border-radius: 50%;
        background-color: bisque;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      }

      .item-body {
        flex: 1 0 auto;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        margin-right: 60px;
        height: 100%;

        p {
          margin-bottom: 5px;
        }

        .meta-bar {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          padding: 0 10px;
          width: 100px;
          height: 25px;
          border-radius: 100px;
          background: #F6F8FA;

          .gender {
            font-size: 13px;
            margin-right: 10px;

            &.female {
              color: #E9968F;
            }

            &.male {
              color: #6480E6;
            }
          }

          span {
            font-size: 13px;
            font-weight: 400;
          }
        }
      }

      .actions {
        flex: 0 0 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        right: 0;
        padding: 5px;
        width: 45px;
        max-width: 45px;
        height: 100%;
        border-left: 1px solid #eeeeee;
        transition: all 0.2s ease-in-out;
        transition-delay: 0.2s;

        &.expanded {
          width: 90px;
          max-width: 90px;
          transition: all 0.2s ease-in-out;
        }

        .icon {
          font-size: 20px;
        }
      }
    }
  }
}

</style>

