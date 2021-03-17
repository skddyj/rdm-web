package com.codeoffice.config.session;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;

/**
 * @author: DongYanJun
 * @date: 2021/3/2 16:35
 */
@Configuration
public class SpringRedisSessionConfig {

    /**
     * 更换默认的redis session序列化器
     * 需要所有服务都添加这个配置类
     * 同时允许关联对象的添加
     * @return
     */
    @Bean("springSessionDefaultRedisSerializer")
    public RedisSerializer setSerializer(){
        return new GenericJackson2JsonRedisSerializer();
    }
}
