<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  HomeOutlined,
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  LoginOutlined,
  MessageOutlined
} from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 菜单项
const menuItems = [
  { key: '/', label: '首页', icon: HomeOutlined }
]

// 管理员菜单
const adminMenuItems = [
  { key: '/admin/users', label: '用户管理', icon: UserOutlined },
  { key: '/admin/apps', label: '应用管理', icon: AppstoreOutlined },
  { key: '/admin/chatHistory', label: '对话管理', icon: MessageOutlined }
]

// 初始化时获取登录用户
onMounted(async () => {
  await authStore.fetchLoginUser()
})

// 菜单点击
function handleMenuClick(key: string) {
  router.push(key)
}

// 登出
async function handleLogout() {
  await authStore.logout()
  message.success('已退出登录')
  router.push('/')
}

// 跳转登录
function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#722ED1',
        borderRadius: 8
      }
    }"
  >
    <a-layout class="layout">
      <!-- 顶部导航 -->
      <a-layout-header class="header">
        <div class="header-content">
          <!-- Logo -->
          <div class="logo" @click="router.push('/')">
            <span class="logo-icon">🤖</span>
            <span class="logo-text">AI Code</span>
          </div>

          <!-- 菜单 -->
          <div class="menu">
            <a-space :size="24">
              <template v-for="item in menuItems" :key="item.key">
                <a class="menu-item" @click="handleMenuClick(item.key)">
                  <component :is="item.icon" />
                  {{ item.label }}
                </a>
              </template>
              <!-- 管理员菜单 -->
              <template v-if="authStore.isAdmin">
                <a-dropdown>
                  <a class="menu-item">
                    <SettingOutlined />
                    管理后台
                  </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item
                        v-for="item in adminMenuItems"
                        :key="item.key"
                        @click="handleMenuClick(item.key)"
                      >
                        <component :is="item.icon" />
                        {{ item.label }}
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </template>
            </a-space>
          </div>

          <!-- 用户信息 -->
          <div class="user-area">
            <template v-if="authStore.isAuthenticated">
              <a-dropdown>
                <a-space class="user-info">
                  <a-avatar :src="authStore.user?.userAvatar" :size="32">
                    {{ authStore.user?.userName?.charAt(0) || 'U' }}
                  </a-avatar>
                  <span class="user-name">{{ authStore.user?.userName || '用户' }}</span>
                </a-space>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="profile">
                      <UserOutlined />
                      个人中心
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="logout" @click="handleLogout">
                      <LogoutOutlined />
                      退出登录
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
            <template v-else>
              <a-button type="primary" @click="goToLogin">
                <LoginOutlined />
                登录
              </a-button>
            </template>
          </div>
        </div>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>

      <!-- 底部 -->
      <a-layout-footer class="footer">
        <div class="footer-content">
          <p>© 2026 AI Code. 一句话，呈所想 - 与 AI 对话轻松创建应用和网站</p>
        </div>
      </a-layout-footer>
    </a-layout>
  </a-config-provider>
</template>

<style scoped lang="less">
.layout {
  min-height: 100vh;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 0 24px;
  height: 64px;
  line-height: 64px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  
  .logo-icon {
    font-size: 28px;
    margin-right: 8px;
  }
  
  .logo-text {
    font-size: 20px;
    font-weight: 600;
    color: #722ED1;
  }
}

.menu {
  flex: 1;
  display: flex;
  justify-content: center;
}

.menu-item {
  color: #333;
  font-size: 15px;
  cursor: pointer;
  transition: color 0.3s;
  
  &:hover {
    color: #722ED1;
  }
}

.user-area {
  display: flex;
  align-items: center;
}

.user-info {
  cursor: pointer;
  
  .user-name {
    color: #333;
  }
}

.content {
  margin-top: 64px;
  min-height: calc(100vh - 64px - 70px);
}

.footer {
  background: #fafafa;
  text-align: center;
  padding: 24px;
}

.footer-content {
  color: #999;
  font-size: 14px;
}
</style>
