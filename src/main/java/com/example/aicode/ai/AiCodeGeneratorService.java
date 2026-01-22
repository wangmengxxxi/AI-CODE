package com.example.aicode.ai;

import com.example.aicode.ai.model.HtmlCodeResult;
import com.example.aicode.ai.model.MultiFileCodeResult;
import dev.langchain4j.service.SystemMessage;
import reactor.core.publisher.Flux;


public interface AiCodeGeneratorService {

/**
 * 生成HTML代码的方法
 * 根据用户输入的消息生成对应的HTML代码
 *
 * @param userMessage 用户输入的消息内容
 * @return 返回生成的HTML代码字符串
 *
 */
    @SystemMessage(fromResource = "prompt/codegen-html-system-prompt.txt")
    HtmlCodeResult generateHtmlCode(String userMessage);

/**
 * 生成多条回复消息的方法
 *
 * @param userMessage 用户输入的消息内容
 * @return 返回生成的多条回复消息，以字符串形式返回
 */
    @SystemMessage(fromResource = "prompt/codegen-multi-system-prompt.txt")
    MultiFileCodeResult generateMultiFileCode(String userMessage);

/**
 * 生成HTML代码的Flux流
 * 该方法用于返回一个包含HTML代码的响应式流(Flux)
 *
 * @param userMessage 用户输入的消息，将用于生成相应的HTML代码
 * @return Flux<String> 返回一个包含HTML代码的字符串响应式流
 */
@SystemMessage(fromResource = "prompt/codegen-html-system-prompt.txt")
    Flux<String> generateHtmlCodeStream(String userMessage);

/**
 * 生成一个多代码响应的Flux流
 * 该方法接收用户消息并返回一个包含多个代码字符串的响应流
 *
 * @param userMessage 用户输入的消息内容
 * @return Flux<String> 包含多个代码字符串的响应流，每个字符串代表一个代码块
 */
@SystemMessage(fromResource = "prompt/codegen-multi-system-prompt.txt")
    Flux<String> generateMultiFileCodeStream(String userMessage);


}
