import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export const router = [
  {
    path: '/index',
    component: () =>
      import('@/views/test/index'),
    name: 'a',
    meta: { title: 'test', icon: 'dashboard' },
    hidden: true,
    isSkipPermission: true
  }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  base: window.__POWERED_BY_QIANKUN__ ? '/moduleName' : '/',
  routes: router
})

const routers = createRouter()

export default routers
