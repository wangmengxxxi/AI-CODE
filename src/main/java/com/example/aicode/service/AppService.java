package com.example.aicode.service;

import com.example.aicode.model.dto.app.AppQueryRequest;
import com.example.aicode.model.entity.App;
import com.example.aicode.model.entity.User;
import com.example.aicode.model.vo.AppVO;
import com.mybatisflex.core.query.QueryWrapper;
import com.mybatisflex.core.service.IService;
import reactor.core.publisher.Flux;

import java.util.List;

/**
 * 应用 服务层。
 *
 * @author ddd
 */
public interface AppService extends IService<App> {

    /**
     * 校验应用信息
     *
     * @param app 应用实体
     * @param add 是否为创建操作
     */
    void validApp(App app, boolean add);

    /**
     * 获取查询条件
     *
     * @param appQueryRequest 查询请求
     * @return 查询条件包装器
     */
    QueryWrapper getQueryWrapper(AppQueryRequest appQueryRequest);

    /**
     * 获取应用视图对象
     *
     * @param app 应用实体
     * @return 应用视图对象
     */
    AppVO getAppVO(App app);

    /**
     * 批量获取应用视图对象
     *
     * @param appList 应用实体列表
     * @return 应用视图对象列表
     */
    List<AppVO> getAppVOList(List<App> appList);


    Flux<String> chatToGenCode(Long appId, String message, User loginUser);

    String deployApp(Long appId, User loginUser);
}


