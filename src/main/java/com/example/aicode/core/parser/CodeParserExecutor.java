package com.example.aicode.core.parser;

import com.example.aicode.exception.BusinessException;
import com.example.aicode.exception.ErrorCode;
import com.example.aicode.model.enums.CodeGenTypeEnum;

public class CodeParserExecutor {
    //将两个干活的具体类定义为final，变成类似工具类的存在，方便后续调用，节约不必要的new对象资源
    public static final HtmlCodeParser htmlCodeParser=new HtmlCodeParser();
    public static final MultiFileCodeParser multiFileCodeParser=new MultiFileCodeParser();

    public static Object executeParser(String code, CodeGenTypeEnum codeGenType){
        return switch (codeGenType){
            case HTML -> htmlCodeParser.parseCode(code);
            case MULTI_FILE -> multiFileCodeParser.parseCode(code);
            default -> throw new  BusinessException(ErrorCode.SYSTEM_ERROR,"不支持生成的代码类型"+codeGenType);
        };
    }
}
