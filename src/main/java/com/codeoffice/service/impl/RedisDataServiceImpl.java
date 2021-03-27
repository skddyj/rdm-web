package com.codeoffice.service.impl;

import com.alibaba.excel.util.CollectionUtils;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.codeoffice.common.PageResponse;
import com.codeoffice.common.RestCode;
import com.codeoffice.common.RestResponse;
import com.codeoffice.mapper.RedisConnectionMapper;
import com.codeoffice.model.RedisDataAttrModel;
import com.codeoffice.model.RedisDataHashModel;
import com.codeoffice.model.RedisDataListModel;
import com.codeoffice.model.RedisDataZSetModel;
import com.codeoffice.request.RedisDataQueryRequest;
import com.codeoffice.request.RedisDataRowUpdateRequest;
import com.codeoffice.request.RedisDataUpdateRequest;
import com.codeoffice.response.RedisDataResponse;
import com.codeoffice.service.RedisDataService;
import com.codeoffice.utils.RedisOperationUtil;
import com.github.pagehelper.Page;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
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

@Slf4j
@Service
public class RedisDataServiceImpl implements RedisDataService {

    private static DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss:SSS");

    @Autowired
    public RedisConnectionMapper redisConnectionMapper;

    @Autowired
    public RedisOperationUtil redisOperationUtil;

    @Override
    public RestResponse databaseCount(Long id) {
        if (id == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        int num = redisOperationUtil.getDatabaseCount(id);
        return RestResponse.success(num);
    }

    @Override
    public RestResponse keys(RedisDataQueryRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        List<String> keys = redisOperationUtil.keys(request.getConnectionId(), request.getDatabaseId(), request.getKey());
        if (CollectionUtils.isEmpty(keys)) {
            return RestResponse.success(Lists.newArrayList());
        }
        System.out.println(keys);
        return RestResponse.success(keys);
    }

    @Override
    public RestResponse addKey(RedisDataUpdateRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null || request.getKey() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        Long exists = redisOperationUtil.exist(request.getConnectionId(), request.getDatabaseId(), request.getKey());
        if (exists > 0) {
            return RestResponse.error(RestCode.REDIS_DATA_KEY_EXISTED);
        }
        return this.addByType(request.getConnectionId(), request.getDatabaseId(), request.getKey(), request.getValue(), request.getType());
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
    public RestResponse addValue(RedisDataUpdateRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null || request.getKey() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        Long exists = redisOperationUtil.exist(request.getConnectionId(), request.getDatabaseId(), request.getKey());
        if (exists > 0) {
            String type = redisOperationUtil.type(request.getConnectionId(), request.getDatabaseId(), request.getKey());
            return this.addByType(request.getConnectionId(), request.getDatabaseId(), request.getKey(), request.getValue(), type);
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
            return this.getByType(request);
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
            return this.updateByType(request.getConnectionId(), request.getDatabaseId(), request.getKey(), request.getIndex(), request.getValue(), request.getNewValue(), type);
        }
        return RestResponse.error(RestCode.REDIS_DATA_NO_SUCH_KEY);
    }

    @Override
    public RestResponse set(RedisDataUpdateRequest request) {
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
    public RestResponse keysPages(RedisDataQueryRequest request) {
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
        System.out.println(resultKeys);
        List resultKeyValues = redisOperationUtil.mget(request.getConnectionId(), request.getDatabaseId(), resultKeys);
        System.out.println(resultKeyValues);
        return RestResponse.success(new PageResponse(request.getCurrent(), request.getPageSize(), allKeys.size(), resultKeyValues.size(), resultKeyValues));
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
            map.put(hashModel.getHashKey(), hashModel.getValue());
            Long result = redisOperationUtil.hset(connectionId, databaseId, key, map);
            return RestResponse.success(result);
        }
        return null;
    }

    private RestResponse updateByType(Long connectionId, Integer databaseId, String key, Long index, Object value, Object newValue, String type) {
        if (type.equals("string")) {
            String result = redisOperationUtil.set(connectionId, databaseId, key, (String) value);
            return RestResponse.success(result);
        } else if (type.equals("list")) {
            String result = redisOperationUtil.lset(connectionId, databaseId, key, index, (String) newValue);
            return RestResponse.success(result);
        } else if (type.equals("set")) {
            Set<String> set = JSON.parseObject(JSONObject.toJSONString(value), new TypeReference<Set<String>>() {
            });
            Long result = redisOperationUtil.sadd(connectionId, databaseId, key, set.stream().toArray(String[]::new));
            return RestResponse.success(result);
        } else if (type.equals("zset")) {
            RedisDataZSetModel zSetModel = JSONObject.parseObject(JSONObject.toJSONString(value), RedisDataZSetModel.class);
            ScoredValue scoredValue = ScoredValue.fromNullable(zSetModel.getScore(), zSetModel.getValue());
            Long result = redisOperationUtil.zadd(connectionId, databaseId, key, scoredValue);
            return RestResponse.success(result);
        } else if (type.equals("hash")) {
            RedisDataHashModel hashModel = JSONObject.parseObject(JSONObject.toJSONString(value), RedisDataHashModel.class);
            Map map = Maps.newHashMap();
            map.put(hashModel.getHashKey(), hashModel.getValue());
            Long result = redisOperationUtil.hset(connectionId, databaseId, key, map);
            return RestResponse.success(result);
        }
        return null;
    }

    private RestResponse getByType(RedisDataQueryRequest request) {
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
            System.out.println(page.getStartRow());
            System.out.println(page.getEndRow() - 1);
            List<String> result = redisOperationUtil.lrange(request.getConnectionId(), request.getDatabaseId(), request.getKey(), page.getStartRow(), page.getEndRow() - 1);
            AtomicInteger index = new AtomicInteger(0);
            List listResult = result.stream().map(e -> new RedisDataListModel(String.valueOf(index.getAndIncrement()), e)).collect(Collectors.toList());
            PageResponse pageResponse = new PageResponse(request.getCurrent(), request.getPageSize(), len, page.getPages(), listResult);
            RedisDataResponse redisDataResponse = new RedisDataResponse(request.getKey(), pageResponse, type, ttl);
            return RestResponse.success(redisDataResponse);
        }
        return null;
    }

    private RestResponse removeValueByType(RedisDataUpdateRequest request) {
        String type = redisOperationUtil.type(request.getConnectionId(), request.getDatabaseId(), request.getKey());
        if (type.equals("string")) {
            String value = (String) request.getValue();
            String result = redisOperationUtil.set(request.getConnectionId(), request.getDatabaseId(), request.getKey(), value);
            return RestResponse.success(result);
        } else if (type.equals("list")) {
            String value = (String) request.getValue();
            Long result = redisOperationUtil.lrem(request.getConnectionId(), request.getDatabaseId(), request.getKey(), value);
            return RestResponse.success(result);
        }
        return null;
    }
}
