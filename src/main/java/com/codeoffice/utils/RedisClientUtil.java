package com.codeoffice.utils;

import com.alibaba.fastjson.JSON;
import com.codeoffice.common.exception.RdmException;
import com.codeoffice.entity.RedisConnection;
import com.codeoffice.mapper.RedisConnectionMapper;
import com.google.common.collect.Maps;
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Objects;

@Component
@Slf4j
public class RedisClientUtil implements InitializingBean {

    private Map<Long, Map<Integer, RedisClient>> redisClientMap;

    @Autowired
    private RedisConnectionMapper redisConnectionMapper;

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

    private RedisURI redisURI;

    /**
     * @description: 初始化 RedisClientMap
     * @date: 2021/3/16 9:46
     * @param: []
     * @return: void
     */
    private void initLettuceConnectionPoolMap() {
        if (this.redisClientMap == null) {
            log.info("初始化redisClientMap");
            this.redisClientMap = Maps.newConcurrentMap();
        }
    }

    /***
     * @description : 打印 RedisClientMap
     * @date:
     * @author: dongyanjun
     * @param:
     * @return: void
     */
    public void printRedisClientMap() {
        log.info("Redis连接个数：{}，map：{}", redisClientMap.size(), redisClientMap);
    }

    /**
     * @description : 获取RedisClient
     * @date:
     * @author: dongyanjun
     * @param: id
     * @param: database
     * @return: io.lettuce.core.RedisClient
     */
    public RedisClient getRedisClient(Long id, Integer database) {
        if (Objects.isNull(database)) {
            throw new RdmException(RdmException.Type.DATABASE_INDEX_IS_NULL, "database不能为空");
        }
        Map<Integer, RedisClient> poolMap = this.redisClientMap.get(id);
        if (poolMap == null || poolMap.get(database) == null) {
            return createRedisClient(id, database);
        }
        return poolMap.get(database);
    }

    /**
     * @description: 获取RedisClientMap
     * @date: 2021/3/16 16:35
     * @param: [id]
     * @return: java.util.Map<java.lang.Integer, org.apache.commons.pool2.impl.GenericObjectPool>
     */
    public Map<Integer, RedisClient> getRedisClientMap(Long id) {
        return this.redisClientMap.get(id);
    }

    /**
     * @description: 删除RedisClientMap
     * @date: 2021/3/16 16:24
     * @param: [id, database]
     * @return: io.lettuce.core.api.StatefulRedisConnection
     */
    public Map<Integer, RedisClient> removeRedisClientMap(Long id) {
        return redisClientMap.remove(id);
    }

    /**
     * @description: 测试连接
     * @date: 2021/3/16 16:31
     * @param: [redisConnection, addToMap]
     * @return: boolean
     */
    public boolean pingRedisConnection(RedisConnection redisConnection) {
        try {
            int database = 0;
            RedisURI redisUri = RedisURI.builder()
                    .withHost(redisConnection.getHost())
                    .withPort(redisConnection.getPort())
                    .withPassword(redisConnection.getPassword())
                    .withTimeout(Duration.of(timeout, ChronoUnit.MILLIS))
                    .withDatabase(database)
                    .build();
            RedisClient client = RedisClient.create(redisUri);
            client.connect();
            return true;
        } catch (Exception e) {
            log.info("redis连接异常：{}", e);
            return false;
        }
    }

    private void aaa() {
        RedisURI redisUri = RedisURI.builder()
                .withHost("127.0.0.1")
                .withPort(6381)
                .withPassword("Alex@1016")
                .withTimeout(Duration.of(500, ChronoUnit.MILLIS))
                .build();
        RedisClient client = RedisClient.create(redisUri);
        StatefulRedisConnection<String, String> connection = client.connect();
        RedisCommands<String, String> commands = connection.sync();
        String a = connection.sync().ping();
        Map aa = commands.configGet("databases");
        System.out.println(JSON.toJSONString(aa));
//        connection.sync().ping();

        /*RedisAsyncCommands<String, String> commands = connection.async();
        List<RedisFuture<String>> redisFutureList = new ArrayList<>();
        for (int i = 0; i < 1; ++i) {
            RedisFuture<String> future = commands.get("a");
            redisFutureList.add(future);
            try {
                future.get();
            } catch (Exception e) {

        }
        redisFutureList.forEach(f -> {
            try {
                f.get();
            } catch (Exception e) {
                e.printStackTrace();
            }
        });*/

    }

    /**
     * @description: 创建RedisClient
     * @date: 2021/3/16 16:41
     * @param: [id]
     * @return: org.apache.commons.pool2.impl.GenericObjectPool
     */
    public RedisClient createRedisClient(Long id, Integer database) {
        //集群Redis
        //RedisClusterClient client = RedisClusterClient.create(list);
        RedisConnection redisConnection = redisConnectionMapper.selectByPrimaryKey(id);
        RedisClient redisClient = this.createRedisClient(redisConnection, database);
        return redisClient;
    }

    /**
     * @description: 创建连接池
     * @date: 2021/3/16 16:38
     * @param: [redisConnection, database]
     * @return: org.apache.commons.pool2.impl.GenericObjectPool
     */
    public RedisClient createRedisClient(RedisConnection redisConnection, int database) {
        //集群Redis
        //RedisClusterClient client = RedisClusterClient.create(list);
        RedisURI redisUri = RedisURI.builder()
                .withHost(redisConnection.getHost())
                .withPort(redisConnection.getPort())
                .withPassword(redisConnection.getPassword())
                .withTimeout(Duration.of(timeout, ChronoUnit.MILLIS))
                .withDatabase(database)
                .build();
        RedisClient redisClient = RedisClient.create(redisUri);

        Map<Integer, RedisClient> clientMap = this.getRedisClientMap(redisConnection.getId());
        if (clientMap == null) {
            clientMap = Maps.newConcurrentMap();
        }
        clientMap.put(database, redisClient);
        this.redisClientMap.put(redisConnection.getId(), clientMap);
        return redisClient;
    }

    /**
     * @description: 获取Redis连接
     * @date: 2021/3/17
     * @param: redisConnection
     * @param: database
     * @return: io.lettuce.core.RedisClient
     */
    public StatefulRedisConnection getRedisConnection(Long id, Integer databaseId) {
        RedisClient redisClient = this.getRedisClient(id, databaseId);
        return redisClient.connect();
    }


    @Override
    public void afterPropertiesSet() throws Exception {
        this.initLettuceConnectionPoolMap();
    }
}
