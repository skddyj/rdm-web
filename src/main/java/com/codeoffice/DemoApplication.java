package com.codeoffice;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@EnableRedisHttpSession(maxInactiveIntervalInSeconds=30)
@EnableCaching  // 启用缓存
@ServletComponentScan // 扫描servlet
@EnableSwagger2
@EnableRabbit
@SpringBootApplication( exclude = { DataSourceAutoConfiguration.class})
@EnableScheduling
@MapperScan(basePackages = {"com.codeoffice.mapper"})
// FilterType为一个枚举类,总共有5个值,也就是说type总共有5个可选值
// ANNOTATION,//按照注解方式
//	ASSIGNABLE_TYPE,//按照指定类型的方式
//	ASPECTJ,//使用ASPECTJ表达式的方式-------没用过,不演示
//	REGEX,//利用正则表达式进行指定-----------没用过,不演示
//	CUSTOM//自己实现TypeFilter接口进行自定义规则

// 如果放在excludeFilters里,会过滤掉符合条件的类-----即不扫描
// 如果放在includeFilters里,会扫描符合条件的类-------即扫描
// @ComponentScan(excludeFilters = {@Filter(type = FilterType.ASSIGNABLE_TYPE,value={Product.class})})

// @SpringBootApplication和@ComponentScan一起使用会报@springbootapplication already applies given @ComponentScan
// 因为@SpringBootApplication已经包含了@ComponentScan ，这个时候需要使用@SpringBootApplication(scanBasePackages = "")
public class DemoApplication {

    public static void main(String[] args) {
        // EmbedZookeeperServer.start(2181);
        SpringApplication.run(DemoApplication.class, args);
    }

}
