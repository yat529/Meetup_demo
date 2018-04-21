/* eslint-disable */
import * as firebase from 'firebase'

const notification = {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    /* 
      Send new notification message to request sender
      Step 1: Once request receiver process the request, then create this msg at the new_message node address to the sender in db
      Step 2: Request send dismiss the message, and then this message is removed from the db
      NOTE: 
      type MUST BE either ['new_friend', 'new_member']
      status MUST BE either ['approved', 'rejected']
      message is an object with title and content property
    */

    sendNotificationMessage (context, {target_uid, type, status}) {
      let sender = context.rootState.userModule.user_ref,
          message

      if (!sender) {
        sender = firebase.auth().currentUser
      }

      message = msg(type, status, sender.nickname)

      return firebase.database().ref('notifications/new_message').child(target_uid).push({
        uid: sender.uid,
        nickname: sender.nickname,
        photoURL: sender.photoURL,
        message: message
      })

      // helper 
      function msg (type, status, senderName) {
        const types = ['new_friend', 'new_member', 'new_invitation', 'delete_friend', 'delete_member', 'group_dismissed'],
              typeNames = ['好友申请', '组队申请', '组队邀请', '朋友圈', '参与的小组', '参与的小组'],
              statusTypes = ['approved', 'rejected', 'deleted']
              
        let msg = {}

        if (type === types[0]) {
          msg.title = `你的${typeNames[0]}有了新的进展`
          if (status === statusTypes[0]) {
            msg.type = 'success'
            msg.content = `太棒了! ${senderName}已经通过了你的${typeNames[0]},现在你们可以一起愉快的玩耍啦`
          } else if (status === statusTypes[1]) {
            msg.type = 'warning'
            msg.content = `悲剧了! ${senderName}并没有通过了你的${typeNames[0]}.试试换个Cool一点的头像,或者丰富你的个人档案,或许会更有帮助`
          }
        } else if (type === types[1]) {
          msg.title = `你的${typeNames[1]}有了新的进展`
          if (status === statusTypes[0]) {
            msg.type = 'success'
            msg.content = `太棒了! ${senderName}已经通过了你的${typeNames[1]},现在你们可以一起愉快的玩耍啦`
          } else if (status === statusTypes[1]) {
            msg.type = 'warning'
            msg.content = `悲剧了! ${senderName}并没有通过了你的${typeNames[1]}.试试换个Cool一点的头像,或者丰富你的个人档案,或许会更有帮助`
          }
        } else if (type === types[2]) {
          msg.title = `你的${typeNames[2]}有了新的进展`
          if (status === statusTypes[0]) {
            msg.type = 'success'
            msg.content = `太棒了! ${senderName}已经通过了你的${typeNames[2]},现在你们可以一起愉快的玩耍啦`
          } else if (status === statusTypes[1]) {
            msg.type = 'warning'
            msg.content = `悲剧了! ${senderName}并没有通过了你的${typeNames[2]}.你们可以互相diss了`
          }
        } else if (type === types[3]) {
          msg.title = `你的${typeNames[3]}出现了波动`
          msg.type = 'warning'
          msg.content = `亲! ${senderName}跟你友尽了, 你的朋友名单已把他踢除`
        } else if (type === types[4]) {
          msg.title = `你${typeNames[4]}出现了波动`
          msg.type = 'warning'
          msg.content = `亲! ${senderName}已将你从小组里踢出`
        } else if (type === types[5]) {
          msg.title = `你${typeNames[5]}已经解散了`
          msg.type = 'warning'
          msg.content = `亲! ${senderName}已将小组解散, 我们已将此小组从你参与的小组列表中删除`
        }

        return msg
      }
    },

    // remove the mssage from the db once request sender dismiss the msg
    dismissNotificationMessage (context, msg_key) {
      let user = context.rootState.userModule.user_ref
      firebase.database().ref('notifications/new_message').child(user.uid).child(msg_key).remove()
      .then(() => {
        console.log('msg removed')
      })
      .catch(error => console.log(error))
    },
  }
}

export default notification