import request from './index'
import type {
    BaseResponse,
    PageResponse,
    DeleteRequest,
    ChatHistory,
    ChatHistoryQueryRequest
} from '@/types'

/**
 * 对话历史相关 API
 */

/**
 * 分页查询某个应用的对话历史（游标查询）
 * @param appId 应用ID
 * @param pageSize 页面大小，默认10
 * @param lastCreateTime 最后一条记录的创建时间（游标）
 */
export function listAppChatHistory(appId: number, pageSize: number = 10, lastCreateTime?: string) {
    const params: Record<string, unknown> = { appId, pageSize }
    if (lastCreateTime) {
        params.lastCreateTime = lastCreateTime
    }
    return request.get<BaseResponse<PageResponse<ChatHistory>>>('/chatHistory/app/' + appId, { params })
}

/**
 * 管理员分页查询所有对话历史
 * @param data 查询请求
 */
export function adminListChatHistoryByPage(data: ChatHistoryQueryRequest) {
    return request.post<BaseResponse<PageResponse<ChatHistory>>>('/chatHistory/admin/list/page/vo', data)
}
