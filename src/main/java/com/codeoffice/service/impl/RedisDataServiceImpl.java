package com.codeoffice.service.impl;

import com.alibaba.excel.util.CollectionUtils;
import com.alibaba.fastjson.JSON;
import com.codeoffice.common.PageResponse;
import com.codeoffice.common.RestCode;
import com.codeoffice.common.RestResponse;
import com.codeoffice.mapper.RedisConnectionMapper;
import com.codeoffice.request.RedisDataQueryRequest;
import com.codeoffice.service.RedisDataService;
import com.codeoffice.utils.RedisOperationUtil;
import com.google.common.collect.Lists;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;

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
        if (request.getRedisConnectionId() == null || request.getDatabaseId() == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        List<String> keys = redisOperationUtil.keys(request.getRedisConnectionId(), request.getDatabaseId(), request.getKey());
        if (CollectionUtils.isEmpty(keys)) {
            return RestResponse.success(Lists.newArrayList());
        }
        System.out.println(keys);
        return RestResponse.success(keys);
    }


    @Override
    public RestResponse keysPages(RedisDataQueryRequest request) {
        if (request.getRedisConnectionId() == null || request.getDatabaseId() == null) {
            return RestResponse.success(new PageResponse());
        }
        List allKeys = redisOperationUtil.keys(request.getRedisConnectionId(), request.getDatabaseId(), request.getKey());
        if (CollectionUtils.isEmpty(allKeys)) {
            return RestResponse.success(new PageResponse());
        }
        List<List<Integer>> pagedListKeys = Lists.partition(allKeys, request.getPageSize());
        System.out.println(JSON.toJSONString(pagedListKeys));
        List resultKeys = request.getCurrent() > pagedListKeys.size() ? pagedListKeys.get(pagedListKeys.size() - 1) : pagedListKeys.get(request.getCurrent() - 1);
        System.out.println(resultKeys);
        List resultKeyValues = redisOperationUtil.mget(request.getRedisConnectionId(), request.getDatabaseId(), resultKeys);
        System.out.println(resultKeyValues);
        return RestResponse.success(new PageResponse(request.getCurrent(), request.getPageSize(), allKeys.size(), resultKeyValues.size(), resultKeyValues));
    }

    @Override
    public RestResponse mget(RedisDataQueryRequest request) {
        if (request.getRedisConnectionId() == null || request.getDatabaseId() == null) {
            return RestResponse.success(new PageResponse());
        }
        List allKeys = redisOperationUtil.keys(request.getRedisConnectionId(), request.getDatabaseId(), request.getKey());
        if (CollectionUtils.isEmpty(allKeys)) {
            return RestResponse.success(new PageResponse());
        }
        List<List<Integer>> pagedListKeys = Lists.partition(allKeys, request.getPageSize());
        System.out.println(JSON.toJSONString(pagedListKeys));
        List resultKeys = request.getCurrent() > pagedListKeys.size() ? pagedListKeys.get(pagedListKeys.size() - 1) : pagedListKeys.get(request.getCurrent() - 1);
        return RestResponse.success(new PageResponse(request.getCurrent(), request.getPageSize(), allKeys.size(), pagedListKeys.size(), resultKeys));
    }
}
