/* eslint-disable */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

// import vuex store
import {store} from './store'

// import filters
import DateFilter from './filter/date.js'


// init firebase
import firebaseConfig from './firebase.js'
import * as firebase from 'firebase'
firebase.initializeApp(firebaseConfig)

// Init google map
import initMap from './plugins/googleMapsInit.js'
import GoogleMapsAPIKey from './googlemapsapi.js'

// Vue.use(initMap, {
//   key: GoogleMapsAPIKey.key,
//   libraries: 'geometry,places'
// })


// Velocity Animation
import velocity from 'velocity-animate'
Vue.prototype.$velocity = velocity

// import Utils functions
import utils from './plugins/utils.js'
Vue.prototype.$utils = utils

// Theme Colors
const ThemeColors = {
  // primary: '#1976D2',
  primary: '#6480E6',
  secondary: '#424242',
  accent: '#82B1FF',
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107'
}

Vue.use(Vuetify, {
  theme: ThemeColors
})

Vue.filter('DateFilter', DateFilter)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
