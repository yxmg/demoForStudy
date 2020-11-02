import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import router from './router'
import ViewUI from 'view-design'

Vue.use(ViewUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
