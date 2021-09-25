package com.codeoffice.utils;

import com.alibaba.fastjson.JSON;
import com.codeoffice.common.enums.ConnectionType;
import com.codeoffice.model.RedisDataModel;
import com.codeoffice.model.RedisDataZSetModel;
import com.github.pagehelper.Page;
import io.lettuce.core.*;
import io.lettuce.core.api.StatefulConnection;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.BaseRedisCommands;
import io.lettuce.core.api.sync.RedisCommands;
import io.lettuce.core.cluster.RedisClusterClient;
import io.lettuce.core.cluster.api.StatefulRedisClusterConnection;
import io.lettuce.core.cluster.api.sync.RedisAdvancedClusterCommands;
import io.lettuce.core.cluster.api.sync.RedisClusterCommands;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
@Slf4j
public class RedisOperationUtil {

    @Autowired
    private RedisClientUtil redisClientUtil;

    /**
     * @description: 获取database数量
     * @date: 2021/3/16 16:27
     * @param: [id]
     * @return: java.lang.Integer
     */
    public Integer databases(Long id) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, 0);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                Map<String, String> result = ((StatefulRedisConnection) connection).sync().configGet("databases");
                return Integer.valueOf(result.get("databases"));
            } else {
                Map<String, String> result = ((StatefulRedisClusterConnection) connection).sync().configGet("databases");
                return Integer.valueOf(result.get("databases"));
            }
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
     * @description: 获取database下key的数量
     * @date: 2021/3/16 16:27
     * @param: [id]
     * @return: java.lang.Integer
     */
    public Long dbsize(Long id, Integer databaseId) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().dbsize();
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().dbsize();
            }
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
     * @description: 获取database所有key
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public List<String> keys(Long id, Integer databaseId, String key) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            String pattern = StringUtils.isBlank(key) ? "*" : "*" + key + "*";
            ScanArgs scanArgs = ScanArgs.Builder.matches(pattern).limit(40000);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                ScanIterator<String> iterator = ScanIterator.scan(((StatefulRedisConnection) connection).sync(), scanArgs);
                return iterator.stream().collect(Collectors.toList());
            } else {
                ScanIterator<String> iterator = ScanIterator.scan(((StatefulRedisClusterConnection) connection).sync(), scanArgs);
                return iterator.stream().collect(Collectors.toList());
            }
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
     * @description: 分页获取获取database下的key
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public List<String> keysPages(Long id, Integer databaseId, String key, Page page) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            String pattern = StringUtils.isBlank(key) ? "*" : "*" + key + "*";
            ScanArgs scanArgs = ScanArgs.Builder.matches(pattern).limit(20000);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                ScanIterator<String> iterator = ScanIterator.scan(((StatefulRedisConnection) connection).sync(), scanArgs);
                return iterator.stream().skip(page.getStartRow()).limit(page.getPageSize()).collect(Collectors.toList());
            } else {
                ScanIterator<String> iterator = ScanIterator.scan(((StatefulRedisClusterConnection) connection).sync(), scanArgs);
                return iterator.stream().skip(page.getStartRow()).limit(page.getPageSize()).collect(Collectors.toList());
            }
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
     * @description: ttl
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long ttl(Long id, Integer databaseId, String key) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().ttl(key);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().ttl(key);
            }
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
     * @description: expire
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public boolean expire(Long id, Integer databaseId, String key, Long l) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().expire(key, l);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().expire(key, l);
            }
        } catch (Exception e) {
            log.info("redis连接异常：{}", e);
        } finally {
            if (connection != null) {
                connection.close();
            }
        }
        return false;
    }


    /**
     * @description: get
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public String get(Long id, Integer databaseId, String key) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return (String) ((StatefulRedisConnection) connection).sync().get(key);
            } else {
                return (String) ((StatefulRedisClusterConnection) connection).sync().get(key);
            }
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
    public String set(Long id, Integer databaseId, String key, String value) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().set(key, value);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().set(key, value);
            }
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
     * @description: lpush
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long lpush(Long id, Integer databaseId, String key, String... value) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().lpush(key, value);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().lpush(key, value);
            }
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
     * @description: update
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public String lset(Long id, Integer databaseId, String key, Long index, String newValue) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().lset(key, index, newValue);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().lset(key, index, newValue);
            }
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
     * @description: lrem
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long lrem(Long id, Integer databaseId, String key, String value) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().lrem(key, 1, value);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().lrem(key, 1, value);
            }
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
     * @description: lrange
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public List lrange(Long id, Integer databaseId, String key, long start, long end) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().lrange(key, start, end);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().lrange(key, start, end);
            }
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
     * @description: llen
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long llen(Long id, Integer databaseId, String key) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().llen(key);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().llen(key);
            }
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
     * @description: llen
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long hscan(Long id, Integer databaseId, String key) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                ScanArgs scanArgs = ScanArgs.Builder.matches("*").limit(20);
//              MapScanCursor cursor = commands.hscan(key,scanArgs);
                ScanIterator<KeyValue<String, String>> iterator = ScanIterator.hscan(((StatefulRedisConnection) connection).sync(), key, scanArgs);
                Stream<KeyValue<String, String>> stream = iterator.stream();
                Stream<KeyValue<String, String>> stream2 = stream.skip(10).limit(10);
                //log.info("{}",stream2.count());
                log.info("{}", stream2.collect(Collectors.toList()));
                while (iterator.hasNext()) {
                    KeyValue<String, String> keyValue = iterator.next();
                }
            } else {
                ScanArgs scanArgs = ScanArgs.Builder.matches("*").limit(20);
//              MapScanCursor cursor = commands.hscan(key,scanArgs);
                ScanIterator<KeyValue<String, String>> iterator = ScanIterator.hscan(((StatefulRedisClusterConnection) connection).sync(), key, scanArgs);
                Stream<KeyValue<String, String>> stream = iterator.stream();
                Stream<KeyValue<String, String>> stream2 = stream.skip(10).limit(10);
                //log.info("{}",stream2.count());
                log.info("{}", stream2.collect(Collectors.toList()));
                while (iterator.hasNext()) {
                    KeyValue<String, String> keyValue = iterator.next();
                }
            }
            return 0L;
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
     * @description: scard
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long scard(Long id, Integer databaseId, String key) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().scard(key);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().scard(key);
            }
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
     * @description: lrange
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Set members(Long id, Integer databaseId, String key) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().smembers(key);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().smembers(key);
            }
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
    public Long sadd(Long id, Integer databaseId, String key, String... value) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().sadd(key, value);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().sadd(key, value);
            }
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
     * @description: supdate
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long supdate(Long id, Integer databaseId, String key, String value, String newValue) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                RedisCommands<String, String> commands = ((StatefulRedisConnection) connection).sync();
                commands.multi();
                commands.srem(key, value);
                commands.sadd(key, newValue);
                TransactionResult result = commands.exec();
            } else {
                RedisAdvancedClusterCommands<String, String> commands = ((StatefulRedisClusterConnection) connection).sync();
                //获取key所落的slot
//                Long keySlot=commands.clusterKeyslot(key);
//                //获取cluster所有的slot
//                List<Object> slots=commands.clusterSlots();
//                for(int i=0;i<slots.size();i++){
//                    List slotInfo=(List)slots.get(i);// 当前slot信息
//                    if(keySlot > (Long) slotInfo.get(0)&&keySlot < (Long) slotInfo.get(0)){
//                        commands.clusterSlaves()
//                        List nodeInfo=(List) slotInfo.get(2);
//                        RedisURI.create(nodeInfo[0].toString(), nodeInfo[1].toString().toInt())
//
//                    }
//
//                }
//                RedisURI redisUri = RedisURI.builder()
//                        .withHost(redisConnection.getHost())
//                        .withPort(redisConnection.getPort())
//                        .withPassword(redisConnection.getPassword())
//                        .withTimeout(Duration.of(timeout, ChronoUnit.MILLIS))
//                        .withDatabase(database)
//                        .build();
//                RedisClient client = RedisClient.create(redisUri);
//                client.connect();
//                commands.multi();
                commands.srem(key, value);
                commands.sadd(key, newValue);
            }

            return 1L;
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
     * @description: srem
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long srem(Long id, Integer databaseId, String key, String value) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().srem(key, value);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().srem(key, value);
            }
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
     * @description: zadd
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long zadd(Long id, Integer databaseId, String key, ScoredValue... scoredValue) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().zadd(key, scoredValue);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().zadd(key, scoredValue);
            }
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
     * @description: zupdate
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long zupdate(Long id, Integer databaseId, String key, ScoredValue scoredValue, ScoredValue newScoredValue) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                RedisCommands<String, String> commands = ((StatefulRedisConnection) connection).sync();
                commands.multi();
                commands.zrem(key, (String) scoredValue.getValue());
                commands.zadd(key, newScoredValue);
                commands.exec();
            } else {
                RedisAdvancedClusterCommands<String, String> commands = ((StatefulRedisClusterConnection) connection).sync();
                commands.zrem(key, (String) scoredValue.getValue());
                commands.zadd(key, newScoredValue);
            }
            return 0L;
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
     * @description: zupdate
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long zrem(Long id, Integer databaseId, String key, ScoredValue scoredValue) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().zrem(key, scoredValue.getValue());
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().zrem(key, scoredValue.getValue());
            }
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
     * @description: zcard
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long zcard(Long id, Integer databaseId, String key) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().zcard(key);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().zcard(key);
            }
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
     * @description: zrevrange
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public List zrevrange(Long id, Integer databaseId, String key, long start, long end) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().zrevrangeWithScores(key, start, end);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().zrevrangeWithScores(key, start, end);
            }
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
     * @description: hset
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long hset(Long id, Integer databaseId, String key, Map<String, String> value) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().hset(key, value);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().hset(key, value);
            }
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
     * @description: hlen
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long hlen(Long id, Integer databaseId, String key) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().hlen(key);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().hlen(key);
            }
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
     * @description: hlen
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public List hkeys(Long id, Integer databaseId, String key) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().hkeys(key);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().hkeys(key);
            }
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
     * @description: hmget
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public List hmget(Long id, Integer databaseId, String key, String... field) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().hmget(key, field);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().hmget(key, field);
            }
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
     * @description: hupdate
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long hupdate(Long id, Integer databaseId, String key, String field, Map map) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                RedisCommands<String, String> commands = ((StatefulRedisConnection) connection).sync();
                commands.multi();
                commands.hdel(key, field);
                commands.hset(key, map);
                commands.exec();
            } else {
                RedisAdvancedClusterCommands<String, String> commands = ((StatefulRedisClusterConnection) connection).sync();
                commands.hdel(key, field);
                commands.hset(key, map);
            }
            return 0L;
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
     * @description: hdel
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long hdel(Long id, Integer databaseId, String key, String field) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().hdel(key, field);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().hdel(key, field);
            }
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
     * @description: renamenx
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Boolean renamenx(Long id, Integer databaseId, String key1, String key2) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().renamenx(key1, key2);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().renamenx(key1, key2);
            }
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
     * @description: del
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long del(Long id, Integer databaseId, String key) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().del(key);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().del(key);
            }
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
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().type(key);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().type(key);
            }
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
     * @description: exist
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long exist(Long id, Integer databaseId, String key) {
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                return ((StatefulRedisConnection) connection).sync().exists(key);
            } else {
                return ((StatefulRedisClusterConnection) connection).sync().exists(key);
            }
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
        StatefulConnection connection = null;
        try {
            connection = redisClientUtil.getStatefulConnection(id, databaseId);
            if (redisClientUtil.getRedisConnectionType(id) == ConnectionType.DEFAULT.code) {
                RedisCommands<String,String> commands=((StatefulRedisConnection) connection).sync();
                List<KeyValue<String, String>> resultKeyValues = commands.mget(keys.stream().toArray(String[]::new));
                return resultKeyValues.stream().map(e -> new RedisDataModel(e.getKey(), e.getValue())).collect(Collectors.toList());
            } else {
                RedisAdvancedClusterCommands<String,String> commands=((StatefulRedisClusterConnection) connection).sync();
                List<KeyValue<String, String>> resultKeyValues = commands.mget(keys.stream().toArray(String[]::new));
                return resultKeyValues.stream().map(e -> new RedisDataModel(e.getKey(), e.getValue())).collect(Collectors.toList());            }
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
