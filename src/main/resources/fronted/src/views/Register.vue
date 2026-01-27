<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons-vue'
import { useAuthStore } from '@/stores/auth'
import type { UserRegisterRequest } from '@/types'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const formState = reactive<UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: ''
})

// 校验确认密码
function validateCheckPassword(_rule: unknown, value: string) {
  if (value !== formState.userPassword) {
    return Promise.reject('两次输入的密码不一致')
  }
  return Promise.resolve()
}

// 表单规则
const rules = {
  userAccount: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 4, max: 20, message: '账号长度为 4-20 位', trigger: 'blur' }
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为 6-20 位', trigger: 'blur' }
  ],
  checkPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateCheckPassword, trigger: 'blur' }
  ]
}

// 注册
async function handleRegister() {
  loading.value = true
  try {
    const res = await authStore.register(formState)
    if (res.code === 0) {
      message.success('注册成功')
      router.push('/')
    } else {
      message.error(res.message || '注册失败')
    }
  } catch (error) {
    message.error('注册失败，请重试')
  } finally {
    loading.value = false
  }
}

// 跳转登录
function goToLogin() {
  router.push('/login')
}

// 返回首页
function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="register-page">
    <div class="register-container">
      <!-- Logo 区域 -->
      <div class="logo-area" @click="goHome">
        <span class="logo-icon">🤖</span>
        <h1 class="logo-title">AI Code</h1>
        <p class="logo-subtitle">一句话，呈所想</p>
      </div>

      <!-- 注册表单 -->
      <a-card class="register-card">
        <h2 class="card-title">创建新账号</h2>
        
        <a-form
          :model="formState"
          :rules="rules"
          layout="vertical"
          @finish="handleRegister"
        >
          <a-form-item name="userAccount" label="账号">
            <a-input
              v-model:value="formState.userAccount"
              placeholder="请输入账号（4-20 位）"
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
              placeholder="请输入密码（6-20 位）"
              size="large"
            >
              <template #prefix>
                <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input-password>
          </a-form-item>

          <a-form-item name="checkPassword" label="确认密码">
            <a-input-password
              v-model:value="formState.checkPassword"
              placeholder="请再次输入密码"
              size="large"
            >
              <template #prefix>
                <SafetyOutlined style="color: rgba(0, 0, 0, 0.25)" />
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
              注册
            </a-button>
          </a-form-item>
        </a-form>

        <div class="login-link">
          已有账号？
          <a @click="goToLogin">立即登录</a>
        </div>
      </a-card>
    </div>
  </div>
</template>

<style scoped lang="less">
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 50%, #f3e5f5 100%);
  padding: 24px;
}

.register-container {
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

.register-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  
  .card-title {
    text-align: center;
    font-size: 20px;
    margin-bottom: 24px;
    color: #333;
  }
}

.login-link {
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
