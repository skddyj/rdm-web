package com.codeoffice.utils;

import com.alibaba.fastjson.JSON;
import com.carrotsearch.sizeof.RamUsageEstimator;
import com.codeoffice.common.exception.RdmException;
import com.codeoffice.entity.RedisConnection;
import com.codeoffice.mapper.RedisConnectionMapper;
import com.google.common.collect.Maps;
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;
import io.lettuce.core.support.ConnectionPoolSupport;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Objects;

@Component
@Slf4j
public class LettuceConnectionPoolUtil implements InitializingBean {

    private Map<Long, Map<Integer, GenericObjectPool>> lettuceConnectionPoolMap;

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
     * @description: 初始化连接池Map
     * @date: 2021/3/16 9:46
     * @param: []
     * @return: void
     */
    private void initLettuceConnectionPoolMap() {
        if (this.lettuceConnectionPoolMap == null) {
            log.info("初始化lettuceConnectionPoolMap");
            this.lettuceConnectionPoolMap = Maps.newConcurrentMap();
        }
    }

    /**
     * @description: 打印连接池Map
     * @date: 2021/3/16 16:26
     * @param: []
     * @return: void
     */
    public void printLettuceConnectionPoolMap() {
        log.info("Redis连接个数：{}，map：{}", lettuceConnectionPoolMap.size(), lettuceConnectionPoolMap.keySet());
    }

    /**
     * @description: 获取连接池
     * @date: 2021/3/16 16:24
     * @param: [id, database]
     * @return: org.apache.commons.pool2.impl.GenericObjectPool
     */
    private GenericObjectPool getLettuceConnectionPool(Long id, Integer database) {
        if (Objects.isNull(database)) {
            throw new RdmException(RdmException.Type.DATABASE_INDEX_IS_NULL, "database不能为空");
        }
        Map<Integer, GenericObjectPool> poolMap = this.lettuceConnectionPoolMap.get(id);
        if (this.lettuceConnectionPoolMap.get(id) == null) {
            return createLettuceConnectionPool(id);
        }
        return poolMap.get(database);
    }

    /**
     * @description: 获取连接池Map
     * @date: 2021/3/16 16:35
     * @param: [id]
     * @return: java.util.Map<java.lang.Integer, org.apache.commons.pool2.impl.GenericObjectPool>
     */
    private Map<Integer, GenericObjectPool> getLettuceConnectionPoolMap(Long id) {
        return this.lettuceConnectionPoolMap.get(id);
    }

    /**
     * @description: 删除连接池Map
     * @date: 2021/3/16 16:24
     * @param: [id, database]
     * @return: io.lettuce.core.api.StatefulRedisConnection
     */
    public Map<Integer, GenericObjectPool> removeLettuceConnectionPoolMap(Long id) {
        return lettuceConnectionPoolMap.remove(id);
    }

    /**
     * @description: 获取database数量
     * @date: 2021/3/16 16:27
     * @param: [id]
     * @return: java.lang.Integer
     */
    public Integer getRedisConfigDatabaseNumber(Long id) {
        GenericObjectPool<StatefulRedisConnection> pool = null;
        StatefulRedisConnection connection = null;
        try {
            pool = this.getLettuceConnectionPool(id, 0);
            connection = pool.borrowObject();
            RedisCommands<String, String> commands = connection.sync();
            Map result = commands.configGet("databases");
            System.out.println("databases:" + result);
            System.out.println(RamUsageEstimator.sizeOf(lettuceConnectionPoolMap) + "B");
            return 0;
        } catch (Exception e) {
            log.info("redis连接异常：{}", e);
            return 0;
        } finally {
            pool.returnObject(connection);
        }
    }

