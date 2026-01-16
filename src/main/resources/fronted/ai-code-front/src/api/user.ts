/**
 * 用户相关 API 接口封装
 */
import request from './request'
import type {
  ApiResponse,
  UserRegisterRequest,
  UserLoginRequest,
  LoginUserVO,
  UserVO,
  UserUpdateRequest,
  UserAddRequest,
  UserQueryRequest,
  DeleteRequest,
  PageResponse,
} from '@/types/user'

/**
 * 用户注册
 */
export const userRegisterAPI = (data: UserRegisterRequest): Promise<ApiResponse<number>> => {
  return request.post('/user/register', data)
}

/**
 * 用户登录
 */
export const userLoginAPI = (data: UserLoginRequest): Promise<ApiResponse<LoginUserVO>> => {
  return request.post('/user/login', data)
}

/**
 * 获取当前登录用户信息
 */
export const getLoginUserAPI = (): Promise<ApiResponse<LoginUserVO>> => {
  return request.get('/user/get/login')
}

/**
 * 用户登出
 */
export const userLogoutAPI = (): Promise<ApiResponse<boolean>> => {
  return request.post('/user/logout')
}

/**
 * 根据 ID 获取用户 VO
 */
export const getUserVOByIdAPI = (id: number): Promise<ApiResponse<UserVO>> => {
  return request.get('/user/get/vo', { params: { id } })
}

/**
 * 更新用户信息 (管理员)
 */
export const updateUserAPI = (data: UserUpdateRequest): Promise<ApiResponse<boolean>> => {
  return request.post('/user/update', data)
}

/**
 * 分页获取用户列表 (管理员)
 */
export const listUserVOByPageAPI = (
  params: UserQueryRequest,
): Promise<ApiResponse<PageResponse<UserVO>>> => {
  return request.post('/user/list/page/vo', params)
}

/**
 * 添加用户 (管理员)
 */
export const addUserAPI = (data: UserAddRequest): Promise<ApiResponse<number>> => {
  return request.post('/user/add', data)
}

/**
 * 删除用户 (管理员)
 */
export const deleteUserAPI = (data: DeleteRequest): Promise<ApiResponse<boolean>> => {
  return request.post('/user/delete', data)
}

/**
 * 根据 ID 获取用户 (管理员)
 */
export const getUserByIdAPI = (id: number): Promise<ApiResponse<UserVO>> => {
  return request.get('/user/get', { params: { id } })
}
