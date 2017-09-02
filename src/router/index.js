import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import SignUp from '@/components/SignUp'
import Dashboard from '@/components/Dashboard'
import * as VueGoogleMaps from 'vue2-google-maps'
import config from '../config'

const Cookie = require('js-cookie')
const Axios = require('axios')

Vue.Cookie = Cookie
Vue.prototype.$cookie = Cookie

Axios.defaults.headers.common['Accept'] = 'application/json'

Axios.defaults.headers.common['Authorization'] = Vue.Cookie.get('authorization') || config.BASE_AUTH

Vue.use(Router)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCe1exctmeJjIb4guyT6newSpyJ7kA3aLc',
    libraries: 'places'
  }
})

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/signup/:type',
      name: 'SignUp',
      component: SignUp
    },
    {
      path: '/dashboard/:type',
      name: 'Dashboard',
      component: Dashboard
    }
  ]
})
