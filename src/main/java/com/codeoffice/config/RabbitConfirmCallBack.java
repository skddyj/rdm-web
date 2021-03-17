//package com.codeoffice.config;
//
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.amqp.rabbit.connection.CorrelationData;
//import org.springframework.amqp.rabbit.core.RabbitTemplate;
//
//public class RabbitConfirmCallBack
//        implements RabbitTemplate.ConfirmCallback {
//
//    private static final Logger logger = LoggerFactory.getLogger(RabbitConfirmCallBack.class);
//
//    @Override
//    public void confirm(CorrelationData correlationData, boolean ack, String cause) {
//        logger.info("消息唯一标识: {}", correlationData);
//        logger.info("确认状态: {}", ack);
//        logger.info("造成原因: {}", cause);
//    }
//}