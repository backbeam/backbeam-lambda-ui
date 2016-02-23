import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const classes = {
  POST: 'success',
  DELETE: 'danger',
}

Vue.filter('apiMethodLabel', function (method) {
  return 'label-'+(classes[method] || 'primary')
})

import App from './components/App.vue'
import Home from './components/Home.vue'
import Api from './components/Api.vue'
import Dynamo from './components/Dynamo.vue'
import Lambda from './components/Lambda.vue'

var router = new VueRouter()
router.map({
  '/': {
    component: Home
  },
  '/api': {
    component: Api
  },
  '/dynamo': {
    component: Dynamo
  },
  '/lambda': {
    component: Lambda
  }
})
router.start(App, '#app')
