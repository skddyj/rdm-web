package com.codeoffice.service;

import com.codeoffice.common.RestResponse;
import com.codeoffice.request.RedisDataQueryRequest;
import com.codeoffice.request.RedisDataRowUpdateRequest;
import com.codeoffice.request.RedisDataUpdateRequest;

/**
 * @author: DongYanJun
 * @date: 2021/1/8 16:31
 */
public interface RedisDataService {

    RestResponse databaseCount(Long id);

    RestResponse keys(RedisDataQueryRequest request);

    RestResponse addValue(RedisDataUpdateRequest request);

    RestResponse getValue(RedisDataQueryRequest request);

    RestResponse updateValue(RedisDataRowUpdateRequest request);

    RestResponse getKeyAttr(RedisDataQueryRequest request);

    RestResponse set(RedisDataUpdateRequest request);

    RestResponse addKey(RedisDataUpdateRequest request);

    RestResponse removeKey(RedisDataUpdateRequest request);

    RestResponse renameKey(RedisDataUpdateRequest request);

    RestResponse expire(RedisDataUpdateRequest request);

    RestResponse keysPages(RedisDataQueryRequest request);

    RestResponse mget(RedisDataQueryRequest request);
}
