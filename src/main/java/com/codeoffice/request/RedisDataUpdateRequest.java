package com.codeoffice.request;

import lombok.Data;

/**
 * @author: DongYanJun
 * @date: 2021/3/12 11:07
 */

@Data
public class RedisDataUpdateRequest extends RedisBaseRequest{

    private String newKey;

    private Long ttl;
}
