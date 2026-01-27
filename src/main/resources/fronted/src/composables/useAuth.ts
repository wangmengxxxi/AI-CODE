import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

/**
 * 认证相关组合函数
 */
export function useAuth() {
    const router = useRouter()
    const authStore = useAuthStore()

    const user = computed(() => authStore.user)
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const isAdmin = computed(() => authStore.isAdmin)

    /**
     * 检查是否需要登录
     * 如果未登录，跳转到登录页
     * @param redirectPath 登录后重定向的路径
     */
    function requireAuth(redirectPath?: string) {
        if (!authStore.isAuthenticated) {
            const query = redirectPath ? { redirect: redirectPath } : {}
            router.push({ path: '/login', query })
            return false
        }
        return true
    }

    /**
     * 检查是否是管理员
     * 如果不是管理员，跳转到首页
     */
    function requireAdmin() {
        if (!authStore.isAdmin) {
            router.push('/')
            return false
        }
        return true
    }

    /**
     * 登出并跳转到首页
     */
    async function logoutAndRedirect() {
        await authStore.logout()
        router.push('/')
    }

    return {
        user,
        isAuthenticated,
        isAdmin,
        requireAuth,
        requireAdmin,
        logoutAndRedirect
    }
}
