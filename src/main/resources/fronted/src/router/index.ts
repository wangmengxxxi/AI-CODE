import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 布局组件
import BasicLayout from '@/layouts/BasicLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

// 路由配置
const routes: RouteRecordRaw[] = [
  // 基础布局路由
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'editor/:id',
        name: 'editor',
        component: () => import('@/views/Editor.vue'),
        meta: { title: '编辑器', requiresAuth: true }
      },
      {
        path: 'app/edit/:id',
        name: 'appEdit',
        component: () => import('@/views/AppEdit.vue'),
        meta: { title: '应用编辑', requiresAuth: true }
      },
      // 管理员路由
      {
        path: 'admin/users',
        name: 'adminUsers',
        component: () => import('@/views/admin/Users.vue'),
        meta: { title: '用户管理', requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'admin/apps',
        name: 'adminApps',
        component: () => import('@/views/admin/Apps.vue'),
        meta: { title: '应用管理', requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'admin/chatHistory',
        name: 'adminChatHistory',
        component: () => import('@/views/admin/ChatHistory.vue'),
        meta: { title: '对话管理', requiresAuth: true, requiresAdmin: true }
      }
    ]
  },
  // 空白布局路由（登录/注册）
  {
    path: '/login',
    component: BlankLayout,
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/views/Login.vue'),
        meta: { title: '登录' }
      }
    ]
  },
  {
    path: '/register',
    component: BlankLayout,
    children: [
      {
        path: '',
        name: 'register',
        component: () => import('@/views/Register.vue'),
        meta: { title: '注册' }
      }
    ]
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 设置页面标题
  document.title = (to.meta.title as string) ? `${to.meta.title} - AI Code` : 'AI Code'

  // 如果未获取过登录用户，先获取
  if (!authStore.user) {
    await authStore.fetchLoginUser()
  }

  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.isAdmin

  // 需要登录
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  // 需要管理员权限
  if (to.meta.requiresAdmin && !isAdmin) {
    return next('/')
  }

  // 已登录用户访问登录/注册页，跳转首页
  if (isAuthenticated && (to.path === '/login' || to.path === '/register')) {
    return next('/')
  }

  next()
})

export default router
