package com.codeoffice.service.impl;

import com.alibaba.excel.util.CollectionUtils;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.codeoffice.common.PageResponse;
import com.codeoffice.common.RestCode;
import com.codeoffice.common.RestResponse;
import com.codeoffice.mapper.RedisConnectionMapper;
import com.codeoffice.model.*;
import com.codeoffice.request.RedisDataQueryRequest;
import com.codeoffice.request.RedisDataRowUpdateRequest;
import com.codeoffice.request.RedisDataUpdateRequest;
import com.codeoffice.response.RedisDataResponse;
import com.codeoffice.service.RedisDataService;
import com.codeoffice.utils.RedisOperationUtil;
import com.github.pagehelper.Page;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import io.lettuce.core.KeyValue;
import io.lettuce.core.ScoredValue;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Service
public class RedisDataServiceImpl implements RedisDataService {

    private static DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss:SSS");

    @Autowired
    public RedisConnectionMapper redisConnectionMapper;

    @Autowired
    public RedisOperationUtil redisOperationUtil;

    @Override
    public RestResponse database(Long id) {
        if (id == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        int databaseCount = redisOperationUtil.databases(id);
        List<RedisDatabaseModel> databaseModelList = IntStream.range(0, databaseCount)
                .mapToObj(i -> new RedisDatabaseModel(i, "database "+i,redisOperationUtil.dbsize(id,i)))
                .collect(Collectors.toList());
        return RestResponse.success(databaseModelList);
    }

    @Override
    public RestResponse keys(RedisDataQueryRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        Page page = new Page(request.getCurrent(), request.getPageSize());
        List<String> keys = redisOperationUtil.keys(request.getConnectionId(), request.getDatabaseId(), request.getKey());
        if (CollectionUtils.isEmpty(keys)) {
            return RestResponse.success(Lists.newArrayList());
        }
        System.out.println(keys);
        return RestResponse.success(keys);
    }

    @Override
    public RestResponse keysPages(RedisDataQueryRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null) {
            return RestResponse.success(new PageResponse());
        }
        System.out.println("请求："+request.getCurrent()+" 页 "+request.getPageSize()+"条");
        Page page = new Page(request.getCurrent(), request.getPageSize());
        System.out.println(request.getCurrent());
        List keys = redisOperationUtil.keysPages(request.getConnectionId(), request.getDatabaseId(), request.getKey(), page);
        return RestResponse.success(new PageResponse(page, keys.size() == page.getPageSize(), keys));
    }

    @Override
    public RestResponse addKey(RedisDataRowUpdateRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null || request.getKey() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        Long exists = redisOperationUtil.exist(request.getConnectionId(), request.getDatabaseId(), request.getKey());
        if (exists > 0) {
            return RestResponse.error(RestCode.REDIS_DATA_KEY_EXISTED);
        }
        return this.addByType(request.getConnectionId(), request.getDatabaseId(), request.getKey(), request.getRowValue(), request.getType());
    }

    @Override
    public RestResponse getKeyAttr(RedisDataQueryRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null || request.getKey() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        Long exists = redisOperationUtil.exist(request.getConnectionId(), request.getDatabaseId(), request.getKey());
        if (exists > 0) {
            String type = redisOperationUtil.type(request.getConnectionId(), request.getDatabaseId(), request.getKey());
            Long ttl = redisOperationUtil.ttl(request.getConnectionId(), request.getDatabaseId(), request.getKey());
            return RestResponse.success(new RedisDataAttrModel(request.getKey(), type, ttl));
        }
        return RestResponse.error(RestCode.REDIS_DATA_NO_SUCH_KEY);
    }

    @Override
    public RestResponse removeKey(RedisDataUpdateRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null || request.getKey() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        return RestResponse.success(redisOperationUtil.del(request.getConnectionId(), request.getDatabaseId(), request.getKey()));
    }

    @Override
    public RestResponse renameKey(RedisDataUpdateRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null || request.getKey() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        try {
            boolean flag = redisOperationUtil.renamenx(request.getConnectionId(), request.getDatabaseId(), request.getKey(), request.getNewKey());
            if (flag) {
                return RestResponse.success(true);
            } else {
                return RestResponse.error(RestCode.REDIS_DATA_KEY_EXISTED);
            }
        } catch (Exception e) {
            return RestResponse.error(RestCode.REDIS_DATA_NO_SUCH_KEY);
        }
    }

    @Override
    public RestResponse addValue(RedisDataRowUpdateRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null || request.getKey() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        Long exists = redisOperationUtil.exist(request.getConnectionId(), request.getDatabaseId(), request.getKey());
        if (exists > 0) {
            String type = redisOperationUtil.type(request.getConnectionId(), request.getDatabaseId(), request.getKey());
            return this.addByType(request.getConnectionId(), request.getDatabaseId(), request.getKey(), request.getRowValue(), type);
        }
        return RestResponse.error(RestCode.REDIS_DATA_NO_SUCH_KEY);
    }

