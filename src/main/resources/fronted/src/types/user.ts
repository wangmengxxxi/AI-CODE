import type { PageRequest } from './common'

/**
 * 用户类型定义
 */

/** 用户角色 */
export type UserRole = 'user' | 'admin' | 'ban'

/** 用户 VO */
export interface UserVO {
    id: number
    userAccount: string
    userName: string
    userAvatar: string
    userProfile: string
    userRole: UserRole
    createTime: string
}

/** 登录用户 VO */
export interface LoginUserVO extends UserVO {
    updateTime?: string
}

/** 用户注册请求 */
export interface UserRegisterRequest {
    userAccount: string
    userPassword: string
    checkPassword: string
}

/** 用户登录请求 */
export interface UserLoginRequest {
    userAccount: string
    userPassword: string
}

/** 创建用户请求（管理员） */
export interface UserAddRequest {
    userName?: string
    userAccount: string
    userAvatar?: string
    userProfile?: string
    userRole?: UserRole
}

/** 更新用户请求（管理员） */
export interface UserUpdateRequest {
    id: number
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: UserRole
}

/** 用户查询请求 */
export interface UserQueryRequest extends PageRequest {
    id?: number
    userName?: string
    userAccount?: string
    userProfile?: string
    userRole?: UserRole
}
