package com.example.aicode.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// 这是一个注解定义，用于方法级别的权限检查
@Target(ElementType.METHOD)  // 指定该注解只能用于方法上
@Retention(RetentionPolicy.RUNTIME)  // 指定该注解在运行时仍然保留
public @interface AuthCheck {  // 定义一个名为AuthCheck的注解
    // 定义一个名为mustRole的属性，类型为String，默认值为空字符串
    String mustRole() default "";
}
