package com.codeoffice.entity;

import lombok.*;

@Data
public class RedisConnection {
    private Long id;

    private String name;

    private String host;

    private Integer port;

    private String password;

    private String username;

    private String createTime;

    private String updateTime;

    private String desc;
}