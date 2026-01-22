package com.example.aicode.core.parser;

public interface CodeParser<T> {
    /**
     * 解析方法，用于解析输入的代码字符串
     *
     * @param codeContent 需要解析的代码字符串
     * @return 解析后的结果字符串
     */
    T parseCode(String codeContent);  // 定义一个parse方法，接收一个String类型的code参数，返回一个String类型的结果
}
