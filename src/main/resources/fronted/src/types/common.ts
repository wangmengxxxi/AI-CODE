/**
 * 通用类型定义
 */

/** 统一响应结构 */
export interface BaseResponse<T> {
    code: number
    data: T
    message: string
}

/** 分页请求参数 */
export interface PageRequest {
    pageNum: number
    pageSize: number
    sortField?: string
    sortOrder?: 'descend' | 'ascend'
}

/** 分页响应结构 */
export interface PageResponse<T> {
    records: T[]
    pageNumber: number
    pageSize: number
    totalRow: number
}

/** 删除请求 */
export interface DeleteRequest {
    id: number
}
