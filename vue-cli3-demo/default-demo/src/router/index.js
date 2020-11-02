import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/component-list',
    name: 'componentList',
    component: () => import('@/views/component-list/index')
  }
]

const createRouter = () => new Router(
  {
    scrollBehavior: () => ({ y: 0 }),
    routes: routes
  }
)

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
