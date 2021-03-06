// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
require('vuetify/src/stylus/app.styl')
require('mdi/css/materialdesignicons.min.css')
require('vue2-animate/dist/vue2-animate.min.css')
require('move-js/move.min.js')
import('../node_modules/vuetify/dist/vuetify.min.css')
//import 'vue-material-design-icons/styles.css'


Vue.use(Vuetify)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