    @Override
    public RestResponse getValue(RedisDataQueryRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null || request.getKey() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        Long exists = redisOperationUtil.exist(request.getConnectionId(), request.getDatabaseId(), request.getKey());
        if (exists > 0) {
            return this.getValueByType(request);
        }
        return RestResponse.error(RestCode.REDIS_DATA_NO_SUCH_KEY);
    }

    @Override
    public RestResponse updateValue(RedisDataRowUpdateRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null || request.getKey() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        Long exists = redisOperationUtil.exist(request.getConnectionId(), request.getDatabaseId(), request.getKey());
        if (exists > 0) {
            String type = redisOperationUtil.type(request.getConnectionId(), request.getDatabaseId(), request.getKey());
            return this.updateValueByType(request.getConnectionId(), request.getDatabaseId(), request.getKey(), request.getIndex(), request.getRowValue(), request.getNewRowValue(), type);
        }
        return RestResponse.error(RestCode.REDIS_DATA_NO_SUCH_KEY);
    }

    @Override
    public RestResponse removeValue(RedisDataRowUpdateRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null || request.getKey() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        Long exists = redisOperationUtil.exist(request.getConnectionId(), request.getDatabaseId(), request.getKey());
        if (exists > 0) {
            String type = redisOperationUtil.type(request.getConnectionId(), request.getDatabaseId(), request.getKey());
            return this.removeValueByType(request.getConnectionId(), request.getDatabaseId(), request.getKey(), request.getRowValue(), type);
        }
        return RestResponse.error(RestCode.REDIS_DATA_NO_SUCH_KEY);
    }

    @Override
    public RestResponse set(RedisDataRowUpdateRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null || request.getKey() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        //String value = redisOperationUtil.set(request.getConnectionId(), request.getDatabaseId(), request.getKey(), request.getValue());
        return RestResponse.success();
    }


    @Override
    public RestResponse expire(RedisDataUpdateRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null || request.getKey() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        boolean flag = redisOperationUtil.expire(request.getConnectionId(), request.getDatabaseId(), request.getKey(), request.getTtl());
        System.out.println(flag);
        if (flag) {
            return RestResponse.success(true);
        } else {
            return RestResponse.error(RestCode.REDIS_DATA_NO_SUCH_KEY);
        }
    }


