import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LayoutPages from '@/layout/LayoutPages.vue'
import { getToken } from '@/utils/token'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/login/Login.vue')
  },
  // {
  //   path: '/register',
  //   component: () => import('@/views/register/Register.vue')
  // },
  {
    path: '/',
    name: 'home',
    component: LayoutPages,
    redirect: '/welcome',
    meta: {
      title: '首页',
      icon: 'house',
      isAuth: true
    },
    children: [
      {
        name: 'welcome',
        path: '/welcome',
        component: () => import('@/views/welcome/Welcome.vue'),
        meta: {
          title: '欢迎页',
          icon: 'house',
          isAuth: true
        }
      },
      {
        name: 'user',
        path: '/system/user',
        component: () => import('@/views/user/User.vue'),
        meta: {
          title: '用户管理',
          icon: 'UserFilled',
          isAuth: true
        }
      },
      {
        name: 'menu',
        path: '/system/menu',
        component: () => import('@/views/menu/Menu.vue'),
        meta: {
          title: '菜单管理',
          icon: 'UserFilled',
          isAuth: true
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})
// 路由守卫
// router.beforeEach((to, from, next) => {
//   const { isAuth } = to.meta
//   const token = getToken()
//   if (isAuth) {
//     if (token) {
//       next()
//     } else {
//       router.push({ path: '/login' })
//       // window.location.reload()
//     }
//   } else {
//     next()
//   }
// })

export default router
