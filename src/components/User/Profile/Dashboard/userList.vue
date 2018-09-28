<template>
  <div class="user-list-container">
    <div class="tool-bar">
      <div class="slt-all tool-bar-action" @click="selectAll(userList)">
        <div class="icon-bg primary">
          <v-icon>fas fa-check</v-icon>
        </div>
        <span>全部选择</span>
      </div>

      <div class="clr-all tool-bar-action" @click="clearAll(userList)">
        <v-icon>fas fa-undo-alt</v-icon>
        <span>清除选择</span>
      </div>
    </div>

    <div id="list-item-parent">
      <transition-group
        v-on:beforeLeave="beforeListItemLeave"
        v-on:leave="listItemLeave"
        v-on:afterLeave="afterItemLeave">

      <div class="list-item-container" v-for="(person, index) in userList" :key="index" v-if="!person.deleted" >
        <div class="list-item">
          <div class="avatar" :style="userAvatarBg(person)"></div>
          <div class="item-body">
            <p> {{ person.nickname }} </p>
            <div class="meta-bar">
              <v-icon class="gender female" v-if="person.gender === 'female'">fas fa-venus</v-icon>
              <v-icon class="gender male" v-else>fas fa-mars</v-icon>
              <span> {{ person.age }}岁 </span>
            </div>
          </div>

          <div class="collasped-actions" :class="person.actionOn ? 'expanded' : ''">
            <div class="action">
              <v-icon color="green" @click="toogleApprove(person)">fas fa-check-circle</v-icon>
            </div>
            <div class="action">
              <v-icon color="red lighten-1" @click="decline(person)">far fa-times-circle</v-icon>
            </div>
          </div>

          <div class="fixed-actions" :class="person.actionOn ? 'no-border' : ''">
            <div class="action">
              <v-icon color="primary" v-if="!person.approved"
              :class="person.actionOn ? 'rotate-90' : ''"
              @click="toggleAction(person)">fas fa-ellipsis-h</v-icon>

              <v-icon color="green" v-else-if="person.approved && !person.actionOn"
              @click="toggleAction(person)">fas fa-check-circle</v-icon>

              <v-icon color="primary" v-if="person.approved && person.actionOn"
              :class="person.actionOn ? 'rotate-90' : ''"
              @click="toggleAction(person)">fas fa-ellipsis-h</v-icon>
            </div>
          </div>

        </div>
      </div>
      </transition-group>

      <div class="cus-btn-container" style="width: 210px; margin: 25px auto 25px auto">
        <v-btn flat dark class="cus-btn-solid btn-cus mx-0 my-0" @click="submitSelectedList">
          确认
        </v-btn>
      </div>

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
      type: Array,
      default () {
        return [
          {
            nickname: 'Name 1',
            gender: 'female',
            age: 22,
            uid: 1
          },
        ]
      }
    }
  },

  data () {
    return {
      // List of uid
      selectedUserList: []
    }
  },

  computed: {
    userList () {
      return this.users
    },

    listEmpty () {
      let result
      this.users.forEach(person => {
        result = person.deleted
      })
      return result
    }
  },

  methods: {
    userAvatarBg (person) {
      return `background-image: url("${ person.photoURL }")`
    },

    toggleAction (person) {
      if ('actionOn' in person === false) {
        this.$set(person, 'actionOn', true)
      } else {
        person.actionOn = !person.actionOn
      }
    },

    addUidToList (uid) {
      let userList = this.userList,
          selectedUserList = this.selectedUserList
      
      // check is uid already exists
      if (selectedUserList.length) {
        if ( !selectedUserList.includes(uid) ) {
          selectedUserList.push(uid)
        }
      } 
      // empty list -> add
      else {
        selectedUserList.push(uid)
      }
    },

    removeUidFromList (uid) {
      let userList = this.userList,
          selectedUserList = this.selectedUserList,
          index
      
      // check is uid already exists
      if (selectedUserList.length) {
        index = selectedUserList.indexOf(uid)

        if (index >= 0) {
          selectedUserList.splice(index, 1)
        }
      }
    },

    toogleApprove (person) {
      if ('approved' in person === false) {
        this.$set(person, 'approved', true)
        this.addUidToList(person.uid)
      } else {
        person.approved = !person.approved

        if (person.approved) {
          this.addUidToList(person.uid)
        } else {
          this.removeUidFromList(person.uid)
        }
      }

      person.actionOn = false
    },

    decline (person) {
      if ('deleted' in person === false) {
        this.$set(person, 'deleted', true)
      } else {
        person.deleted = true
      }
      this.removeUidFromList(person.uid)
      person.actionOn = false
    },

    selectAll (users) {
      users.forEach(person => {
        if ('approved' in person === false) {
          this.$set(person, 'approved', true)
        } else {
          person.approved = true
        }
        this.addUidToList(person.uid)
      })
    },

    clearAll (users) {
      users.forEach(person => {
        if ('approved' in person === false) {
          this.$set(person, 'approved', false)
        } else {
          person.approved = false
        }
        this.removeUidFromList(person.uid)
      })
    },

    submitSelectedList () {
      this.$emit('submit', this.selectedUserList)
    },

    // transition hook methods
    beforeListItemLeave (el) {
      let parent = findParent(el, 'list-item-parent'),
          child = el.firstElementChild

      parent.style.transition = ''
      parent.style.height = parent.scrollHeight + 'px'
      parent.style.transition = 'height 0.3s cubic-bezier(.95, .04, .55, .9)'

      el.style.height = el.scrollHeight + 'px'
      el.style.overflow = 'visible'
    },

    listItemLeave (el, done) {
      let child = el.firstElementChild,
          parent = findParent(el, 'list-item-parent'),
          parentNewHeight = parent.scrollHeight - el.scrollHeight

      Velocity(child, { translateX: '100px', opacity: 0 }, { 
        easing: 'ease-out',
        duration: 600
      })
      Velocity(el, { height: '0px' }, { 
        easing: 'ease',
        delay: 300,
        duration: 300,
      })
      Velocity(parent, { height: parentNewHeight + 'px' }, { 
        easing: 'ease',
        delay: 300,
        duration: 300, 
        complete: done 
      })
    },

    afterItemLeave (el) {
      el.style = ''
    },
  }
}
</script>

