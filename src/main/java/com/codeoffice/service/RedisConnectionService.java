package com.codeoffice.service;

import com.codeoffice.common.RestResponse;
import com.codeoffice.request.RedisConnectionAddRequest;
import com.codeoffice.request.RedisConnectionDeleteRequest;
import com.codeoffice.request.RedisConnectionQueryRequest;
import com.codeoffice.request.RedisConnectionUpdateRequest;

/**
 * @author: DongYanJun
 * @date: 2021/1/8 16:31
 */
public interface RedisConnectionService {
    RestResponse getAllList();

    RestResponse getList(RedisConnectionQueryRequest request);

    RestResponse getById(Long id);

    RestResponse add(RedisConnectionAddRequest request);

    RestResponse update(RedisConnectionUpdateRequest request);

    RestResponse delete(Long id);

    RestResponse batchDelete(RedisConnectionDeleteRequest request);

    RestResponse ping(RedisConnectionAddRequest request);

    RestResponse print();
}
