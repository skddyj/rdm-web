package com.codeoffice.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class RedisConnectionVo {
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