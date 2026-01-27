import request from './index'
import type {
    BaseResponse,
    PageResponse,
    DeleteRequest,
    LoginUserVO,
    UserVO,
    UserRegisterRequest,
    UserLoginRequest,
    UserAddRequest,
    UserUpdateRequest,
    UserQueryRequest
} from '@/types'

/**
 * 用户相关 API
 */

/** 用户注册 */
export function register(data: UserRegisterRequest) {
    return request.post<BaseResponse<number>>('/user/register', data)
}

/** 用户登录 */
export function login(data: UserLoginRequest) {
    return request.post<BaseResponse<LoginUserVO>>('/user/login', data)
}

/** 获取当前登录用户 */
export function getLoginUser() {
    return request.get<BaseResponse<LoginUserVO>>('/user/get/login')
}

/** 用户登出 */
export function logout() {
    return request.post<BaseResponse<boolean>>('/user/logout')
}

// ========== 管理员接口 ==========

/** 创建用户（管理员） */
export function addUser(data: UserAddRequest) {
    return request.post<BaseResponse<number>>('/user/add', data)
}

/** 根据 ID 获取用户（管理员） */
export function getUserById(id: number) {
    return request.get<BaseResponse<UserVO>>('/user/get', { params: { id } })
}

/** 根据 ID 获取用户 VO（管理员） */
export function getUserVoById(id: number) {
    return request.get<BaseResponse<UserVO>>('/user/get/vo', { params: { id } })
}

/** 删除用户（管理员） */
export function deleteUser(data: DeleteRequest) {
    return request.post<BaseResponse<boolean>>('/user/delete', data)
}

/** 更新用户（管理员） */
export function updateUser(data: UserUpdateRequest) {
    return request.post<BaseResponse<boolean>>('/user/update', data)
}

/** 分页获取用户列表（管理员） */
export function listUserByPage(data: UserQueryRequest) {
    return request.post<BaseResponse<PageResponse<UserVO>>>('/user/list/page/vo', data)
}
