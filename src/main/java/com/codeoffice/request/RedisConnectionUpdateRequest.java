package com.codeoffice.request;

import lombok.Data;

/**
 * @author: DongYanJun
 * @date: 2021/3/12 11:07
 */

@Data
public class RedisConnectionUpdateRequest{
    private Long id;

    private String name;

    private String host;

    private Integer port;

    private String password;

    private String username;

    private String desc;

    private Integer type;
}
