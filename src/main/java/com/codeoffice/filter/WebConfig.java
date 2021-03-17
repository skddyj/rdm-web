package com.codeoffice.filter;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;


/**
 * 引入第三方过滤器 将其放入spring容器
 * Created by Fant.J.
 */

@Configuration
public class WebConfig {
    @Bean
    public FilterRegistrationBean timeFilter(){
        //创建 过滤器注册bean
        FilterRegistrationBean registrationBean = new FilterRegistrationBean();
        TimeCalculateFilter timeFilter = new TimeCalculateFilter();
        registrationBean.setFilter(timeFilter);
        List urls = new ArrayList();
        urls.add("/*");   //给所有请求加过滤器
        //设置 有效url
        registrationBean.setUrlPatterns(urls);
        return registrationBean;
    }
}
