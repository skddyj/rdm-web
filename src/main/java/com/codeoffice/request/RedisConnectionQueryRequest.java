package com.codeoffice.request;

import com.codeoffice.common.BaseRequest;
import lombok.Data;

/**
 * @author: DongYanJun
 * @date: 2021/3/12 11:07
 */

@Data
public class RedisConnectionQueryRequest extends BaseRequest {

    private String name;

    private String host;

    private Integer port;
}
