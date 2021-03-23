package com.codeoffice.utils;

import com.codeoffice.model.RedisDataModel;
import io.lettuce.core.KeyValue;
import io.lettuce.core.RedisClient;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Slf4j
public class RedisOperationUtil {

    private Map<Long, Map<Integer, RedisClient>> redisClientMap;

    @Autowired
    private RedisClientUtil redisClientUtil;

    /**
     * @description: 获取database数量
     * @date: 2021/3/16 16:27
     * @param: [id]
     * @return: java.lang.Integer
     */
    public Integer getDatabaseCount(Long id) {
        StatefulRedisConnection connection = null;
        try {
            RedisClient redisClient = redisClientUtil.getRedisClient(id, 0);
            connection = redisClient.connect();
            RedisCommands<String, String> commands = connection.sync();
            Map<String, String> result = commands.configGet("databases");
            System.out.println("databases:" + result);
            return Integer.valueOf(result.get("databases"));
        } catch (Exception e) {
            log.info("redis连接异常：{}", e);
            return 0;
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
    }

    /**
     * @description: 获取database所有key
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public List<String> keys(Long id, Integer databaseId, String key) {
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            String pattern = StringUtils.isBlank(key) ? "*" : "*" + key + "*";
            return commands.keys(pattern);
        } catch (Exception e) {
            log.info("redis连接异常：{}", e);
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
        return null;
    }

    /**
     * @description: get
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public String get(Long id, Integer databaseId, String key) {
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.get(key);
        } catch (Exception e) {
            log.info("redis连接异常：{}", e);
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
        return null;
    }

    /**
     * @description: set
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public String set(Long id, Integer databaseId, String key,String value) {
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.set(key,value);
        } catch (Exception e) {
            log.info("redis连接异常：{}", e);
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
        return null;
    }

    /**
     * @description: rpush
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long rpush(Long id, Integer databaseId, String key,List<String> list) {
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.rpush(key,list.stream().toArray(String[]::new));
        } catch (Exception e) {
            log.info("redis连接异常：{}", e);
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
        return null;
    }

    /**
     * @description: rpop
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public List lrange(Long id, Integer databaseId, String key) {
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.lrange(key,0,-1);
        } catch (Exception e) {
            log.info("redis连接异常：{}", e);
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
        return null;
    }

    /**
     * @description: sadd
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long sadd(Long id, Integer databaseId, String key, Set<String> list) {
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.sadd(key,list.stream().toArray(String[]::new));
        } catch (Exception e) {
            log.info("redis连接异常：{}", e);
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
        return null;
    }

    /**
     * @description: sadd
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long zadd(Long id, Integer databaseId, String key, Set<String> list) {
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.zadd(key,list.stream().toArray(String[]::new));
        } catch (Exception e) {
            log.info("redis连接异常：{}", e);
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
        return null;
    }

    /**
     * @description: set
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public String type(Long id, Integer databaseId, String key) {
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.type(key);
        } catch (Exception e) {
            log.info("redis连接异常：{}", e);
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
        return null;
    }

    /**
     * @description: 根据批量key查找value
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public List<RedisDataModel> mget(Long id, Integer databaseId, List<String> keys) {
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            List<KeyValue<String,String>> resultKeyValues=commands.mget(keys.stream().toArray(String[]::new));
            return resultKeyValues.stream().map(e-> new RedisDataModel(e.getKey(),e.getValue())).collect(Collectors.toList());
        } catch (Exception e) {
            log.info("redis连接异常：{}", e);
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
        return null;
    }


}
