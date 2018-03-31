/* eslint-disable */
import * as firebase from 'firebase'

const Users = {
  state: {
    // local cache user
    user: null, // firebase user obj
    // user_basic: null, // basic info catch
  },
  getters: {},
  mutations: {
    // local user cache
    signInUser (state, user) {
      // user is firebase user obj
      state.user = user
      console.log('user logged in')
    },
    signOutUser (state) {
      state.user = null
      console.log('user signed out')
    }
  },
  actions: {
    // Create user account
    // Sign up account ONLY happens when user choose to signup with email and password
    // once finish, return new promise with resolved user object
    createUser (context, user) {
      return new Promise((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(user => resolve(user))
        .catch(error => {
          console.log(error)
        })
      })
    },

    // Create user database entry
    // When user choose to signup with email and password, a seperate user data will need to
    // record in the Users database, which provide a uniform user data format with the OAuth
    // users
    createDBUserEntry (context, user) {
      let userDBProfile = {}
      // user.providerData is an array with only one item
      user.providerData.forEach(profile => {
        Object.keys(profile).forEach(key => {
          userDBProfile[key] = user.providerData[0][key]
        })
        // NOTE: overwrite uid property
        // default uid from providerData is the email address, change to user.uid
        userDBProfile.uid = user.uid
      })
      // return a void promise
      return firebase.database().ref('users').child(userDBProfile.uid).set(userDBProfile)
    },

    // Check User existance
    // This will check if user exists in the user database
    checkDBUserEntry (context, user) {
      let hasUser
      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(user.uid).once('value')
        .then(ref => {
          if (ref.val() !== null) {
            resolve(hasUser = true)
          } else {
            resolve(hasUser = false)
          }
        })
        .catch(error => console.log(error))
      })
    },

    // Signin with Google account
    // This can do either sign up / sign in, for new user, will create the account in firebase
    // Will rediret to google login page, once signin successful, redirect back
    signInWithGoogle (context) {
      let provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().signInWithRedirect(provider)
    },
    // called on page loads when google signin finishes and redirects back
    onGoogleSigninRedirect (context) {
      return new Promise((resolve, reject) => {
        firebase.auth().getRedirectResult()
        .then(result => {
          // The signed-in user info.
          let user = result.user
          resolve(user)
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
      })
    },

    // Sign in using email and password with firebase
    // user snapshot is returned by promise
    signInUser (context, user) {
      return new Promise((resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(user => resolve(user))
        .catch(error => console.log(error))
      })
    },

    // Signout from firebase
    // local session cache cleared, return a promise
    signOutUser (context) {
      return new Promise((resolve, reject) => {
        firebase.auth().signOut()
        .then(() => resolve())
        .catch(error => console.log(error))
      })
    },

    // Update user profile
    // Used to update the users database
    // NOTE: user must be logged in
    updateUserProfile (context, profile) {
      if (!context.state.user) console.log('user not login')
      let uid = context.state.user.uid
      return new Promise((resolve, reject) => {
        firebase.database().ref('users').child(uid).update(profile)
        .then(() => resolve())
        .catch(error => console.log(error))
      })
    },

    // Upload user photot avatar
    // Will upload the photo to storage first, once get back the download url, then update users database with this link
    // the property name must be 'photoURL'
    // NOTE: user must login
    uploadUserAvatar (context) {
      if (!context.state.user) console.log('user not login')
      let uid = context.state.user.uid,
          file = context.rootState.flimage,
          name = file.name,
          fileExt = name.slice(name.lastIndexOf('.'))
      return new Promise((resolve, reject) => {
        firebase.storage().ref('users').child(uid).child('avatar/' + uid + fileExt).put(file)
        .then(snapshot => {
          let avatarUrl = snapshot.metadata.downloadURLs[0]
          return firebase.database().ref('users').child(uid).update({
            photoURL: avatarUrl
          })
        })
        .then(() => resolve())
        .catch(error => console.log(error))
      })
    }

    // updateUserProfile (context, profile) {
    //   if (!context.state.user) return
    //   context.state.user.updateProfile({
    //     displayName: profile.displayName || '',
    //     photoURL: profile.photoURL || ''
    //   })
    // },

    // // user profile update
    // updateUserInfo (context, userInfo) {
    //   let uid = context.state.user.uid
    //   let avatarUrl

    //   context.commit('setLoading', true)

    //   return new Promise((resolve, reject) => {
    //     // parse the file ext
    //     if (context.state.flimage) {
    //       let file = context.state.flimage
    //       let name = file.name
    //       let fileExt = name.slice(name.lastIndexOf('.'))

    //       firebase.storage().ref('users').child(uid).child('avatar/' + uid + fileExt).put(file)
    //       .then(snapshot => {
    //         avatarUrl = snapshot.metadata.downloadURLs[0]
    //         return firebase.database().ref('users').child(uid).update({
    //           avatar: avatarUrl
    //         })
    //       })
    //       .then(() => {
    //         context.commit('updateUserInfo', {
    //           avatar: avatarUrl
    //         })
    //         context.commit('clearFileLoaderCache')
    //         console.log('Avatar Uploaded')
    //       })
    //       .catch(error => console.log(error))
    //     }

    //     firebase.database().ref('users').child(uid).update(userInfo)
    //     .then(() => {
    //       context.commit('updateUserInfo', userInfo)
    //       context.commit('setLoading', false)
    //       resolve()
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    //   })
    // },

  }
}

export default Users