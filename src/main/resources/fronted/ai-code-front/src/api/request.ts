/**
 * Axios 实例封装 - 统一请求拦截器
 */
import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { message } from 'ant-design-vue'

// 创建 Axios 实例
const request: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  withCredentials: true, // 支持跨域携带 Cookie (Session 认证需要)
})

/**
 * 请求拦截器
 */
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 如果后续使用 JWT,可在此处添加 Token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  },
)

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, data, message: msg } = response.data

    // 后端统一返回格式: { code, data, message }
    if (code === 0) {
      return response.data // 成功直接返回 data
    } else {
      // 业务错误处理
      message.error(msg || '请求失败')
      return Promise.reject(new Error(msg || '请求失败'))
    }
  },
  (error) => {
    // HTTP 错误处理
    if (error.response) {
      const { status } = error.response
      switch (status) {
        case 401:
          message.error('未登录或登录已过期')
          break
        case 403:
          message.error('无权限访问')
          break
        case 404:
          message.error('请求资源不存在')
          break
        case 500:
          message.error('服务器内部错误')
          break
        default:
          message.error(`请求失败: ${status}`)
      }
    } else {
      message.error('网络连接失败')
    }
    return Promise.reject(error)
  },
)

export default request
