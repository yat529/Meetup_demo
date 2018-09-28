/* eslint-disable */
import Vue from 'vue'
import * as firebase from 'firebase'

const group = {
  state: {
    type: ['public', 'personal', 'private'],
    typeCN: ['公开', '半公开', '私人'],
    category: [
      '美食', '运动', '学习', '聊天', '摄影', '游戏', '旅游', '休闲活动'
    ],
    // tag: [

    // ],

    loadedGroup: null,
    loadedPlanList: null,
    loadedPlanItem: null,
    loadedScheduleList: null,
    loadedScheduleItem: null,
    loadedGroupTodoList: null,
    loadedUserTodoList: null,
  },
  getters: {},
  mutations: {
    // loaded group
    setLoadedGroup (state, group) {
      state.loadedGroup = group
    },
    resetLoadedGroup (state) {
      state.loadedGroup = null
    },


    // loaded Plan list
    setLoadedPlanList (state, planList) {
      state.loadedPlanList = planList
    },
    resetLoadedPlanList (state) {
      state.loadedPlanList = null
    },


    // loaded Plan Item
    setLoadedPlanItem (state, planItem) {
      state.loadedPlanItem = planItem
    },
    resetLoadedPlanItem (state) {
      state.loadedPlanItem = null
    },


    // Loaded Schedule List
    setLoadedScheduleList (state, scheduleList) {
      state.loadedScheduleList = scheduleList
    },
    resetLoadedScheduleList (state) {
      state.loadedScheduleList = null
    },


    // Loaded Schedule Item
    setLoadedScheduleItem (state, scheduleItem) {
      state.loadedScheduleItem = scheduleItem
    },
    resetLoadedScheduleItem (state) {
      state.loadedScheduleItem = null
    },


    // Loaded Group todo list
    setLoadedGroupTodoList (state, list) {
      state.loadedGroupTodoList = list
    },
    resetLoadedGroupTodoList (state) {
      state.loadedGroupTodoList = null
    },


    // loaded User todo list
    setLoadedUserTodoList (state, list) {
      state.loadedUserTodoList = list
    },
    resetLoadedUserTodoList (state) {
      state.loadedUserTodoList = null
    },


  },
  actions: {

    /* 
      load Meetups for meetups page
    */
    // load meetups from firebase, return a promise
    fetchMeetups (context) {
      let meetups = []
      return new Promise((resolve, reject) => {
        firebase.database().ref('meetups').once('value')
        .then(snapshots => {
          snapshots.forEach(snapshot => {
            let meetup = snapshot.val()
            meetup.key = snapshot.key
            meetups.push(meetup)
          })
          resolve(meetups)
        })
        .catch(error => {
          console.log(error)
        })
      })
    },

    fetchOrderedMeetups (context) {
      let meetups = []
      
      firebase.database().ref('users').orderByChild('email').equalTo('asd@asd.com').on('child_added', snapshots => {
        let meetup = snapshots.val()
        meetup.key = snapshots.key
        meetups.push(meetup)
        console.log(meetups)
      })
    },



    // Watch created meetup
    // - 
    // watchUserCreatedMeetup (context) {
    //   let curr_user = context.rootState.userModule.user_ref || firebase.auth().currentUser,
    //       curr_uid = curr_user.uid

    //   firebase.database().ref('users').child(curr_uid).child('createdMeetups')
    // },

    
    // Create meetup
    // Used by create mitwan module ******
    createMitwan (context, mitwan) {
      let key, file, imageURL

      return new Promise((resolve, reject) => {
        // context.commit('setLoading', true)
        firebase.database().ref('groups').push(mitwan)
        .then(ref => {
          key = ref.key
          file = context.rootState.flimage
          imageURL = context.rootState.flimageTempUrl || ''

          // check for uploaded file
          if (file && imageURL) {
            let filename = file.name
            // fileExt = filename.slice(filename.lastIndexOf('.'))
            // upload the file
            firebase.storage().ref('groups/' + key + '/cover_image').child(filename).put(file)
            .then(snapshot => {
              // get the image url in firebase storage
              imageURL = snapshot.metadata.downloadURLs[0]
              return firebase.database().ref('groups/' + key).update({ image_url: imageURL })
            })
          } 
          // if online image urls
          else if (!file && imageURL) {
            return firebase.database().ref('groups/' + key).update({ image_url: imageURL })
          }
        })
        .then(() => {
          return firebase.database().ref('users').child(mitwan.uid).child('created_groups').child(key).set(true)
        })
        .then(() => {

          // context.commit('setPopupMsg', {
          //   type: 'success',
          //   title: '小组创建成功',
          //   content: '你可以在账户信息页面中我发起的小组里查看'
          // })
          resolve(key)
        })
        .catch(error => {
          // context.commit('setPopupMsg', {
          //   type: 'error',
          //   title: '小组创建失败',
          //   content: error
          // })
          console.log(error)
          reject(error)
        })
      })
    },

    registerMeetup (context, {meetup_key, target_user}) {
      let userObj = {
        uid: target_user.uid,
        nickname: target_user.nickname,
        photoURL: target_user.photoURL,
        sex: target_user.sex
      }

      return new Promise((resolve, reject) => {
        firebase.database().ref('meetups').child(meetup_key).child('registeredMembers').child(target_user.uid).set(userObj)
        .then(() => {
          return firebase.database().ref('users').child(target_user.uid).child('registeredMeetups').child(meetup_key).set(true)
        })
        .then(() => {
          resolve()
        })
        .catch(error => {
          console.log(error)
        })
      })
    },

    unregisterMeetup (context, meetup) {
      let uid = context.rootState.userModule.user.uid,
          key = meetup.key

      return new Promise((resolve, reject) => {
        firebase.database().ref('meetups').child(key).child('registeredMembers').child(uid).remove()
        .then(() => {
          return firebase.database().ref('users').child(uid).child('registeredMeetups').child(key).remove()
        })
        .then(() => resolve())
        .catch(error => console.log(error))
      })
    },

    unregisterMember (context, {target_uid, meetup_key}) {
      // let uid = context.rootState.userModule.user.uid
      let type = 'delete_member',
          status = null

      return new Promise((resolve, reject) => {
        firebase.database().ref('meetups').child(meetup_key).child('registeredMembers').child(target_uid).remove()
        .then(() => {
          // show popupMsg
          context.commit('setPopupMsg', {
            type: 'success',
            title: '已移除成员',
            content: '此用户将从这个小组的人员名单里去除'
          })
          return firebase.database().ref('users').child(target_uid).child('registeredMeetups').child(meetup_key).remove()
        })
        .then(() => {
          // send notification to target_uid
          context.dispatch('sendNotificationMessage', {target_uid, type, status})
          resolve()
        })
        .catch(error => {
          context.commit('setPopupMsg', {
            type: 'error',
            title: '移除成员失败',
            content: error
          })
          console.log(error)
        })
      })
    },

    /* 
      Profile Group Page
    */

    // Fetch single meetup
    // Used by Profile/group index.vue
    // fetch group @ create hook
    fetchGroup (context, group_key) {
      return new Promise((resolve, reject) => {
        firebase.database().ref('groups').child(group_key).once('value')
        .then(snapshot => {
          let group = snapshot.val()
          group.key = snapshot.key
          resolve(group)
        })
        .catch(error => console.log(error))
      })
    },

    // Watch Group Page under Profile
    // Used by Profile/group index.vue
    // watch group @ create hook
    // create a {loadedProfileGroup} object in group module state
    watchGroup (context, group_key) {
      let ref = 'groups/' + group_key
      firebase.database().ref(ref).on('value', (data) => {
        let loadedGroup = data.val()
        loadedGroup.key = data.key
        context.commit('setLoadedGroup', loadedGroup)
      })
    },

    stopWatchGroup (context, group_key) {
      let ref = 'groups/' + group_key
      firebase.database().ref(ref).off('value', () => {
        context.commit('resetLoadedGroup')
      })
    },


    // test todo
    createPlan (context, plan) {
      let group_key = '-LHuqbEyJqQ_rU72c7TW',
          plan_ref = 'groups/' + group_key + '/trip_plan'

      return new Promise((resolve, reject) => {

        firebase.database().ref(plan_ref).push({
          date: '2018-08-10',
          content: plan,
          schedule_id: '',
          schedule_count: ''
        })
        .then(ref => {
          resolve(ref)
        })

      })
    },

    createSchedule (context, {schedule, plan_key}) {
      let group_key = '-LHuqbEyJqQ_rU72c7TW',
          schedule_ref =  'groups/' + group_key + '/trip_schedule/' + plan_key 

      return new Promise((resolve, reject) => {

        firebase.database().ref(schedule_ref).push({
          time: '8:10',
          content: schedule,
          todo_id: '',
          todo_count: '',
          location_count: '5'
        })
        .then(ref => {
          resolve(ref)
        })

      })
    },

    createTodo (context, {todo, plan_key, schedule_key, member}) {
      let group_key = '-LHuqbEyJqQ_rU72c7TW',
          todo_ref =  'groups/' + group_key + '/trip_todo/' + plan_key + '/' + schedule_key

      return new Promise((resolve, reject) => {
        firebase.database().ref(todo_ref).push({
          content: todo,
        })
        .then(ref => {
          ref.child('complete').set(member)
          resolve(ref)
        })
      })
    },

    fetchSchedule (context, {group_key, trip_plan_key}) {
      let ref = 'groups/' + group_key + '/trip_schedule/' + trip_plan_key

      return new Promise((resolve, reject) => {
        firebase.database().ref(ref).once('value')
        .then(snapshot => {
          let scheduleList = []

          snapshot.forEach(child => {
            let listItem = child.val()
            listItem.key = child.key
            scheduleList.push(listItem)
          })

          resolve(scheduleList)
        })
        .catch(error => console.log(error))
      })
      
    },

    /* 
      watch Group Plan list
    */

    watchPlanList (context, group_key) {
      let ref = 'groups/' + group_key + '/trip_plan/'
      firebase.database().ref(ref).on('value', data => {
        let loadedPlanList = []
        data.forEach(child => {
          let planItem = child.val()
          planItem.key = child.key
          loadedPlanList.push(planItem)
        })
        context.commit('setLoadedPlanList', loadedPlanList)
      })
    },

    stopWatchPlanList (context, group_key) {
      let ref = 'groups/' + group_key + '/trip_plan/'
      firebase.database().ref(ref).off('value', () => {
        context.commit('resetLoadedPlanList')
      })
    },

    /* 
      watch Group Schedule list
    */
    // watch the schedule list of current loaded trip plan
    // prepare the [loadedScheduleList] Array

    watchScheduleList (context, {group_key, trip_plan_key}) {
      let ref = 'groups/' + group_key + '/trip_schedule/' + trip_plan_key
      firebase.database().ref(ref).on('value', data => {
        let loadedScheduleList = []
        data.forEach(child => {
          let scheduleItem = child.val()
          scheduleItem.key = child.key
          loadedScheduleList.push(scheduleItem)
        })
        context.commit('setLoadedScheduleList', loadedScheduleList)
      })
    },

    stopWatchScheduleList (context, {group_key, trip_plan_key}) {
      let ref = 'groups/' + group_key + '/trip_schedule/' + trip_plan_key
      firebase.database().ref(ref).off('value', () => {
        context.commit('resetLoadedScheduleList')
      })
    },


    /* 
      watch Group Todo list
    */

    watchTodoList (context, {group_key, trip_plan_key, trip_schedule_key}) {
      let ref = '/trip_todo/' + trip_plan_key + '/' + trip_schedule_key,
          uid = firebase.auth().currentUser.uid,
          mutationNames = ['setLoadedGroupTodoList', 'setLoadedUserTodoList'],
          ref_group = 'groups/' + group_key + ref, 
          ref_user = 'users/' + uid + ref

      // watch Group todo
      firebase.database().ref(ref_group).on('value', data => {
        let groupTodoList = []

        data.forEach(child => {
          let todoItem = child.val()
          todoItem.key = child.key
          groupTodoList.push(todoItem)
        })

        context.commit(mutationNames[0], groupTodoList)
      })

      // watch User todo
      firebase.database().ref(ref_user).on('value', data => {
        let userTodoList = []

        data.forEach(child => {
          let todoItem = child.val()
          todoItem.key = child.key
          userTodoList.push(todoItem)
        })

        context.commit(mutationNames[1], userTodoList)
      })

    },

    stopWatchTodoList (context, {group_key, trip_plan_key, trip_schedule_key}) {
      let ref = '/trip_todo/' + trip_plan_key + '/' + trip_schedule_key,
          uid = firebase.auth().currentUser.uid,
          mutationNames = ['resetLoadedGroupTodoList', 'resetLoadedUserTodoList'],
          ref_group = 'groups/' + group_key + ref, 
          ref_user = 'users/' + uid + ref

      firebase.database().ref(ref_group).off('value')
      context.commit(mutationNames[0])

      firebase.database().ref(ref_user).off('value')
      context.commit(mutationNames[1])
    },

    handleTodoItem (context, {action, type, group_key, trip_plan_key, trip_schedule_key, trip_todo_key = null, content = null}) {
      // ref url base
      let ref = '/trip_todo/' + trip_plan_key + '/' + trip_schedule_key + '/',
          uid = firebase.auth().currentUser.uid

      if (type === 'group') {
        ref = 'groups/' + group_key + ref 
      } else if (type === 'user') {
        ref = 'users/' + uid + ref
      }

      // toggle todo
      if (action === 'check' || action === 'uncheck') {

        if (type === 'group') {
          ref = ref + trip_todo_key + '/complete/' + uid + '/complete'
        } else if (type === 'user') {
          ref = ref + trip_todo_key + '/complete/'
        }

        context.dispatch('toogleTodoItemCheck', {
          action: action, 
          ref: ref
        })
      }

      // add new todo
      else if (action === 'add') {
        context.dispatch('addTodoItem', {
          type: type,
          content: content,
          ref: ref
        })
      }

      // delete todo
      else if (action === 'delete') {
        ref = ref + trip_todo_key
        console.log(trip_todo_key)
        context.dispatch('deleteTodoItem', ref)
      }

      // update todo
      else if (action === 'update') {
        ref = ref + trip_todo_key

        context.dispatch('updateTodoItem', {
          content: content,
          ref: ref
        })
      }
    },

    toogleTodoItemCheck (context, {action, ref}) {
      let bol = action === 'check' ? true : false

      firebase.database().ref(ref).set(bol)
    },

    addTodoItem (context, {type, content, ref, members = null}) {
      let complete

      if (type === 'user') {
        complete = false
                
      } else if (type === 'group') {
        // members object format
        // members = {
        //   udoiaudoaisduod: {
        //     nickname: 'asd',
        //     photoURL: 'https://adasda.com/adakdja.png',
        //     uid: 'udoiaudoaisduod'
        //   },
        //   ...
        // }

        let memberCompleteObj = {}
        // Object.keys(members).forEach(member_uid => {
        //   memberCompleteObj[member_uid] = members[member_uid]
        //   memberCompleteObj[member_uid].complete = false
        // })

        complete = memberCompleteObj
      }

      return new Promise((resolve, reject) => {    
        firebase.database().ref(ref).push({
          complete: complete,
          content: content
        })
        .then(snapshot => {
          let key = snapshot.key
          console.log(key)
          resolve(key)
        })
        .catch(error => console.log(error))
      })
    },

    updateTodoItem (context, {content, ref}) {
      return new Promise((resolve, reject) => { 
        firebase.database().ref(ref).update({content: content})
        .then(() => resolve())
        .catch(error => console.log(error))
      })
    },

    deleteTodoItem (context, ref) {
      return new Promise((resolve, reject) => {
        firebase.database().ref(ref).remove()
        .then(() => resolve())
        .catch(error => console.log(error))
      })
    },


    /* 
      Update Meetup from Individual Components
    */

    // update date and time
    updateMeetupDateTime (context, {meetup_key, date, time}) {
      return firebase.database().ref('meetups').child(meetup_key).update({
        date: date,
        time: time
      })
      .catch(error => console.log(error))
    },
    // update location object
    updateMeetupAddress (context, {meetup_key, location}) {
      return firebase.database().ref('meetups').child(meetup_key).update({
        location: location
      })
      .catch(error => console.log(error))
    },
    // update title
    updateMeetupTitle (context, {meetup_key, title}) {
      return firebase.database().ref('meetups').child(meetup_key).update({
        title: title
      })
      .catch(error => console.log(error))
    },
    // update content
    updateMeetupContent (context, {meetup_key, description}) {
      return firebase.database().ref('meetups').child(meetup_key).update({
        description: description
      })
      .catch(error => console.log(error))
    },


    /* 
      Delete meetup
      NOTE: Four locations to delete
            1. Delete the meetup key from each registeredMember's registeredMeetups
            2. Delete the meetup key from organizer's createdMeetups
            3. Delete the meetup from meetups db
            4. Delete meetup image from storage
    */
    deleteMeetup (context, meetup_key) {
      let curr_user = context.rootState.userModule.user_ref || firebase.auth().currentUser

      return new Promise((resolve, reject) => {
        // delete from registeredMember's registeredMeetups
        firebase.database().ref('meetups').child(meetup_key).child('registeredMembers').once('value')
        .then(snapshot => {
          let targets = snapshot.val(),
              promiseArray = []

          if (targets) {
            for (let uid in targets) {
              let result = new Promise((resolve, reject) => {        
                firebase.database().ref('users').child(uid).child('registeredMeetups').child(meetup_key).remove()
                .then(() => {
                  // send notification
                  return context.dispatch('sendNotificationMessage', {
                    target_uid: uid, 
                    type: 'group_dismissed', 
                    status: 'deleted'
                  })
                  .then(() => {
                    resolve()
                  })
                  .catch(error => reject(error))
                })
              })
              promiseArray.push(result)
            }
          }
          return Promise.all(promiseArray)
        })
        // delete from organizer's createdMeetups
        .then(() => {
          return firebase.database().ref('users').child(curr_user.uid).child('createdMeetups').child(meetup_key).remove()
        })
        // delete from meetups db
        .then(() => {
          return firebase.database().ref('meetups').child(meetup_key).remove()
        })
        .then(() => {
          // delete image in storage if exists
          return firebase.storage().ref('meetups').child(meetup_key).delete()
        })
        // set popup msg
        .then(() => {
          context.commit('setPopupMsg', {
            type: 'success',
            title: '小组删除成功',
            content: '我们已将此小组从你的数据库中删除, 并通知了所有小组成员'
          })
          resolve()
        })
        .catch(error => console.log(error))
      })
    }
  }
}

export default group