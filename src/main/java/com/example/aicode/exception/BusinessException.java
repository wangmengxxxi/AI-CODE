package com.example.aicode.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
    /**
     * 错误码
     */
    private final int code;


/**
 * 构造方法，根据错误码创建业务异常对象
 * @param errorCode 错误码对象，包含错误信息
 */
    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage()); // 调用父类构造方法，传入错误信息
        this.code = errorCode.getCode();    // 保存错误码对象
    }

/**
 * 自定义业务异常类的构造方法
 * @param msg 异常信息描述
 * @param errorCode 错误代码对象，包含错误码和相关信息
 */
    public BusinessException(ErrorCode errorCode,String msg){
    // 调用父类构造方法，初始化异常信息
        super(msg);
    // 初始化错误代码对象
        this.code = errorCode.getCode();
    }

/**
 * 自定义业务异常类的构造方法
 * @param code 错误码，用于标识具体的错误类型
 * @param msg 错误信息，用于描述具体的错误内容
 */
    public BusinessException (int code, String msg){
    // 调用父类构造方法，传入错误信息
        super(msg);
    // 初始化错误码
        this.code = code;
    }


}
