package com.codeoffice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean
    public SimpleClientHttpRequestFactory httpRequestFactory(){
        SimpleClientHttpRequestFactory httpRequestFactory=new SimpleClientHttpRequestFactory();
        httpRequestFactory.setReadTimeout(5000);// 单位毫秒
        httpRequestFactory.setConnectTimeout(5000);// 单位毫秒
        return httpRequestFactory;
    }

    @Bean
    public RestTemplate restTemplate(){
        RestTemplate restTemplate=new RestTemplate();
        restTemplate.setRequestFactory(httpRequestFactory());
        return restTemplate;
    }
}
