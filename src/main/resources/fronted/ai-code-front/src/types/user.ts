/**
 * 用户相关 TypeScript 类型定义
 * 对应后端 User 实体和 DTO/VO 类
 */

/**
 * 通用 API 响应结构
 */
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

/**
 * 用户注册请求参数
 */
export interface UserRegisterRequest {
  userAccount: string
  userPassword: string
  checkPassword: string
}

/**
 * 用户登录请求参数
 */
export interface UserLoginRequest {
  userAccount: string
  userPassword: string
}

/**
 * 登录用户 VO (包含完整信息)
 */
export interface LoginUserVO {
  id: number
  userAccount: string
  userName: string | null
  userAvatar: string | null
  userProfile: string | null
  userRole: string
  createTime: string
  updateTime: string
}

/**
 * 用户 VO (公开信息)
 */
export interface UserVO {
  id: number
  userAccount: string
  userName: string | null
  userAvatar: string | null
  userProfile: string | null
  userRole: string
  createTime: string
}

/**
 * 用户更新请求参数
 */
export interface UserUpdateRequest {
  id: number
  userName?: string
  userAvatar?: string
  userProfile?: string
  userRole?: string
}

/**
 * 用户添加请求参数 (管理员)
 */
export interface UserAddRequest {
  userName?: string
  userAccount: string
  userAvatar?: string
  userProfile?: string
  userRole?: string
}

/**
 * 用户查询请求参数 (管理员)
 */
export interface UserQueryRequest {
  id?: number
  userName?: string
  userAccount?: string
  userProfile?: string
  userRole?: string
  pageNum: number
  pageSize: number
}

/**
 * 删除请求参数
 */
export interface DeleteRequest {
  id: number
}

/**
 * 分页响应结构
 */
export interface PageResponse<T> {
  records: T[]
  totalRow: number
  pageNum: number
  pageSize: number
  totalPage: number
}

/**
 * 用户角色枚举
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
