package com.codeoffice.request;

import lombok.Data;

/**
 * @author: DongYanJun
 * @date: 2021/3/12 11:07
 */

@Data
public class RedisDataUpdateRequest {

    private Long redisConnectionId;

    private Integer databaseId;

    private String key;

    private String value;
}
