package com.example.aicode.ai;

import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.service.AiServices;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiGenCodeServiceFactor {
    @Resource
    OpenAiChatModel openAiChatModel;
    @Resource
    OpenAiStreamingChatModel streamingChatModel;

    @Bean
    public AiCodeGeneratorService AiGenCodeService(){
        return AiServices.builder(AiCodeGeneratorService.class).
                chatModel(openAiChatModel).
                streamingChatModel(streamingChatModel).
                build();
    }
}
