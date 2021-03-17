//package com.codeoffice.freemarker;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.Ordered;
//import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
//import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
//
//@Configuration
//public class MvcConfigurer extends WebMvcConfigurerAdapter {
//
//    @Override
//    public void addViewControllers(ViewControllerRegistry registry) {
//        registry.addViewController("index").setViewName("index.ftl");
//        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
//    }
//
//    @Override
//    public void configurePathMatch(PathMatchConfigurer configurer) {
//        super.configurePathMatch(configurer);
//        configurer.setUseSuffixPatternMatch(false);
//    }
//}