<style lang="scss">
#profile_dashboard .user-list-container {
  position: relative;
  overflow: hidden;

  .tool-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    padding: 0 10px;
    height: 40px;
    border-bottom: 1px solid #ffffff;

    .tool-bar-action {
      display: flex;
      align-items: center;

      .icon {
        font-size: 10px;
        color: #6480E6;
      }

      span {
        margin-left: 6px;
      }
    }


    // icon specific css
    .slt-all {
      .icon-bg {
        position: relative;
        width: 15px;
        height: 15px;
        border-radius: 3px;

        .icon {
          position: absolute;
          top: 2px;
          left: 1.5px;
          font-size: 9px;
          color: #ffffff;
        }
      }
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

      .collasped-actions {
        display: flex;
        flex-flow: row nowrap;
        position: absolute;
        right: 45px;
        width: 0px;
        max-width: 0px;
        height: 100%;
        visibility: hidden;
        opacity: 0;
        pointer-events: none;
        border-left: 1px solid #eeeeee;
        transition: all 0.2s ease-in-out;
        z-index: 1;

        .actions {
          width: 0px;
          opacity: 0;
        }

        &.expanded {
          width: 90px;
          max-width: 90px;
          visibility: visible;
          opacity: 1;
          pointer-events: auto;
          transition: all 0.3s cubic-bezier(0.42, 0, 0, 1.01);

          .action {
            width: 45px;
            opacity: 1;
          }
        }

      }

      .fixed-actions {
        display: flex;
        flex-flow: row nowrap;
        position: absolute;
        right: 0px;
        width: 45px;
        height: 100%;
        border-left: 1px solid #eeeeee;
        transition: all 0.2s ease-in-out;
        border-radius: 0 15px 15px 0;
        overflow: hidden;
        z-index: 2;

        &.no-border {
          border-left: 1px solid transparent;
        }
      }

      .action{
        flex: 0 0 45px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 45px;
        height: 100%;
        transition: all 0.3s ease-in-out;
        background: #ffffff;
        // transition-delay: 0.2s;

        .icon {
          font-size: 20px;

          &.rotate-90 {
            transform: rotate(90deg);
          }
        }
      }
    }
  }
}

</style>

