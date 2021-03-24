package com.codeoffice.request;

import lombok.Data;

/**
 * @author: DongYanJun
 * @date: 2021/3/12 11:07
 */

@Data
public class RedisDataUpdateRequest {

    private Long connectionId;

    private Integer databaseId;

    private String type;

    private String key;

    private Object value;
}
