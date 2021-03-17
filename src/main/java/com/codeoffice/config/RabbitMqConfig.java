//package com.codeoffice.config;
//
//import org.springframework.amqp.rabbit.core.RabbitTemplate;
//import org.springframework.beans.factory.InitializingBean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class RabbitMqConfig implements InitializingBean {
//
//    private RabbitTemplate rabbitTemplate;
//
//    @Override
//    public void afterPropertiesSet() throws Exception {
//        rabbitTemplate.setConfirmCallback(new RabbitConfirmCallBack());
//        rabbitTemplate.setReturnCallback(new RabbitReturnCallback());
//    }
//}
