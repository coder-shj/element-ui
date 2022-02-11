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
      { path: '/welcome', component: welcome => import('components/content/Welcome.vue')},
      { path: '/users', component: user => import('views/user/User') },
      { path: '/rights', component: rights => import('views/power/Rights')},
      { path: '/roles', component: roles => import('views/power/Roles') },
      { path: '/goods', component: goods => import('views/goods/Goods') },
      { path: '/params', component: params => import('views/goods/Params') },
      { path: '/categories', component: categories => import('views/goods/Categories') },
      { path: '/goods/add', component: Add => import('views/goods/Add') }
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
