package com.codeoffice.utils;

import com.alibaba.fastjson.JSON;
import com.codeoffice.model.RedisDataModel;
import com.codeoffice.model.RedisDataZSetModel;
import com.github.pagehelper.Page;
import io.lettuce.core.*;
import io.lettuce.core.api.StatefulConnection;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
    public Integer databases(Long id) {
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, 0);
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
     * @description: 获取database下key的数量
     * @date: 2021/3/16 16:27
     * @param: [id]
     * @return: java.lang.Integer
     */
    public Long dbsize(Long id, Integer databaseId) {
        StopWatch stopWatch=new StopWatch();
        stopWatch.start();
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            Long dbsize = commands.dbsize();
            System.out.println("dbsize:" + dbsize);
            stopWatch.stop();
            System.out.println("耗时:" + stopWatch.getTotalTimeMillis());
            return dbsize;
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            String pattern = StringUtils.isBlank(key) ? "*" : "*" + key + "*";
            ScanArgs scanArgs = ScanArgs.Builder.matches(pattern).limit(40000);
            ScanIterator<String> iterator = ScanIterator.scan(commands, scanArgs);
            List<String> keysList = iterator.stream().collect(Collectors.toList());
            return keysList;
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            String pattern = StringUtils.isBlank(key) ? "*" : "*" + key + "*";
            ScanArgs scanArgs = ScanArgs.Builder.matches(pattern).limit(20000);
            ScanIterator<String> iterator = ScanIterator.scan(commands, scanArgs);
            System.out.println("起始索引：" + page.getStartRow());
            List<String> keysList = iterator.stream().skip(page.getStartRow()).limit(page.getPageSize()).collect(Collectors.toList());
            return keysList;
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.ttl(key);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.expire(key, l);
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
    public String set(Long id, Integer databaseId, String key, String value) {
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.set(key, value);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.lpush(key, value);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.lset(key, index, newValue);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.lrem(key, 1, value);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.lrange(key, start, end);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.llen(key);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            ScanArgs scanArgs = ScanArgs.Builder.matches("*").limit(20);
//            MapScanCursor cursor = commands.hscan(key,scanArgs);
            ScanIterator<KeyValue<String, String>> iterator = ScanIterator.hscan(commands, key, scanArgs);
            Stream<KeyValue<String, String>> stream = iterator.stream();
            Stream<KeyValue<String, String>> stream2 = stream.skip(10).limit(10);
            //log.info("{}",stream2.count());
            log.info("{}", stream2.collect(Collectors.toList()));
            while (iterator.hasNext()) {
                KeyValue<String, String> keyValue = iterator.next();
                System.out.println(keyValue.getKey());
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.scard(key);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.smembers(key);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.sadd(key, value);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            commands.multi();
            commands.srem(key, value);
            commands.sadd(key, newValue);
            TransactionResult result = commands.exec();
            log.info("{}", result);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            //commands.multi();
            return commands.srem(key, value);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.zadd(key, scoredValue);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            commands.multi();
            commands.zrem(key, (String) scoredValue.getValue());
            commands.zadd(key, newScoredValue);
            TransactionResult result = commands.exec();
            log.info("{}", result);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.zrem(key, (String) scoredValue.getValue());
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.zcard(key);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.zrevrangeWithScores(key, start, end);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.hset(key, value);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.hlen(key);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.hkeys(key);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.hmget(key, field);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            commands.multi();
            commands.hdel(key, field);
            commands.hset(key, map);
            TransactionResult result = commands.exec();
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.hdel(key, field);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.renamenx(key1, key2);
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
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.del(key);
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
     * @description: exist
     * @date: 2021/3/17
     * @param: id
     * @param: databaseId
     * @return: java.util.List<java.lang.String>
     */
    public Long exist(Long id, Integer databaseId, String key) {
        StatefulRedisConnection connection = null;
        try {
            connection = redisClientUtil.getRedisConnection(id, databaseId);
            RedisCommands<String, String> commands = connection.sync();
            return commands.exists(key);
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
            List<KeyValue<String, String>> resultKeyValues = commands.mget(keys.stream().toArray(String[]::new));
            return resultKeyValues.stream().map(e -> new RedisDataModel(e.getKey(), e.getValue())).collect(Collectors.toList());
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
