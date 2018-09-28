<template>
  <div class="user-list-container">

    <div class="search-bar">
      <v-icon class="search-icon primary--text">fas fa-search</v-icon>
      <input type="text" class="search-input" placeholder="查找好友">
    </div>

    <div id="list-item-parent">
      <div class="list-item-container" v-for="(person, index) in userList" :key="index" v-if="!person.deleted" >
        <div class="list-item">
          <div class="avatar"></div>
          <div class="item-body">
            <p> {{ person.name }} </p>
            <div class="meta-bar">
              <v-icon class="gender female" v-if="person.gender === 'female'">fas fa-venus</v-icon>
              <v-icon class="gender male" v-else>fas fa-mars</v-icon>
              <span> {{ person.age }}岁 </span>
            </div>
          </div>

          <div class="fixed-actions">
            <div class="action">
              <v-icon color="primary" @click="toggleAction(person)">fas fa-ellipsis-h</v-icon>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
/* eslint-disable */

// exporting
export default {
  props: {
    users: {
      type: Array,
      default () {
        return [
          {
            name: 'Name 1',
            gender: 'female',
            age: 22,
            uid: 1
          },
          {
            name: 'Name 2',
            gender: 'male',
            age: 25,
            uid: 2
          },
          {
            name: 'Name 3',
            gender: 'female',
            age: 23,
            uid: 3
          }
        ]
      }
    }
  },

  data () {
    return {
      // 
    }
  },

  computed: {
    userList () {
      return this.users
    },
  },

  methods: {
    toggleAction (person) {
      this.$emit('submit', person.uid)
    }
  }
}
</script>

<style lang="scss">
#profile_friend .user-list-container {
  position: relative;
  overflow: hidden;

  .search-bar {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
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
    margin-top: 15px;
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

