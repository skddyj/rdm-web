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

    RestResponse database(Long id);

    RestResponse keys(RedisDataQueryRequest request);

    RestResponse keysPages(RedisDataQueryRequest request);

    RestResponse addValue(RedisDataRowUpdateRequest request);

    RestResponse getValue(RedisDataQueryRequest request);

    RestResponse updateValue(RedisDataRowUpdateRequest request);

    RestResponse removeValue(RedisDataRowUpdateRequest request);

    RestResponse getKeyAttr(RedisDataQueryRequest request);

    RestResponse set(RedisDataRowUpdateRequest request);

    RestResponse addKey(RedisDataRowUpdateRequest request);

    RestResponse removeKey(RedisDataUpdateRequest request);

    RestResponse renameKey(RedisDataUpdateRequest request);

    RestResponse expire(RedisDataUpdateRequest request);

    RestResponse mget(RedisDataQueryRequest request);
}
