
// /* eslint-disable */
// import * as firebase from 'firebase'

// const notification = {
//   state: {},
//   getters: {},
//   mutations: {},
//   actions: {
//     watchNotification (context, user) {
//       firebase.database().ref('notifications').on('value', (snapshot) => {
//         let notification = snapshot.val()
//         if (user.uid === notification.to) {
//           console.log('You received a notification', notification)
//         }
//       })
//     }
//   }
// }

// export default notification