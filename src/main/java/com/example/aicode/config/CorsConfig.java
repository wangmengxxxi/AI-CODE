package com.example.aicode.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

/**
 * 配置跨域资源共享(CORS)映射的方法
 * 此方法会覆盖所有的请求路径，并设置相应的跨域规则
 *
 * @param registry CorsRegistry对象，用于注册跨域配置
 */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 覆盖所有请求，使用 /** 匹配所有路径
        registry.addMapping("/**")
                // 允许发送 Cookie，设置为 true 时 allowedOriginPatterns 不能为 "*"
                .allowCredentials(true)
                // 放行哪些域名（必须用 patterns，否则 * 会和 allowCredentials 冲突）
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("*");
    }


}
