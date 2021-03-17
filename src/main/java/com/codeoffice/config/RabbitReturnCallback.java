//package com.codeoffice.config;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.amqp.core.Message;
//import org.springframework.amqp.rabbit.core.RabbitTemplate;
//
//public class RabbitReturnCallback
//        implements RabbitTemplate.ReturnCallback {
//
//    private static final Logger logger = LoggerFactory.getLogger(RabbitReturnCallback.class);
//
//    @Override
//    public void returnedMessage(Message message, int replyCode, String replyText, String exchange, String routingKey) {
//        logger.info("消息主体: {}", message);
//        logger.info("回复编码: {}", replyCode);
//        logger.info("回复内容: {}", replyText);
//        logger.info("交换器: {}", exchange);
//        logger.info("路由键: {}", routingKey);
//    }
//}