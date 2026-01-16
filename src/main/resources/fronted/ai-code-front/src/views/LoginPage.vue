<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Logo & Title -->
      <div class="login-header">
        <div class="logo-wrapper">
          <div class="logo-icon">🤖</div>
        </div>
        <h1 class="title">AI Code Platform</h1>
        <p class="subtitle">智能代码生成 & RAG 知识库</p>
      </div>

      <!-- Login Form -->
      <a-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @finish="handleLogin"
      >
        <a-form-item name="userAccount">
          <a-input
            v-model:value="loginForm.userAccount"
            size="large"
            placeholder="请输入账号"
            :prefix="h(UserOutlined)"
          >
          </a-input>
        </a-form-item>

        <a-form-item name="userPassword">
          <a-input-password
            v-model:value="loginForm.userPassword"
            size="large"
            placeholder="请输入密码"
            :prefix="h(LockOutlined)"
            @keyup.enter="handleLogin"
          >
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            size="large"
            block
            :loading="userStore.isLoading"
            @click="handleLogin"
          >
            登录
          </a-button>
        </a-form-item>

        <div class="form-footer">
          <span class="tip">还没有账号?</span>
          <router-link to="/register" class="link">立即注册</router-link>
        </div>
      </a-form>
    </div>

    <!-- Background Decoration -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useAuth } from '@/composables/useAuth'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const { loginFormRef, loginForm, loginRules, handleLogin } = useAuth()
</script>

<style scoped lang="scss">
.login-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  overflow: hidden;
}

.login-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  padding: 48px 40px;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-wrapper {
  display: inline-block;
  margin-bottom: 16px;
}

.logo-icon {
  font-size: 64px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.title {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.login-form {
  :deep(.ant-input-affix-wrapper),
  :deep(.ant-input) {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    transition: all 0.3s;

    &:hover,
    &:focus {
      border-color: #1677ff;
      background: rgba(15, 23, 42, 0.8);
    }

    input {
      background: transparent;
      color: #fff;

      &::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }
    }
  }

  :deep(.ant-input-prefix) {
    color: rgba(255, 255, 255, 0.4);
  }

  :deep(.ant-btn-primary) {
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, #1677ff 0%, #5b8def 100%);
    border: none;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(22, 119, 255, 0.4);
    }
  }
}

.form-footer {
  text-align: center;
  margin-top: 24px;

  .tip {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
  }

  .link {
    margin-left: 8px;
    color: #1677ff;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #5b8def;
    }
  }
}

// Background Decoration
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.15) 0%, transparent 70%);
  animation: pulse 8s ease-in-out infinite;
}

.circle-1 {
  width: 400px;
  height: 400px;
  top: -200px;
  left: -200px;
}

.circle-2 {
  width: 600px;
  height: 600px;
  bottom: -300px;
  right: -300px;
  animation-delay: 2s;
}

.circle-3 {
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 4s;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
}
</style>
