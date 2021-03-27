package com.codeoffice.request;

import lombok.Data;

/**
 * @author: DongYanJun
 * @date: 2021/3/12 11:07
 */

@Data
public class RedisDataRowUpdateRequest {

    private Long connectionId;

    private Integer databaseId;

    private String type;

    private Long index;

    private String key;

    private Object value;

    private String newKey;

    private Object newValue;
}
