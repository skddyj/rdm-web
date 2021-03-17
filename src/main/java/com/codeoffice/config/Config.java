//package com.codeoffice.config;
//
//import java.util.HashMap;
//import java.util.Map;
//
//import com.codeoffice.constant.MqConfig2;
//import org.springframework.amqp.core.Binding;
//import org.springframework.amqp.core.BindingBuilder;
//import org.springframework.amqp.core.DirectExchange;
//import org.springframework.amqp.core.Queue;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//public class Config {
//
//    // 创建一个即时消费队列
//    @Bean
//    public Queue immediateQueue() {
//        // 第一个参数是创建的queue的名字，第二个参数是是否支持持久化
//        return new Queue(MqConfig2.TEST_IMMEDIATE_QUEUE, true);
//    }
//
//    // 创建一个延时消费队列
//    @Bean
//    public Queue delayQueue() {
//        Map<String, Object> params = new HashMap<>();
//        // x-dead-letter-exchange 声明了队列里的死信转发到的DLX名称，
//        params.put("x-dead-letter-exchange", MqConfig2.TEST_IMMEDIATE_EXCHANGE);
//        // x-dead-letter-routing-key 声明了这些死信在转发时携带的 routing-key 名称。
//        params.put("x-dead-letter-routing-key", MqConfig2.TEST_IMMEDIATE_ROUTING_KEY);
//        return new Queue(MqConfig2.TEST_DELAY_QUEUE, true, false, false, params);
//    }
//
//    // 即时消费交换机
//    @Bean
//    public DirectExchange immediateExchange() {
//        // 一共有三种构造方法，可以只传exchange的名字， 第二种，可以传exchange名字，是否支持持久化，是否可以自动删除，
//        //第三种在第二种参数上可以增加Map，Map中可以存放自定义exchange中的参数
//        return new DirectExchange(MqConfig2.TEST_IMMEDIATE_EXCHANGE, true, false);
//    }
//
//    // 死信交换机
//    @Bean
//    public DirectExchange deadLetterExchange() {
//        // 一共有三种构造方法，可以只传exchange的名字， 第二种，可以传exchange名字，是否支持持久化，是否可以自动删除，
//        //第三种在第二种参数上可以增加Map，Map中可以存放自定义exchange中的参数
//        return new DirectExchange(MqConfig2.TEST_DEAD_EXCHANGE, true, false);
//    }
//
//    //把立即消费的队列和立即消费的exchange绑定
//    @Bean
//    public Binding immediateBinding() {
//        return BindingBuilder.bind(immediateQueue()).to(immediateExchange()).with(MqConfig2.TEST_IMMEDIATE_ROUTING_KEY);
//    }
//
//    //把延时消费的队列和延迟消费的exchange绑定
//    @Bean
//    public Binding delayBinding() {
//        return BindingBuilder.bind(delayQueue()).to(deadLetterExchange()).with(MqConfig2.TEST_DELAY_ROUTING_KEY);
//    }
//}