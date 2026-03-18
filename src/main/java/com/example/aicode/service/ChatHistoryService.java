package com.example.aicode.service;


import com.example.aicode.exception.ErrorCode;
import com.example.aicode.model.dto.app.ChatHistoryQueryRequest;
import com.example.aicode.model.entity.ChatHistory;
import com.example.aicode.model.entity.User;
import com.mybatisflex.core.paginate.Page;
import com.mybatisflex.core.query.QueryWrapper;
import com.mybatisflex.core.service.IService;

import java.time.LocalDateTime;

/**
 * 对话历史 服务层。
 *
 * @author ddd
 */
public interface ChatHistoryService extends IService<ChatHistory> {

    /**
     * 添加聊天消息
     * @param appId 应用ID，必须大于0
     * @param message 消息内容，不能为空
     * @param messageType 消息类型，不能为空
     * @param userId 用户ID，必须大于0
     * @return 返回是否添加成功
     */
    boolean addChatMessage(Long appId, String message, String messageType, Long userId);


/**
 * 根据应用ID删除相关数据
 *
 * @param appId 应用的唯一标识符
 * @return 删除操作是否成功执行，true表示成功，false表示失败
 */
    boolean deleteByAppId(Long appId);

/**
 * 根据聊天历史查询请求参数获取查询包装器
 *
 * @param chatHistoryQueryRequest 聊天历史查询请求对象，包含查询条件
 * @return QueryWrapper 返回一个包含查询条件的QueryWrapper对象，用于数据库查询操作
 */
    // 这是一个方法定义，用于获取聊天历史查询的QueryWrapper
    // 方法名为getQueryWrapper，接受一个ChatHistoryQueryRequest类型的参数
    // 返回类型为QueryWrapper，用于构建数据库查询条件
    QueryWrapper getQueryWrapper(ChatHistoryQueryRequest chatHistoryQueryRequest);

    Page<ChatHistory> listAppChatHistoryByPage(Long appId, int pageSize,
                                               LocalDateTime lastCreateTime,
                                               User loginUser);

;
}
