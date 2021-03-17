package com.codeoffice.utils;

import com.codeoffice.entity.RedisConnection;
import com.google.common.collect.Maps;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.connection.RedisConfiguration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettucePoolingClientConfiguration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.Set;

@Component
@Slf4j
public class RedisUtil implements InitializingBean {

    private Map<Long, RedisTemplate> redisConnectionMap;

    @Value("${spring.redis.timeout}")
    private long timeout;

    @Value("${spring.redis.lettuce.pool.max-idle}")
    private int maxIdle;

    @Value("${spring.redis.lettuce.pool.min-idle}")
    private int minIdle;

    @Value("${spring.redis.lettuce.pool.max-active}")
    private int maxActive;

    @Value("${spring.redis.lettuce.pool.max-wait}")
    private long maxWait;

    /**
     * 初始化map
     */
    private void initRedisConnectionMap() {
        if (this.redisConnectionMap == null) {
            log.info("初始化redisConnectionMap");
            this.redisConnectionMap = Maps.newConcurrentMap();
        }
    }

    /**
     * @description:
     * @date: 2021/3/15 15:07
     * @param: []
     * @return: void
     */
    public void printRedisConnectionMap() {
        log.info("Redis连接个数：{}，map：{}", redisConnectionMap.size(), redisConnectionMap);
    }

    /**
     * 获取连接
     *
     * @param id
     * @return
     */
    private RedisTemplate getRedisConnection(Long id) {
        return this.redisConnectionMap.get(id);
    }

    /**
     * 获取连接
     *
     * @param id
     * @return
     */
    public RedisTemplate removeRedisConnection(Long id) {
        return this.redisConnectionMap.remove(id);
    }

    /**
     * 测试连接
     *
     * @param redisConnection
     * @return
     */
    public boolean testRedisConnection(RedisConnection redisConnection, boolean addToMap) {
        try {

            RedisTemplate redisTemplate = this.getRedisTemplate(getLettuceClientConfiguration(getRedisStandaloneConfiguration(redisConnection)));
            Set<String> keys = redisTemplate.keys("*");
            if (addToMap) {
                this.redisConnectionMap.put(redisConnection.getId(), redisTemplate);
            }
            return true;
        } catch (Exception e) {
            log.info("redis连接异常：{}", e);
            return false;
        }
    }


    /**
     * 添加redis连接
     *
     * @param redisConnection
     * @return
     */
    public boolean addRedisConnection(RedisConnection redisConnection) {
        return this.testRedisConnection(redisConnection, true);
    }

    public GenericObjectPoolConfig genericObjectPoolConfig() {
        GenericObjectPoolConfig genericObjectPoolConfig = new GenericObjectPoolConfig();
        genericObjectPoolConfig.setMaxIdle(maxIdle);
        genericObjectPoolConfig.setMinIdle(minIdle);
        genericObjectPoolConfig.setMaxTotal(maxActive);
        genericObjectPoolConfig.setMaxWaitMillis(maxWait);
        return genericObjectPoolConfig;
    }

    public RedisStandaloneConfiguration getRedisStandaloneConfiguration(RedisConnection redisConnection) {
        // 单机redis
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
        redisStandaloneConfiguration.setHostName(redisConnection.getHost());
        redisStandaloneConfiguration.setPort(redisConnection.getPort());
        redisStandaloneConfiguration.setPassword(redisConnection.getPassword());
        redisStandaloneConfiguration.setDatabase(0);
        return redisStandaloneConfiguration;
    }

    public LettuceConnectionFactory getLettuceClientConfiguration(RedisConfiguration redisConfiguration) {
        LettuceClientConfiguration clientConfiguration = LettucePoolingClientConfiguration
                .builder()
                .commandTimeout(Duration.ofMillis(timeout))
                .poolConfig(this.genericObjectPoolConfig())
                .build();
        LettuceConnectionFactory connectionFactory = new LettuceConnectionFactory(redisConfiguration, clientConfiguration);
        connectionFactory.afterPropertiesSet();
        return connectionFactory;
    }

    public RedisTemplate<Object, Object> getRedisTemplate(
            RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<Object, Object> redisTemplate = new RedisTemplate();
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<>(Object.class);
        // key序列化
        redisTemplate.setKeySerializer(stringRedisSerializer);
        // hash的key序列化
        redisTemplate.setHashKeySerializer(stringRedisSerializer);
        // value序列化
        redisTemplate.setValueSerializer(jackson2JsonRedisSerializer);
        // hash的value序列化
        redisTemplate.setHashKeySerializer(jackson2JsonRedisSerializer);
        redisTemplate.afterPropertiesSet();
        return redisTemplate;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        this.initRedisConnectionMap();
    }
}
