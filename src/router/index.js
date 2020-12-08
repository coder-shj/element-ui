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
    component: Login
  },
  {
    path: '/home',
    component: Home => import('views/Home.vue'),
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome => import('views/Welcome.vue')},
      { path: '/users', component: user => import('views/user/User') }
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
