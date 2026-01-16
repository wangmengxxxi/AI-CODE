<template>
  <div class="register-container">
    <div class="register-card">
      <!-- Logo & Title -->
      <div class="register-header">
        <div class="logo-wrapper">
          <div class="logo-icon">🚀</div>
        </div>
        <h1 class="title">创建账号</h1>
        <p class="subtitle">加入 AI Code Platform 开始你的智能编码之旅</p>
      </div>

      <!-- Register Form -->
      <a-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="register-form"
        @finish="handleRegister"
      >
        <a-form-item name="userAccount">
          <a-input
            v-model:value="registerForm.userAccount"
            size="large"
            placeholder="请输入账号 (4-16位字母数字)"
            :prefix="h(UserOutlined)"
          >
          </a-input>
        </a-form-item>

        <a-form-item name="userPassword">
          <a-input-password
            v-model:value="registerForm.userPassword"
            size="large"
            placeholder="请输入密码 (6-20位)"
            :prefix="h(LockOutlined)"
          >
          </a-input-password>
        </a-form-item>

        <a-form-item name="checkPassword">
          <a-input-password
            v-model:value="registerForm.checkPassword"
            size="large"
            placeholder="请再次输入密码"
            :prefix="h(SafetyOutlined)"
            @keyup.enter="handleRegister"
          >
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            size="large"
            block
            :loading="userStore.isLoading"
            @click="handleRegister"
          >
            注册
          </a-button>
        </a-form-item>

        <div class="form-footer">
          <span class="tip">已有账号?</span>
          <router-link to="/login" class="link">立即登录</router-link>
        </div>
      </a-form>
    </div>

    <!-- Background Decoration -->
    <div class="bg-decoration">
      <div class="grid-pattern"></div>
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons-vue'
import { useAuth } from '@/composables/useAuth'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const { registerFormRef, registerForm, registerRules, handleRegister } = useAuth()
</script>

<style scoped lang="scss">
.register-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  overflow: hidden;
}

.register-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 460px;
  padding: 48px 40px;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: fadeInScale 0.6s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.register-header {
  text-align: center;
  margin-bottom: 36px;
}

.logo-wrapper {
  display: inline-block;
  margin-bottom: 16px;
}

.logo-icon {
  font-size: 56px;
  animation: rotate 4s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.title {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  line-height: 1.6;
}

.register-form {
  :deep(.ant-input-affix-wrapper),
  :deep(.ant-input) {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    transition: all 0.3s;

    &:hover,
    &:focus {
      border-color: #a78bfa;
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
    background: linear-gradient(135deg, #a78bfa 0%, #ec4899 100%);
    border: none;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(167, 139, 250, 0.4);
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
    color: #a78bfa;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #ec4899;
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

.grid-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  animation: float 8s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.3) 0%, transparent 70%);
  top: -250px;
  right: -250px;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%);
  bottom: -200px;
  left: -200px;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(20px, -20px) scale(1.05);
  }
}
</style>
