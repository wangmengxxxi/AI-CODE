import type { PageRequest } from './common'
import type { UserVO } from './user'

/**
 * 应用类型定义
 */

/** 代码生成类型 */
export type CodeGenType = 'SINGLE_FILE' | 'MULTI_FILE'

/** 应用 VO */
export interface AppVO {
    id: number
    appName: string
    cover?: string
    initPrompt: string
    codeGenType: CodeGenType
    deployKey?: string
    deployedTime?: string
    priority: number
    userId: number
    createTime: string
    updateTime?: string
    user?: UserVO
}

/** 创建应用请求 */
export interface AppAddRequest {
    initPrompt: string
}

/** 更新应用请求（用户） */
export interface AppUpdateRequest {
    id: number
    appName?: string
}

/** 更新应用请求（管理员） */
export interface AppAdminUpdateRequest {
    id: number
    appName?: string
    cover?: string
    priority?: number
}

/** 应用查询请求 */
export interface AppQueryRequest extends PageRequest {
    id?: number
    appName?: string
    cover?: string
    initPrompt?: string
    codeGenType?: CodeGenType
    deployKey?: string
    priority?: number
    userId?: number
}

/** 部署应用请求 */
export interface AppDeployRequest {
    appId: number
}

/** 聊天消息类型 */
export interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
    timestamp?: number
}