    @Override
    public RestResponse mget(RedisDataQueryRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null) {
            return RestResponse.success(new PageResponse());
        }
        List allKeys = redisOperationUtil.keys(request.getConnectionId(), request.getDatabaseId(), request.getKey());
        if (CollectionUtils.isEmpty(allKeys)) {
            return RestResponse.success(new PageResponse());
        }
        List<List<Integer>> pagedListKeys = Lists.partition(allKeys, request.getPageSize());
        System.out.println(JSON.toJSONString(pagedListKeys));
        List resultKeys = request.getCurrent() > pagedListKeys.size() ? pagedListKeys.get(pagedListKeys.size() - 1) : pagedListKeys.get(request.getCurrent() - 1);
        return RestResponse.success(new PageResponse(request.getCurrent(), request.getPageSize(), allKeys.size(), pagedListKeys.size(), resultKeys));
    }

    private RestResponse addByType(Long connectionId, Integer databaseId, String key, Object value, String type) {
        if (type.equals("string")) {
            String result = redisOperationUtil.set(connectionId, databaseId, key, (String) value);
            return RestResponse.success(result);
        } else if (type.equals("list")) {
            Long result = redisOperationUtil.lpush(connectionId, databaseId, key, (String) value);
            return RestResponse.success(result);
        } else if (type.equals("set")) {
            Long result = redisOperationUtil.sadd(connectionId, databaseId, key, (String) value);
            return RestResponse.success(result);
        } else if (type.equals("zset")) {
            RedisDataZSetModel zSetModel = JSONObject.parseObject(JSONObject.toJSONString(value), RedisDataZSetModel.class);
            ScoredValue scoredValue = ScoredValue.fromNullable(zSetModel.getScore(), zSetModel.getValue());
            Long result = redisOperationUtil.zadd(connectionId, databaseId, key, scoredValue);
            return RestResponse.success(result);
        } else if (type.equals("hash")) {
            RedisDataHashModel hashModel = JSONObject.parseObject(JSONObject.toJSONString(value), RedisDataHashModel.class);
            Map map = Maps.newHashMap();
            map.put(hashModel.getField(), hashModel.getValue());
            Long result = redisOperationUtil.hset(connectionId, databaseId, key, map);
            return RestResponse.success(result);
        }
        return null;
    }

    private RestResponse updateValueByType(Long connectionId, Integer databaseId, String key, Long index, Object value, Object newValue, String type) {
        if (type.equals("string")) {
            String result = redisOperationUtil.set(connectionId, databaseId, key, (String) newValue);
            return RestResponse.success(result);
        } else if (type.equals("list")) {
            String result = redisOperationUtil.lset(connectionId, databaseId, key, index, (String) newValue);
            return RestResponse.success(result);
        } else if (type.equals("set")) {
//            Set<String> set = JSON.parseObject(JSONObject.toJSONString(value), new TypeReference<Set<String>>() {
//            });
            Long result = redisOperationUtil.supdate(connectionId, databaseId, key, (String) value, (String) newValue);
            return RestResponse.success(result);
        } else if (type.equals("zset")) {
            RedisDataZSetModel zSetModel = JSONObject.parseObject(JSONObject.toJSONString(value), RedisDataZSetModel.class);
            RedisDataZSetModel zSetNewModel = JSONObject.parseObject(JSONObject.toJSONString(newValue), RedisDataZSetModel.class);

            ScoredValue scoredValue = ScoredValue.fromNullable(0d, zSetModel.getValue());
            ScoredValue newScoredValue = ScoredValue.fromNullable(zSetNewModel.getScore(), zSetNewModel.getValue());
            Long result = redisOperationUtil.zupdate(connectionId, databaseId, key, scoredValue, newScoredValue);
            return RestResponse.success(result);
        } else if (type.equals("hash")) {
            RedisDataHashModel hashModel = JSONObject.parseObject(JSONObject.toJSONString(value), RedisDataHashModel.class);
            RedisDataHashModel newHashModel = JSONObject.parseObject(JSONObject.toJSONString(newValue), RedisDataHashModel.class);

            Map map = Maps.newHashMap();
            map.put(newHashModel.getField(), newHashModel.getValue());
            Long result = redisOperationUtil.hupdate(connectionId, databaseId, key, hashModel.getField(), map);
            return RestResponse.success(result);
        }
        return null;
    }

    private RestResponse getValueByType(RedisDataQueryRequest request) {
        String type = redisOperationUtil.type(request.getConnectionId(), request.getDatabaseId(), request.getKey());
        Long ttl = redisOperationUtil.ttl(request.getConnectionId(), request.getDatabaseId(), request.getKey());
        if (type.equals("string")) {
            String result = redisOperationUtil.get(request.getConnectionId(), request.getDatabaseId(), request.getKey());
            RedisDataResponse redisDataResponse = new RedisDataResponse(request.getKey(), result, type, ttl);
            return RestResponse.success(redisDataResponse);
        } else if (type.equals("list")) {
            // list长度
            Long len = redisOperationUtil.llen(request.getConnectionId(), request.getDatabaseId(), request.getKey());
            if (len == 0) {
                RedisDataResponse redisDataResponse = new RedisDataResponse(request.getKey(), new PageResponse(), type, ttl);
                return RestResponse.success(redisDataResponse);
            }
            Page page = new Page(request.getCurrent(), request.getPageSize());
            System.out.println(JSON.toJSONString(page));
            page.setTotal(len);
            List<String> result = redisOperationUtil.lrange(request.getConnectionId(), request.getDatabaseId(), request.getKey(), page.getStartRow(), page.getEndRow() - 1);
            List<RedisDataListModel> listResult = IntStream.range(0, result.size())
                    .mapToObj(i -> new RedisDataListModel(i, result.get(i)))
                    .collect(Collectors.toList());
            PageResponse pageResponse = new PageResponse(page, listResult);
            RedisDataResponse redisDataResponse = new RedisDataResponse(request.getKey(), pageResponse, type, ttl);
            return RestResponse.success(redisDataResponse);
        } else if (type.equals("set")) {
            // set长度
            Long len = redisOperationUtil.scard(request.getConnectionId(), request.getDatabaseId(), request.getKey());
            if (len == 0) {
                RedisDataResponse redisDataResponse = new RedisDataResponse(request.getKey(), new PageResponse(), type, ttl);
                return RestResponse.success(redisDataResponse);
            }
            Page page = new Page(request.getCurrent(), request.getPageSize());
            page.setTotal(len);
            Set<String> allResultSet = redisOperationUtil.members(request.getConnectionId(), request.getDatabaseId(), request.getKey());
            List<String> allResultList = allResultSet.stream().collect(Collectors.toList());
            List<List<String>> pagedResultList = Lists.partition(allResultList, page.getPageSize());
            System.out.println(JSON.toJSONString(pagedResultList));
            List<String> resultList = page.getPageNum() > pagedResultList.size() ? pagedResultList.get(pagedResultList.size() - 1) : pagedResultList.get(request.getCurrent() - 1);
            System.out.println(resultList);
            List<RedisDataListModel> resultResponseList = IntStream.range(0, resultList.size())
                    .mapToObj(i -> new RedisDataListModel(i, resultList.get(i)))
                    .collect(Collectors.toList());

            PageResponse pageResponse = new PageResponse(page, resultResponseList);
            RedisDataResponse redisDataResponse = new RedisDataResponse(request.getKey(), pageResponse, type, ttl);
            return RestResponse.success(redisDataResponse);
        } else if (type.equals("zset")) {
            // zset长度
            Long len = redisOperationUtil.zcard(request.getConnectionId(), request.getDatabaseId(), request.getKey());
            if (len == 0) {
                RedisDataResponse redisDataResponse = new RedisDataResponse(request.getKey(), new PageResponse(), type, ttl);
                return RestResponse.success(redisDataResponse);
            }
            Page page = new Page(request.getCurrent(), request.getPageSize());
            System.out.println(JSON.toJSONString(page));
            page.setTotal(len);
            List<ScoredValue> result = redisOperationUtil.zrevrange(request.getConnectionId(), request.getDatabaseId(), request.getKey(), page.getStartRow(), page.getEndRow() - 1);
            List<RedisDataZSetModel> listResult = IntStream.range(0, result.size())
                    .mapToObj(i -> new RedisDataZSetModel(i, result.get(i).getScore(), (String) result.get(i).getValue()))
                    .collect(Collectors.toList());
            PageResponse pageResponse = new PageResponse(page, listResult);
            RedisDataResponse redisDataResponse = new RedisDataResponse(request.getKey(), pageResponse, type, ttl);
            return RestResponse.success(redisDataResponse);
        } else if (type.equals("hash")) {
            // hash长度
            Long len = redisOperationUtil.hlen(request.getConnectionId(), request.getDatabaseId(), request.getKey());
            if (len == 0) {
                RedisDataResponse redisDataResponse = new RedisDataResponse(request.getKey(), new PageResponse(), type, ttl);
                return RestResponse.success(redisDataResponse);
            }
            Page page = new Page(request.getCurrent(), request.getPageSize());
            page.setTotal(len);

            List<String> allKeysList = redisOperationUtil.hkeys(request.getConnectionId(), request.getDatabaseId(), request.getKey());
            List<List<String>> pagedKeysList = Lists.partition(allKeysList, page.getPageSize());
            System.out.println(JSON.toJSONString(pagedKeysList));
            List<String> resultList = page.getPageNum() > pagedKeysList.size() ? pagedKeysList.get(pagedKeysList.size() - 1) : pagedKeysList.get(request.getCurrent() - 1);

            List<KeyValue<String, String>> keyValueList = redisOperationUtil.hmget(request.getConnectionId(), request.getDatabaseId(), request.getKey(), resultList.stream().toArray(String[]::new));
            List<RedisDataHashModel> resultResponseList = IntStream.range(0, keyValueList.size())
                    .mapToObj(i -> new RedisDataHashModel(i, keyValueList.get(i).getKey(), keyValueList.get(i).getValue()))
                    .collect(Collectors.toList());
            PageResponse pageResponse = new PageResponse(page, resultResponseList);
            RedisDataResponse redisDataResponse = new RedisDataResponse(request.getKey(), pageResponse, type, ttl);
            return RestResponse.success(redisDataResponse);
        }
        return null;
    }

    private RestResponse removeValueByType(Long connectionId, Integer databaseId, String key, Object value, String type) {
        if (type.equals("string")) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        } else if (type.equals("list")) {
            Long result = redisOperationUtil.lrem(connectionId, databaseId, key, (String) value);
            return RestResponse.success(result);
        } else if (type.equals("set")) {
            Long result = redisOperationUtil.srem(connectionId, databaseId, key, (String) value);
            return RestResponse.success(result);
        } else if (type.equals("zset")) {
            RedisDataZSetModel zSetModel = JSONObject.parseObject(JSONObject.toJSONString(value), RedisDataZSetModel.class);
            ScoredValue scoredValue = ScoredValue.fromNullable(0d, zSetModel.getValue());
            Long result = redisOperationUtil.zrem(connectionId, databaseId, key, scoredValue);
            return RestResponse.success(result);
        } else if (type.equals("hash")) {
            RedisDataHashModel hashModel = JSONObject.parseObject(JSONObject.toJSONString(value), RedisDataHashModel.class);
            Long result = redisOperationUtil.hdel(connectionId, databaseId, key, hashModel.getField());
            return RestResponse.success(result);
        }
        return null;
    }
}
