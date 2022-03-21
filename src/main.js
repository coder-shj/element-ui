import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 引用富文本
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

// 引用树形表格组件  用之前应先下载插件npm install vue-table-with-tree-grid -save
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
// 添加拦截器************************************************************************
axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 全局注册 getTime过滤器
Vue.filter('getTime',function(time){
  var datetime = new Date(time);
  var yy = datetime.getFullYear();
  // padStart(位数，部位数字)
  var mm = (datetime.getMonth()+1+'').padStart(2,0);
  var dd = (datetime.getDate()+'').padStart(2,0);
  var hh = (datetime.getHours()+'').padStart(2,0);
  var ff = (datetime.getMinutes()+'').padStart(2,0);
  var ss = (datetime.getSeconds()+'').padStart(2,0);

  return `${yy}-${mm}-${dd} ${hh}:${ff}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
