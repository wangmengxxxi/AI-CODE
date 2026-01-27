import axios from 'axios'
import type { BaseResponse } from '@/types'

/**
 * Axios 实例配置
 * 注意：baseURL 是 '/'，不是 '/api'
 */
const instance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 60000,
    withCredentials: true, // 必须携带 Cookie
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
instance.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
instance.interceptors.response.use(
    (response) => {
        const res = response.data as BaseResponse<unknown>

        // 业务错误处理
        if (res.code !== 0) {
            // 未登录错误
            if (res.code === 40100) {
                // 可以在这里处理未登录跳转
                console.warn('用户未登录')
            }
            return Promise.reject(new Error(res.message || '请求失败'))
        }

        return response
    },
    (error) => {
        // 网络错误处理
        console.error('请求错误：', error.message)
        return Promise.reject(error)
    }
)

export default instance
