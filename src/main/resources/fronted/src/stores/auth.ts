import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as loginApi, register as registerApi, logout as logoutApi, getLoginUser } from '@/api/user'
import type { LoginUserVO, UserLoginRequest, UserRegisterRequest } from '@/types'

/**
 * 认证状态管理
 */
export const useAuthStore = defineStore('auth', () => {
    // 状态
    const user = ref<LoginUserVO | null>(null)

    // 计算属性
    const isAuthenticated = computed(() => !!user.value)
    const isAdmin = computed(() => user.value?.userRole === 'admin')

    /**
     * 用户登录
     */
    async function login(data: UserLoginRequest) {
        const response = await loginApi(data)
        if (response.data.code === 0) {
            user.value = response.data.data
        }
        return response.data
    }

    /**
     * 用户注册
     */
    async function register(data: UserRegisterRequest) {
        const response = await registerApi(data)
        if (response.data.code === 0) {
            // 注册成功后自动登录
            await login({
                userAccount: data.userAccount,
                userPassword: data.userPassword
            })
        }
        return response.data
    }

    /**
     * 用户登出
     */
    async function logout() {
        const response = await logoutApi()
        if (response.data.code === 0) {
            user.value = null
        }
        return response.data
    }

    /**
     * 获取当前登录用户
     */
    async function fetchLoginUser() {
        try {
            const response = await getLoginUser()
            if (response.data.code === 0) {
                user.value = response.data.data
            }
        } catch (error) {
            // 未登录时不抛出错误
            user.value = null
        }
    }

    /**
     * 清除用户状态
     */
    function clearUser() {
        user.value = null
    }

    return {
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        fetchLoginUser,
        clearUser
    }
})
