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
      import('@/views/moduleName/index'),
    name: 'a',
    meta: { title: 'moduleName', icon: 'dashboard' },
    hidden: true,
    isSkipPermission: true
  }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  base: window.__POWERED_BY_QIANKUN__ ? '/moduleName' : '/',
  routes: router
})
// const routers = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
