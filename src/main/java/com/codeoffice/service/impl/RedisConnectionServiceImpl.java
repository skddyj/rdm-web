package com.codeoffice.service.impl;

import com.alibaba.fastjson.JSON;
import com.codeoffice.common.PageResponse;
import com.codeoffice.common.RestCode;
import com.codeoffice.common.RestResponse;
import com.codeoffice.config.id.IdWorkerUtils;
import com.codeoffice.entity.RedisConnection;
import com.codeoffice.mapper.RedisConnectionMapper;
import com.codeoffice.model.RedisConnectionVo;
import com.codeoffice.request.RedisConnectionAddRequest;
import com.codeoffice.request.RedisConnectionDeleteRequest;
import com.codeoffice.request.RedisConnectionQueryRequest;
import com.codeoffice.request.RedisConnectionUpdateRequest;
import com.codeoffice.service.RedisConnectionService;
import com.codeoffice.utils.BeanGenerator;
import com.codeoffice.utils.RedisClientUtil;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RedisConnectionServiceImpl implements RedisConnectionService {

    private static final Integer DEFAULT_DATABASE_INDEX = 0;

    private static DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss:SSS");

    @Autowired
    public RedisConnectionMapper redisConnectionMapper;

    @Autowired
    public RedisClientUtil redisClientUtil;

    @Override
    public RestResponse getAllList() {
        List<RedisConnection> list = redisConnectionMapper.queryAllList();
        List<RedisConnectionVo> voList = list.stream().map(e -> {
            RedisConnectionVo vo = new RedisConnectionVo();
            BeanUtils.copyProperties(e, vo);
            return vo;
        }).collect(Collectors.toList());
        return RestResponse.success(voList);
    }

    @Override
    public RestResponse getList(RedisConnectionQueryRequest request) {
        Page page = PageHelper.startPage(request.getCurrent(), request.getPageSize());
        List<RedisConnection> list = redisConnectionMapper.queryList(request);
        List<RedisConnectionVo> voList = list.stream().map(e -> {
            RedisConnectionVo vo = new RedisConnectionVo();
            BeanUtils.copyProperties(e, vo);
            return vo;
        }).collect(Collectors.toList());
        return RestResponse.success(new PageResponse(page, voList));
    }

    @Override
    public RestResponse getById(Long id) {
        if (id == null) {
            return RestResponse.error(RestCode.ILLEGAL_PARAMS);
        }
        RedisConnection redisConnection = redisConnectionMapper.selectByPrimaryKey(id);
        return RestResponse.success(redisConnection);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public RestResponse add(RedisConnectionAddRequest request) {
        RedisConnection redisConnection = BeanGenerator.generate(request, RedisConnection.class);
        redisConnection.setId(IdWorkerUtils.nextId());
        redisConnection.setCreateTime(dateTimeFormatter.format(LocalDateTime.now()));
        redisConnection.setUpdateTime(dateTimeFormatter.format(LocalDateTime.now()));
        if (redisClientUtil.pingRedisConnection(redisConnection)) {
            redisConnectionMapper.insertSelective(redisConnection);
            if (redisClientUtil.createRedisClient(redisConnection, DEFAULT_DATABASE_INDEX) != null) {
                redisClientUtil.printRedisClientMap();
                return RestResponse.success();
            }
            return RestResponse.error(RestCode.SERVICE_EXCEPTION);
        }
        return RestResponse.error(RestCode.REDIS_CONNECTION_FAILED);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public RestResponse update(RedisConnectionUpdateRequest request) {
        RedisConnection redisConnection = BeanGenerator.generate(request, RedisConnection.class);
        redisConnection.setUpdateTime(dateTimeFormatter.format(LocalDateTime.now()));
        if (redisClientUtil.pingRedisConnection(redisConnection)) {
            redisConnectionMapper.updateByPrimaryKeySelective(redisConnection);
            if (redisClientUtil.createRedisClient(redisConnection, DEFAULT_DATABASE_INDEX) != null) {
                redisClientUtil.printRedisClientMap();
                return RestResponse.success();
            }
            return RestResponse.error(RestCode.SERVICE_EXCEPTION);
        }
        return RestResponse.error(RestCode.REDIS_CONNECTION_FAILED);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public RestResponse delete(Long id) {
        redisConnectionMapper.deleteByPrimaryKey(id);
        redisClientUtil.removeRedisClientMap(id);
        redisClientUtil.removeRedisConnection(id);
        redisClientUtil.printRedisClientMap();
        return RestResponse.success();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public RestResponse batchDelete(RedisConnectionDeleteRequest request) {
        if (CollectionUtils.isEmpty(request.getIds())) {
            return RestResponse.error(RestCode.DELETE_IDS_IS_NULL);
        }
        redisConnectionMapper.batchDeleteByPrimaryKey(request);
        request.getIds().forEach(id -> {
            redisClientUtil.removeRedisClientMap(id);
            redisClientUtil.removeRedisConnection(id);
        });
        redisClientUtil.printRedisClientMap();
        return RestResponse.success();
    }

    @Override
    public RestResponse ping(RedisConnectionAddRequest request) {
        RedisConnection redisConnection = BeanGenerator.generate(request, RedisConnection.class);
        if (redisClientUtil.pingRedisConnection(redisConnection)) {
            return RestResponse.success();
        }
        return RestResponse.error(RestCode.REDIS_CONNECTION_FAILED);
    }
}
