package com.codeoffice.service.impl;

import com.alibaba.excel.util.CollectionUtils;
import com.alibaba.fastjson.JSON;
import com.codeoffice.common.PageResponse;
import com.codeoffice.common.RestCode;
import com.codeoffice.common.RestResponse;
import com.codeoffice.mapper.RedisConnectionMapper;
import com.codeoffice.model.RedisDataHashModel;
import com.codeoffice.model.RedisDataZSetModel;
import com.codeoffice.request.RedisDataQueryRequest;
import com.codeoffice.request.RedisDataUpdateRequest;
import com.codeoffice.response.RedisDataResponse;
import com.codeoffice.service.RedisDataService;
import com.codeoffice.utils.RedisOperationUtil;
import com.google.common.collect.Lists;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
    public RestResponse get(RedisDataQueryRequest request) {
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
    public RestResponse set(RedisDataUpdateRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null || request.getKey() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        //String value = redisOperationUtil.set(request.getConnectionId(), request.getDatabaseId(), request.getKey(), request.getValue());
        return RestResponse.success();
    }

    @Override
    public RestResponse addKey(RedisDataUpdateRequest request) {
        if (request.getConnectionId() == null || request.getDatabaseId() == null || request.getKey() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        return this.addByType(request);
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
                return RestResponse.error(RestCode.REDIS_DATA_NEW_KEY_EXISTED);
            }
        } catch (Exception e) {
            return RestResponse.error(RestCode.REDIS_DATA_NO_SUCH_KEY);
        }
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

    private RestResponse addByType(RedisDataUpdateRequest request) {
        if (request.getType().equals("string")) {
            String value = (String) request.getValue();
            String result = redisOperationUtil.set(request.getConnectionId(), request.getDatabaseId(), request.getKey(), value);
            return RestResponse.success(result);
        } else if (request.getType().equals("list")) {
            List<String> value = (List) request.getValue();
            Long result = redisOperationUtil.rpush(request.getConnectionId(), request.getDatabaseId(), request.getKey(), value);
            return RestResponse.success(result);
        } else if (request.getType().equals("set")) {
            Set<String> value = (Set) request.getValue();
            Long result = redisOperationUtil.sadd(request.getConnectionId(), request.getDatabaseId(), request.getKey(), value);
            return RestResponse.success(result);
        } else if (request.getType().equals("zset")) {
            Set<RedisDataZSetModel> value = (Set) request.getValue();
            Long result = redisOperationUtil.zadd(request.getConnectionId(), request.getDatabaseId(), request.getKey(), value);
            return RestResponse.success(result);
        } else if (request.getType().equals("hash")) {
            Map<String, String> value = (Map) request.getValue();
            Long result = redisOperationUtil.hset(request.getConnectionId(), request.getDatabaseId(), request.getKey(), value);
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
            List result = redisOperationUtil.lrange(request.getConnectionId(), request.getDatabaseId(), request.getKey());
            RedisDataResponse redisDataResponse = new RedisDataResponse(request.getKey(), result, type, ttl);
            return RestResponse.success(redisDataResponse);
        }
        return null;
    }
}
