import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LayoutPages from '@/layout/LayoutPages.vue'
import { getToken } from '@/utils/token'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/register',
    component: () => import('@/views/register/Register.vue')
  },
  {
    path: '/',
    redirect: '/index',
    name: 'Index',
    component: LayoutPages,
    meta: {
      title: '首页',
      icon: 'house',
      isAuth: true
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/Index.vue'),
        meta: {
          title: '首页',
          icon: 'house',
          isAuth: true
        }
      }
    ]
  },
  {
    path: '/user',
    redirect: '/user/manager',
    name: 'User',
    component: LayoutPages,
    meta: {
      title: '用户管理',
      affix: true,
      icon: 'UserFilled',
      isAuth: true
    },
    children: [
      {
        path: 'manager',
        name: 'UserManager',
        component: () => import('@/views/user/User.vue'),
        meta: {
          title: '用户管理',
          icon: 'UserFilled',
          isAuth: true
        }
      }
    ]
  },
  {
    path: '/menu',
    redirect: '/menu/manager',
    name: 'Menu',
    component: LayoutPages,
    meta: {
      title: '菜管理',
      affix: true,
      icon: 'UserFilled',
      isAuth: true
    },
    children: [
      {
        path: 'manager',
        name: 'MenuManager',
        component: () => import('@/views/menu/Menu.vue'),
        meta: {
          title: '菜单管理',
          icon: 'UserFilled',
          isAuth: true
        }
      }
    ]
  },
  {
    path: '/stores',
    redirect: '/stores/Location',
    name: 'storesLocation',
    component: LayoutPages,
    meta: {
      title: '门店管理',
      icon: 'LocationInformation',
      isAuth: true
    },
    children: [
      {
        path: 'Location',
        name: 'storesLocation',
        component: () => import('@/views/storesLocation/StoresLocation.vue'),
        meta: {
          title: '门店管理',
          icon: 'LocationInformation',
          isAuth: true
        }
      }
    ]
  },
  {
    path: '/order',
    name: 'Order',
    component: LayoutPages,
    meta: {
      title: '订单管理',
      icon: 'Notebook',
      roles: ['admin', 'editor'],
      isAuth: true
    },
    children: [
      {
        path: 'orderQuery',
        name: 'orderQuery',
        component: () => import('@/views/orders/OrderQuery.vue'),
        meta: {
          title: '订单查询',
          icon: 'Notification',
          isAuth: true
        }
      },
      {
        path: 'orderAction',
        name: 'orderAction',
        component: () => import('@/views/orders/OrderAction.vue'),
        meta: {
          title: '订单处理',
          icon: 'Money',
          isAuth: true
        }
      }
    ]
  },
  {
    path: '/good',
    name: 'good',
    component: LayoutPages,
    meta: {
      title: '商品管理',
      icon: 'TakeawayBox',
      isAuth: true
    },
    children: [
      {
        path: 'category',
        name: 'category',
        component: () => import('@/views/goods/Goods.vue'),
        meta: {
          title: '商品种类',
          icon: 'ShoppingBag',
          isAuth: true
        }
      },
      {
        path: 'goodQuery',
        name: 'goodQuery',
        component: () => import('@/views/goods/Category.vue'),
        meta: {
          title: '商品查询',
          icon: 'SoldOut',
          isAuth: true
        }
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    component: LayoutPages,
    meta: {
      title: 'system',
      icon: 'Wallet',
      roles: ['admin', 'editor'],
      isAuth: true
    },
    children: [
      {
        path: 'account',
        name: 'account',
        component: () => import('@/views/system/Account.vue'),
        meta: {
          title: 'account',
          icon: 'User',
          roles: ['editor'],
          isAuth: true
        }
      },
      {
        path: 'group',
        name: 'group',
        component: () => import('@/views/system/Group.vue'),
        meta: {
          title: 'group',
          icon: 'Refrigerator',
          roles: ['admin'],
          isAuth: true
        }
      },
      {
        path: 'task',
        name: 'task',
        component: () => import('@/views/system/Task.vue'),
        meta: {
          title: 'account',
          icon: 'Clock',
          roles: ['editor'],
          isAuth: true
        }
      },
      {
        path: 'Setting',
        name: 'Setting',
        component: () => import('@/views/system/Setting.vue'),
        meta: {
          title: '系统设置',
          icon: 'Setting',
          roles: ['admin'],
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
