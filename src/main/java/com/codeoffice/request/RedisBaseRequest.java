package com.codeoffice.request;

import lombok.Data;

/**
 * @author: DongYanJun
 * @date: 2021/3/29 14:04
 */
@Data
public class RedisBaseRequest {

    private Long connectionId;

    private Integer databaseId;

    private String key;

    private String type;
}
