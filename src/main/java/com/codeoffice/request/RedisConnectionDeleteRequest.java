package com.codeoffice.request;

import lombok.Data;

import java.util.List;

/**
 * @author: DongYanJun
 * @date: 2021/3/12 11:07
 */

@Data
public class RedisConnectionDeleteRequest {

    private List<Long> ids;
}
