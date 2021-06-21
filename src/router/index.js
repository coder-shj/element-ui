import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登录界面'
    }
  },
  {
    path: '/register',
    component: Register => import('views/Register.vue'),
    meta: {
      title: '注册界面'
    }
  },
  {
    path: '/findpassword',
    component: Find => import('views/Findpaw.vue'),
    meta: {
      title: '找回密码界面'
    }
  },
  {
    path: '/home',
    component: Home => import('views/Home.vue'),
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome => import('views/Welcome.vue')},
      { path: '/desktop', component: Desktop => import('views/Desktop') },
      { path: '/1', component: error => import('views/error') },
      { path: '/2', component: error => import('views/error') },
      { path: '/3', component: error => import('views/error') },
      { path: '/4', component: error => import('views/error') },
      { path: '/5', component: error => import('views/error') },
      { path: '/6', component: error => import('views/error') },
      { path: '/7', component: error => import('views/error') },
      { path: '/8', component: error => import('views/error') },
      { path: '/manner', component: Manner => import('views/Manner') }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login');
  next()
})

export default router