    /**
     * @description: 测试连接
     * @date: 2021/3/16 16:31
     * @param: [redisConnection, addToMap]
     * @return: boolean
     */
    public boolean pingLettuceConnection(RedisConnection redisConnection) {
        try {
            int database = 0;
            StopWatch stopWatch=new StopWatch();
            stopWatch.start();
            RedisURI redisUri = RedisURI.builder()
                    .withHost(redisConnection.getHost())
                    .withPort(redisConnection.getPort())
                    .withPassword(redisConnection.getPassword())
                    .withTimeout(Duration.of(timeout, ChronoUnit.MILLIS))
                    .withDatabase(database)
                    .build();
            RedisClient client = RedisClient.create(redisUri);
            stopWatch.stop();
            System.out.println("耗时11："+stopWatch.getTotalTimeMillis());



            StatefulRedisConnection<String, String> connection = client.connect();

            Map<Long,RedisClient> map=Maps.newConcurrentMap();
            map.put(3470038521413632L,client);

            System.out.println(RamUsageEstimator.sizeOf(map) + "B1");

            Map<Long,RedisClient> map2=Maps.newConcurrentMap();
            map2.put(3470038521413631L,client);
            map2.put(3470038521413632L,client);
            map2.put(3470038521413633L,client);
            map2.put(3470038521413634L,client);
            map2.put(3470038521413635L,client);
            map2.put(3470038521413636L,client);
            map2.put(3470038521413637L,client);
            map2.put(3470038521413638L,client);
            map2.put(3470038521413639L,client);
            map2.put(3470038521413640L,client);
            map2.put(3470038521413641L,client);
            map2.put(3470038521413642L,client);
            map2.put(3470038521413643L,client);
            map2.put(3470038521413644L,client);
            map2.put(3470038521413645L,client);
            map2.put(3470038521413646L,client);

            System.out.println(RamUsageEstimator.sizeOf(map2) + "B2");
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
     * @description: 创建连接池
     * @date: 2021/3/16 16:41
     * @param: [id]
     * @return: org.apache.commons.pool2.impl.GenericObjectPool
     */
    public GenericObjectPool createLettuceConnectionPool(Long id) {
        //集群Redis
        //RedisClusterClient client = RedisClusterClient.create(list);
        int database = 0;
        RedisConnection redisConnection = redisConnectionMapper.selectByPrimaryKey(id);
        GenericObjectPool pool = this.createLettuceConnectionPool(redisConnection, database);
        return pool;
    }

    /**
     * @description: 创建连接池
     * @date: 2021/3/16 16:38
     * @param: [redisConnection, database]
     * @return: org.apache.commons.pool2.impl.GenericObjectPool
     */
    public GenericObjectPool createLettuceConnectionPool(RedisConnection redisConnection, int database) {
        //集群Redis
        //RedisClusterClient client = RedisClusterClient.create(list);
        RedisURI redisUri = RedisURI.builder()
                .withHost(redisConnection.getHost())
                .withPort(redisConnection.getPort())
                .withPassword(redisConnection.getPassword())
                .withTimeout(Duration.of(timeout, ChronoUnit.MILLIS))
                .withDatabase(database)
                .build();
        RedisClient client = RedisClient.create(redisUri);

        GenericObjectPoolConfig<StatefulRedisConnection<String, String>> poolConfig = new GenericObjectPoolConfig();
        poolConfig.setMaxIdle(maxIdle);
        poolConfig.setMinIdle(minIdle);
        poolConfig.setMaxTotal(maxActive);
        poolConfig.setMaxWaitMillis(maxWait);
        poolConfig.setMinEvictableIdleTimeMillis(1000 * 30);
        GenericObjectPool<StatefulRedisConnection<String, String>> pool = ConnectionPoolSupport.createGenericObjectPool(() -> {
            log.info("Requesting new StatefulRedisConnection " + System.currentTimeMillis());
            return client.connect();
        }, poolConfig);

        Map<Integer, GenericObjectPool> poolMap = this.getLettuceConnectionPoolMap(redisConnection.getId());
        if (poolMap == null) {
            poolMap = Maps.newConcurrentMap();
        }
        poolMap.put(database, pool);
        this.lettuceConnectionPoolMap.put(redisConnection.getId(), poolMap);
        return pool;
    }


    @Override
    public void afterPropertiesSet() throws Exception {
        this.initLettuceConnectionPoolMap();
    }
}
