package com.codeoffice.service;

import com.codeoffice.common.RestResponse;
import com.codeoffice.request.*;

/**
 * @author: DongYanJun
 * @date: 2021/1/8 16:31
 */
public interface RedisDataService {

    RestResponse databaseCount(Long id);

    RestResponse keys(RedisDataQueryRequest request);

    RestResponse keysPages(RedisDataQueryRequest request);

    RestResponse mget(RedisDataQueryRequest request);
}
