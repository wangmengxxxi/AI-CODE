import request from './index'
import type {
    BaseResponse,
    PageResponse,
    DeleteRequest,
    AppVO,
    AppAddRequest,
    AppUpdateRequest,
    AppAdminUpdateRequest,
    AppQueryRequest,
    AppDeployRequest
} from '@/types'

/**
 * 应用相关 API
 */

/** 创建应用 */
export function addApp(data: AppAddRequest) {
    return request.post<BaseResponse<number>>('/app/add', data)
}

/** 删除应用 */
export function deleteApp(data: DeleteRequest) {
    return request.post<BaseResponse<boolean>>('/app/delete', data)
}

/** 更新应用 */
export function updateApp(data: AppUpdateRequest) {
    return request.post<BaseResponse<boolean>>('/app/update', data)
}

/** 根据 ID 获取应用详情 */
export function getAppVoById(id: number) {
    return request.get<BaseResponse<AppVO>>('/app/get/vo', { params: { id } })
}

/** 分页获取我的应用列表 */
export function listMyAppByPage(data: AppQueryRequest) {
    return request.post<BaseResponse<PageResponse<AppVO>>>('/app/my/list/page/vo', data)
}

/** 分页获取精选应用列表 */
export function listGoodAppByPage(data: AppQueryRequest) {
    return request.post<BaseResponse<PageResponse<AppVO>>>('/app/good/list/page/vo', data)
}

/** 部署应用 */
export function deployApp(data: AppDeployRequest) {
    return request.post<BaseResponse<string>>('/app/deploy', data)
}

// ========== 管理员接口 ==========

/** 管理员删除应用 */
export function adminDeleteApp(data: DeleteRequest) {
    return request.post<BaseResponse<boolean>>('/app/admin/delete', data)
}

/** 管理员更新应用 */
export function adminUpdateApp(data: AppAdminUpdateRequest) {
    return request.post<BaseResponse<boolean>>('/app/admin/update', data)
}

/** 管理员获取应用详情 */
export function adminGetAppVoById(id: number) {
    return request.get<BaseResponse<AppVO>>('/app/admin/get/vo', { params: { id } })
}

/** 管理员分页获取应用列表 */
export function adminListAppByPage(data: AppQueryRequest) {
    return request.post<BaseResponse<PageResponse<AppVO>>>('/app/admin/list/page/vo', data)
}
