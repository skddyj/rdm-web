package com.codeoffice.request;

import com.codeoffice.common.BaseRequest;
import lombok.Data;

/**
 * @author: DongYanJun
 * @date: 2021/3/12 11:07
 */

@Data
public class RedisDataQueryRequest extends BaseRequest {

    private Long redisConnectionId;

    private Integer databaseId;

    private String key;

    private String type;
}
