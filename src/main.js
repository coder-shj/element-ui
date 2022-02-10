import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 引用树形表格组件
import tree from 'vue-table-with-tree-grid'
Vue.component('tree',tree)

// 导入字体图标
import 'assets/fonts/iconfont.css'

// 导入全局样式表
import 'assets/css/global.css'

Vue.config.productionTip = false

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
// 添加拦截器***********************************************************************************************************************
axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
