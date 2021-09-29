package com.codeoffice.utils;

import com.codeoffice.common.enums.ConnectionType;
import com.codeoffice.common.exception.RdmException;
import com.codeoffice.entity.RedisConnection;
import com.codeoffice.mapper.RedisConnectionMapper;
import com.google.common.collect.Maps;
import io.lettuce.core.AbstractRedisClient;
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import io.lettuce.core.api.StatefulConnection;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;
import io.lettuce.core.cluster.ClusterClientOptions;
import io.lettuce.core.cluster.ClusterTopologyRefreshOptions;
import io.lettuce.core.cluster.RedisClusterClient;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
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

    private Map<Long, Map<Integer, AbstractRedisClient>> allRedisClientMap;

    private Map<Long, RedisConnection> redisConnectionMap;

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
        if (this.allRedisClientMap == null) {
            log.info("初始化redisClientMap和redisConnectionMap");
            this.allRedisClientMap = Maps.newConcurrentMap();
            this.redisConnectionMap = Maps.newConcurrentMap();
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
        log.info("Redis连接个数：{}，map：{}", allRedisClientMap.size(), allRedisClientMap);
    }

    /**
     * @description : 获取RedisClient
     * @date:
     * @author: dongyanjun
     * @param: id
     * @param: database
     * @return: io.lettuce.core.RedisClient
     */
    public AbstractRedisClient getRedisClient(Long id, Integer database) {
        if (Objects.isNull(database)) {
            throw new RdmException(RdmException.Type.DATABASE_INDEX_IS_NULL, "database不能为空");
        }
        Map<Integer, AbstractRedisClient> poolMap = this.getRedisClientMap(id);
        if (poolMap != null && poolMap.get(database) != null) {
            return poolMap.get(database);
        } else {
            return createRedisClient(id, database);
        }
    }

    /**
     * @description : 获取RedisClient
     * @date:
     * @author: dongyanjun
     * @param: id
     * @param: database
     * @return: io.lettuce.core.RedisClient
     */
    public RedisConnection getRedisConnection(Long id) {
        if (this.getRedisConnectionMap() != null && this.getRedisConnectionMap().get(id) != null) {
            return this.redisConnectionMap.get(id);
        } else {
            return createRedisConnection(id);
        }
    }

    /**
     * @description: 获取RedisClientMap
     * @date: 2021/3/16 16:35
     * @param: [id]
     * @return: java.util.Map<java.lang.Integer, org.apache.commons.pool2.impl.GenericObjectPool>
     */
    public Map<Long, Map<Integer, AbstractRedisClient>> getAllRedisClientMap() {
        log.info("allRedisClientMap:{}", allRedisClientMap);
        return this.allRedisClientMap;
    }

    /**
     * @description: 获取RedisClientMap
     * @date: 2021/3/16 16:35
     * @param: [id]
     * @return: java.util.Map<java.lang.Integer, org.apache.commons.pool2.impl.GenericObjectPool>
     */
    public Map<Integer, AbstractRedisClient> getRedisClientMap(Long id) {
        log.info("redisClientMap:{}", allRedisClientMap);
        return this.allRedisClientMap.get(id);
    }

    /**
     * @description: 获取RedisClientMap
     * @date: 2021/3/16 16:35
     * @param: [id]
     * @return: java.util.Map<java.lang.Integer, org.apache.commons.pool2.impl.GenericObjectPool>
     */
    public Map<Long, RedisConnection> getRedisConnectionMap() {
        log.info("redisConnectionMap:{}", redisConnectionMap);
        return this.redisConnectionMap;
    }

    /**
     * @description: 获取RedisClientMap
     * @date: 2021/3/16 16:35
     * @param: [id]
     * @return: java.util.Map<java.lang.Integer, org.apache.commons.pool2.impl.GenericObjectPool>
     */
    public Integer getRedisConnectionType(Long id) {
        return this.getRedisConnection(id).getType();
    }

    /**
     * @description: 删除RedisClientMap
     * @date: 2021/3/16 16:24
     * @param: [id, database]
     * @return: io.lettuce.core.api.StatefulRedisConnection
     */
    public Map<Integer, AbstractRedisClient> removeRedisClientMap(Long id) {
        return allRedisClientMap.remove(id);
    }

    /**
     * @description: 删除RedisClientConnection
     * @date: 2021/3/16 16:24
     * @param: [id, database]
     * @return: io.lettuce.core.api.StatefulRedisConnection
     */
    public RedisConnection removeRedisConnection(Long id) {
        return redisConnectionMap.remove(id);
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
                    .withTimeout(Duration.of(timeout, ChronoUnit.MILLIS))
                    .withDatabase(database)
                    .build();
            if(StringUtils.isNotBlank(redisConnection.getPassword())){
                redisUri.setPassword(redisConnection.getPassword().toCharArray());
            }
            if (redisConnection.getType() == ConnectionType.DEFAULT.code) {
                RedisClient redisClient = RedisClient.create(redisUri);
                redisClient.connect();
            } else {
                RedisClusterClient redisClusterClient = RedisClusterClient.create(redisUri);
                redisClusterClient.connect();
            }
            return true;
        } catch (Exception e) {
            log.info("redis连接异常：{}", e);
            return false;
        }
    }

    private void test() {
        RedisURI redisUri = RedisURI.builder()
                .withHost("127.0.0.1")
                .withPort(6381)
                .withPassword("Alex@1016".toCharArray())
                .withTimeout(Duration.of(500, ChronoUnit.MILLIS))
                .build();
        RedisClient client = RedisClient.create(redisUri);
        StatefulRedisConnection<String, String> connection = client.connect();
        RedisCommands<String, String> commands = connection.sync();
        String a = connection.sync().ping();
        Map aa = commands.configGet("databases");
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
    public AbstractRedisClient createRedisClient(Long id, Integer database) {
        //集群Redis
        //RedisClusterClient client = RedisClusterClient.create(list);
        RedisConnection redisConnection = redisConnectionMapper.selectByPrimaryKey(id);
        AbstractRedisClient redisClient = this.createRedisClient(redisConnection, database);
        return redisClient;
    }

    /**
     * @description: 创建RedisConnection
     * @date: 2021/3/16 16:41
     * @param: [id]
     * @return: org.apache.commons.pool2.impl.GenericObjectPool
     */
    public RedisConnection createRedisConnection(Long id) {
        RedisConnection redisConnection = redisConnectionMapper.selectByPrimaryKey(id);
        this.redisConnectionMap.put(redisConnection.getId(), redisConnection);
        return redisConnection;
    }

    /**
     * @description: 创建连接池
     * @date: 2021/3/16 16:38
     * @param: [redisConnection, database]
     * @return: org.apache.commons.pool2.impl.GenericObjectPool
     */
    public AbstractRedisClient createRedisClient(RedisConnection redisConnection, int database) {
        //集群Redis
//        RedisURI redisUri = RedisURI.builder()
//                .withHost(redisConnection.getHost())
//                .withPort(redisConnection.getPort())
//                .withPassword(redisConnection.getPassword())
//                .withTimeout(Duration.of(timeout, ChronoUnit.MILLIS))
//                .withDatabase(database)
//                .build();
//        RedisClusterClient client = RedisClusterClient.create(redisUri);
        RedisURI redisUri = RedisURI.builder()
                .withHost(redisConnection.getHost())
                .withPort(redisConnection.getPort())
                .withTimeout(Duration.of(timeout, ChronoUnit.MILLIS))
                .withDatabase(database)
                .build();
        if(StringUtils.isNotBlank(redisConnection.getPassword())){
            redisUri.setPassword(redisConnection.getPassword().toCharArray());
        }
        Map<Integer, AbstractRedisClient> clientMap = this.getRedisClientMap(redisConnection.getId());
        if (clientMap == null) {
            clientMap = Maps.newConcurrentMap();
        }
        if (redisConnection.getType() == ConnectionType.DEFAULT.code) {
            RedisClient redisClient = RedisClient.create(redisUri);
            clientMap.put(database, redisClient);
            this.allRedisClientMap.put(redisConnection.getId(), clientMap);
            this.redisConnectionMap.put(redisConnection.getId(), redisConnection);
            return redisClient;
        } else if (redisConnection.getType() == ConnectionType.CLUSTER.code) {
            RedisClusterClient redisClusterClient = RedisClusterClient.create(redisUri);
            ClusterTopologyRefreshOptions topologyRefreshOptions = ClusterTopologyRefreshOptions.builder()
                    .enablePeriodicRefresh(Duration.ofMinutes(10)) // 定期刷新拓扑视图
                    .build();
            redisClusterClient.setOptions(ClusterClientOptions.builder()
                    .topologyRefreshOptions(topologyRefreshOptions)
                    .build());
            clientMap.put(database, redisClusterClient);
            this.allRedisClientMap.put(redisConnection.getId(), clientMap);
            this.redisConnectionMap.put(redisConnection.getId(), redisConnection);
            return redisClusterClient;
        }
        return null;
    }

    /**
     * @description: 获取Redis连接
     * @date: 2021/3/17
     * @param: redisConnection
     * @param: database
     * @return: io.lettuce.core.RedisClient
     */
    public StatefulConnection getStatefulConnection(Long id, Integer databaseId) {
        RedisConnection redisConnection = this.getRedisConnection(id);
        if (redisConnection != null) {
            if (redisConnection.getType() == ConnectionType.DEFAULT.code) {
                return ((RedisClient) this.getRedisClient(id, databaseId)).connect();
            } else if (redisConnection.getType() == ConnectionType.CLUSTER.code) {
                return ((RedisClusterClient) this.getRedisClient(id, databaseId)).connect();
            }
        }
        return null;
    }


    @Override
    public void afterPropertiesSet() throws Exception {
        this.initLettuceConnectionPoolMap();
    }
}
