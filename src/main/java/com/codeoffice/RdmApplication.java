package com.codeoffice;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@EnableCaching
@ServletComponentScan
@EnableSwagger2
@SpringBootApplication( exclude = { DataSourceAutoConfiguration.class})
@EnableScheduling
@MapperScan(basePackages = {"com.codeoffice.mapper"})
public class RdmApplication {

    public static void main(String[] args) {
        SpringApplication.run(RdmApplication.class, args);
    }

}
