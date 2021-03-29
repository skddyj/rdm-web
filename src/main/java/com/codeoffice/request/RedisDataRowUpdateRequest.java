package com.codeoffice.request;

import lombok.Data;

/**
 * @author: DongYanJun
 * @date: 2021/3/12 11:07
 */

@Data
public class RedisDataRowUpdateRequest extends RedisBaseRequest{

    private Long index;

    private Object rowValue;

    private Object newRowValue;
}
