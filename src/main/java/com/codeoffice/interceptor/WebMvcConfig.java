//package com.codeoffice.interceptor;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class WebMvcConfig implements WebMvcConfigurer {
//
//  @Bean
//  public AuthInterceptor authInterceptor(){
//    return  new AuthInterceptor();
//  }
//
//
//  @Override
//  public void addInterceptors(InterceptorRegistry registry) {
//     registry.addInterceptor(authInterceptor()).excludePathPatterns("/static").addPathPatterns("/**");
//
//  }
//
//  @Override
//  public void addCorsMappings(CorsRegistry registry) {
//    registry.addMapping("/**") //拦截所有的url
//        .allowedOrigins("*") // 放行哪些原始域，比如"http://domain1.com,https://domain2.com"
//        .allowedHeaders("*") // 允许任何请求头
//        .allowCredentials(true) // 是否发送Cookie信息
//        .allowedMethods("*") // 放行哪些原始域(请求方式)
//        .maxAge(3600); // 表明在3600秒内，不需要再发送预检验请求，可以缓存该结果
//  }
//
//
//}
