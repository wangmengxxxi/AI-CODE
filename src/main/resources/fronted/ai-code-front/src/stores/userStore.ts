/**
 * 用户状态管理 Store (Pinia Setup Store)
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import type { LoginUserVO } from '@/types/user'
import { getLoginUserAPI, userLoginAPI, userLogoutAPI, userRegisterAPI } from '@/api/user'
import type { UserLoginRequest, UserRegisterRequest } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // ========== State ==========
  const loginUser = ref<LoginUserVO | null>(null)
  const isLoading = ref(false)

  // ========== Getters ==========
  /**
   * 是否已登录
   */
  const isLoggedIn = computed(() => !!loginUser.value)

  /**
   * 是否为管理员
   */
  const isAdmin = computed(() => loginUser.value?.userRole === 'admin')

  /**
   * 用户昵称 (未设置则显示账号)
   */
  const displayName = computed(() => {
    return loginUser.value?.userName || loginUser.value?.userAccount || '未登录'
  })

  /**
   * 用户头像 (未设置则使用默认头像)
   */
  const userAvatar = computed(() => {
    return (
      loginUser.value?.userAvatar ||
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' + loginUser.value?.userAccount
    )
  })

  // ========== Actions ==========
  /**
   * 用户注册
   */
  const register = async (params: UserRegisterRequest): Promise<boolean> => {
    try {
      isLoading.value = true
      const res = await userRegisterAPI(params)
      if (res.code === 0) {
        message.success('注册成功,请登录')
        return true
      }
      return false
    } catch (error) {
      console.error('注册失败:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 用户登录
   */
  const login = async (params: UserLoginRequest): Promise<boolean> => {
    try {
      isLoading.value = true
      const res = await userLoginAPI(params)
      if (res.code === 0 && res.data) {
        loginUser.value = res.data
        message.success('登录成功')
        return true
      }
      return false
    } catch (error) {
      console.error('登录失败:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取当前登录用户信息
   */
  const fetchLoginUser = async (): Promise<void> => {
    try {
      const res = await getLoginUserAPI()
      if (res.code === 0 && res.data) {
        loginUser.value = res.data
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      loginUser.value = null
    }
  }

  /**
   * 用户登出
   */
  const logout = async (): Promise<void> => {
    try {
      await userLogoutAPI()
      loginUser.value = null
      message.success('已退出登录')
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  /**
   * 更新本地用户信息 (用于编辑后同步)
   */
  const updateLocalUser = (user: Partial<LoginUserVO>): void => {
    if (loginUser.value) {
      loginUser.value = { ...loginUser.value, ...user }
    }
  }

  return {
    // State
    loginUser,
    isLoading,
    // Getters
    isLoggedIn,
    isAdmin,
    displayName,
    userAvatar,
    // Actions
    register,
    login,
    fetchLoginUser,
    logout,
    updateLocalUser,
  }
})
