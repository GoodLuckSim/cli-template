import './public-path'
import Vue from 'vue'
import App from './App.vue'
import routes from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.scss'
import i18n from './i18n/index'

// element
Vue.use(Element, {
  size: 'medium'
})

// FuseUI
import FuseUI from '@fuse-oo/ui'
import '@fuse-oo/ui/lib/fuseUI.css'
Vue.use(FuseUI)

new Vue({
  el: '#app',
  routes,
  store,
  i18n,
  render: h => h(App)
})
