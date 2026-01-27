<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import type { UserLoginRequest } from '@/types'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(false)
const formState = reactive<UserLoginRequest>({
  userAccount: '',
  userPassword: ''
})

// 表单规则
const rules = {
  userAccount: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 4, max: 20, message: '账号长度为 4-20 位', trigger: 'blur' }
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为 6-20 位', trigger: 'blur' }
  ]
}

// 登录
async function handleLogin() {
  loading.value = true
  try {
    const res = await authStore.login(formState)
    if (res.code === 0) {
      message.success('登录成功')
      // 获取重定向地址
      const redirect = (route.query.redirect as string) || '/'
      router.push(redirect)
    } else {
      message.error(res.message || '登录失败')
    }
  } catch (error) {
    message.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}

// 跳转注册
function goToRegister() {
  router.push('/register')
}

// 返回首页
function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Logo 区域 -->
      <div class="logo-area" @click="goHome">
        <span class="logo-icon">🤖</span>
        <h1 class="logo-title">AI Code</h1>
        <p class="logo-subtitle">一句话，呈所想</p>
      </div>

      <!-- 登录表单 -->
      <a-card class="login-card">
        <h2 class="card-title">欢迎回来</h2>
        
        <a-form
          :model="formState"
          :rules="rules"
          layout="vertical"
          @finish="handleLogin"
        >
          <a-form-item name="userAccount" label="账号">
            <a-input
              v-model:value="formState.userAccount"
              placeholder="请输入账号"
              size="large"
            >
              <template #prefix>
                <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="userPassword" label="密码">
            <a-input-password
              v-model:value="formState.userPassword"
              placeholder="请输入密码"
              size="large"
            >
              <template #prefix>
                <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              :loading="loading"
              block
            >
              登录
            </a-button>
          </a-form-item>
        </a-form>

        <div class="register-link">
          还没有账号？
          <a @click="goToRegister">立即注册</a>
        </div>
      </a-card>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 50%, #f3e5f5 100%);
  padding: 24px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.logo-area {
  text-align: center;
  margin-bottom: 32px;
  cursor: pointer;
  
  .logo-icon {
    font-size: 48px;
    display: block;
    margin-bottom: 8px;
  }
  
  .logo-title {
    font-size: 28px;
    font-weight: 600;
    color: #722ED1;
    margin: 0 0 8px;
  }
  
  .logo-subtitle {
    color: #666;
    margin: 0;
  }
}

.login-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  
  .card-title {
    text-align: center;
    font-size: 20px;
    margin-bottom: 24px;
    color: #333;
  }
}

.register-link {
  text-align: center;
  color: #666;
  
  a {
    color: #722ED1;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
