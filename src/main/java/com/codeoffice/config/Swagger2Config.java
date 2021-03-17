package com.codeoffice.config;

import io.swagger.annotations.ApiOperation;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
public class Swagger2Config {
    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .select().apis(RequestHandlerSelectors.withMethodAnnotation(ApiOperation.class)).build();
                //为当前包路径
//                .apis(RequestHandlerSelectors.basePackage("com.zoma.shop.userservice.controller"))
//                .paths(PathSelectors.any())
//                .build();
    }
    //构建 api文档的详细信息函数,注意这里的注解引用的是哪个
    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                //页面标题
                .title("Spring Boot 使用 Swagger2 构建RESTful API")
                //创建人
                .contact(new Contact("alex", "http://www.baidu.com", "skddyj@qq.com"))
                //版本号
                .version("1.0")
                //描述
                .description("API 描述")
                .build();
    }
}
