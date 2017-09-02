// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

var EventBus = new Vue()

Vue.config.productionTip = false

Vue.mixin({
  data: function () {
    return {
      Bus: EventBus
    }
  }
})

/* eslint-disable no-new */
var root = new Vue({
  router,
  template: '<App/>',
  components: { App }
})

document.addEventListener('DOMContentLoaded', function () {
  root.$mount('#app')
})
