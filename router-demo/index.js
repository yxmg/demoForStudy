/**
 *Created by 夜雪暮歌 on 2019/6/9
 **/
const Foo = {
  template: '<div class="router--content router__foo">foo</div>',
  beforeRouteEnter: (to, from, next) => {
    console.log('beforeRouteEnter')
    next()
  },
  beforeRouteUpdate: (to, from, next) => {
    console.log('beforeRouteUpdate')
    next()
  },
  beforeRouteLeave(to, from, next) {
    const confirm = window.confirm('有未保存的变更，确认离开？')
    confirm ? next() : next(false)
  }
}
const Bar = {
  template: '<div class="router--content router__bar">bar</div>',
}

const routes = [
  {
    path: '/foo',
    name: 'foo',
    component: Foo,
    beforeEnter: (to, from, next) => {
      console.log('beforeEnter Foo')
      next()
    },
  },
  { path: '/bar', component: Bar },
]

const router = new VueRouter({
  // mode: 'history',
  routes, // (缩写) 相当于 routes: routes
  scrollBehavior(to, from, savedPosition) {
    // hash模式下一样可用
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
    // return { x: 0, y: 0 }
  }
})

// 导航守卫
router.beforeEach((to, from, next) => {
  console.log('beforeEach')
  next()
})
router.beforeResolve((to, from, next) => {
  console.log('beforeResolve')
  next()
})
router.afterEach((to, from) => {
  console.log('afterEach')
})

const app = new Vue({
  router,
  data: {
    transitionName: ''
  },
  watch: {
    '$route'(to, from) {
      this.transitionName = to.path === '/foo' ? 'slide-right' : 'slide-left'
    }
  }
}).$mount('#app')



