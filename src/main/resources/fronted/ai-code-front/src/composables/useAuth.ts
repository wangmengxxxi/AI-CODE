/**
 * 认证相关 Composable Hook
 * 封装登录/注册逻辑复用
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import type { UserLoginRequest, UserRegisterRequest } from '@/types/user'
import type { FormInstance } from 'ant-design-vue'

export const useAuth = () => {
  const router = useRouter()
  const userStore = useUserStore()

  const loginFormRef = ref<FormInstance>()
  const registerFormRef = ref<FormInstance>()

  /**
   * 登录表单数据
   */
  const loginForm = ref<UserLoginRequest>({
    userAccount: '',
    userPassword: '',
  })

  /**
   * 注册表单数据
   */
  const registerForm = ref<UserRegisterRequest>({
    userAccount: '',
    userPassword: '',
    checkPassword: '',
  })

  /**
   * 登录表单验证规则
   */
  const loginRules = {
    userAccount: [
      { required: true, message: '请输入账号', trigger: 'blur' },
      { min: 4, max: 16, message: '账号长度为 4-16 位', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '账号只能包含字母、数字和下划线', trigger: 'blur' },
    ],
    userPassword: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度为 6-20 位', trigger: 'blur' },
    ],
  }

  /**
   * 注册表单验证规则
   */
  const registerRules = {
    userAccount: [
      { required: true, message: '请输入账号', trigger: 'blur' },
      { min: 4, max: 16, message: '账号长度为 4-16 位', trigger: 'blur' },
      { pattern: /^[a-zA-Z0-9_]+$/, message: '账号只能包含字母、数字和下划线', trigger: 'blur' },
    ],
    userPassword: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度为 6-20 位', trigger: 'blur' },
    ],
    checkPassword: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      {
        validator: (_rule: unknown, value: string) => {
          if (value !== registerForm.value.userPassword) {
            return Promise.reject('两次密码输入不一致')
          }
          return Promise.resolve()
        },
        trigger: 'blur',
      },
    ],
  }

  /**
   * 处理登录
   */
  const handleLogin = async () => {
    try {
      await loginFormRef.value?.validate()
      const success = await userStore.login(loginForm.value)
      if (success) {
        // 登录成功后跳转到首页
        router.push('/')
      }
    } catch (error) {
      console.error('登录验证失败:', error)
    }
  }

  /**
   * 处理注册
   */
  const handleRegister = async () => {
    try {
      await registerFormRef.value?.validate()
      const success = await userStore.register(registerForm.value)
      if (success) {
        // 注册成功后跳转到登录页
        router.push('/login')
      }
    } catch (error) {
      console.error('注册验证失败:', error)
    }
  }

  /**
   * 处理登出
   */
  const handleLogout = async () => {
    await userStore.logout()
    router.push('/login')
  }

  return {
    // Refs
    loginFormRef,
    registerFormRef,
    loginForm,
    registerForm,
    // Rules
    loginRules,
    registerRules,
    // Methods
    handleLogin,
    handleRegister,
    handleLogout,
  }
}
