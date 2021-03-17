package com.codeoffice.mapper;


import com.codeoffice.entity.RedisConnection;
import com.codeoffice.request.RedisConnectionDeleteRequest;
import com.codeoffice.request.RedisConnectionQueryRequest;

import java.util.List;

public interface RedisConnectionMapper {
    List<RedisConnection> queryAllList();

    List<RedisConnection> queryList(RedisConnectionQueryRequest request);

    int deleteByPrimaryKey(Long id);

    int batchDeleteByPrimaryKey(RedisConnectionDeleteRequest request);

    int insert(RedisConnection record);

    int insertSelective(RedisConnection record);

    RedisConnection selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(RedisConnection record);

    int updateByPrimaryKey(RedisConnection record);
}