<template>
  <a-layout class="basic-layout">
    <!-- Header -->
    <a-layout-header class="header">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo" @click="router.push('/')">
          <span class="logo-icon">🤖</span>
          <span class="logo-text">AI Code</span>
        </div>

        <!-- Navigation Menu -->
        <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="horizontal"
          theme="dark"
          class="nav-menu"
        >
          <a-menu-item key="home" @click="router.push('/')">
            <template #icon><HomeOutlined /></template>
            首页
          </a-menu-item>
          <a-menu-item key="workspace" @click="router.push('/workspace')">
            <template #icon><CodeOutlined /></template>
            工作台
          </a-menu-item>
          <a-menu-item key="knowledge" @click="router.push('/knowledge')">
            <template #icon><DatabaseOutlined /></template>
            知识库
          </a-menu-item>
          <!-- 管理员菜单 -->
          <a-sub-menu v-if="userStore.isAdmin" key="admin">
            <template #icon><SettingOutlined /></template>
            <template #title>管理</template>
            <a-menu-item key="admin-users" @click="router.push('/admin/users')">
              <TeamOutlined />
              <span style="margin-left: 8px">用户管理</span>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>

        <!-- User Info -->
        <div class="user-section">
          <a-dropdown v-if="userStore.isLoggedIn">
            <div class="user-info">
              <a-avatar :src="userStore.userAvatar" :size="32" />
              <span class="username">{{ userStore.displayName }}</span>
              <DownOutlined />
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile" @click="router.push('/profile')">
                  <UserOutlined />
                  <span style="margin-left: 8px">个人中心</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined />
                  <span style="margin-left: 8px">退出登录</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-button v-else type="primary" @click="router.push('/login')">
            登录
          </a-button>
        </div>
      </div>
    </a-layout-header>

    <!-- Main Content -->
    <a-layout-content class="content">
      <slot></slot>
    </a-layout-content>

    <!-- Footer -->
    <a-layout-footer class="footer">
      AI Code Platform ©2026 - 智能代码生成 & RAG 知识库
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  HomeOutlined,
  CodeOutlined,
  DatabaseOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const selectedKeys = ref<string[]>(['home'])

// 根据路由更新选中菜单
watch(
  () => route.path,
  (path) => {
    if (path === '/' || path === '/home') {
      selectedKeys.value = ['home']
    } else if (path.startsWith('/workspace')) {
      selectedKeys.value = ['workspace']
    } else if (path.startsWith('/knowledge')) {
      selectedKeys.value = ['knowledge']
    } else if (path.startsWith('/admin')) {
      selectedKeys.value = ['admin-users']
    }
  },
  { immediate: true },
)

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.basic-layout {
  min-height: 100vh;
  background: #0f172a;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 24px;
  height: 64px;
  line-height: 64px;
}

.header-content {
  display: flex;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 48px;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }

  .logo-icon {
    font-size: 28px;
    margin-right: 8px;
  }

  .logo-text {
    font-size: 20px;
    font-weight: 700;
    background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.nav-menu {
  flex: 1;
  background: transparent;
  border: none;
  line-height: 64px;

  :deep(.ant-menu-item) {
    color: rgba(255, 255, 255, 0.7);

    &:hover {
      color: #fff;
    }

    &.ant-menu-item-selected {
      color: #1677ff;
      background: transparent;

      &::after {
        border-bottom-color: #1677ff;
      }
    }
  }
}

.user-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 8px;
  transition: background 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .username {
    color: #fff;
    font-size: 14px;
  }

  .anticon-down {
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
  }
}

.content {
  margin-top: 64px;
  min-height: calc(100vh - 64px - 70px);
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

.footer {
  text-align: center;
  background: rgba(15, 23, 42, 0.95);
  color: rgba(255, 255, 255, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
