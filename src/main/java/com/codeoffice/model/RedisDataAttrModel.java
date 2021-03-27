package com.codeoffice.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class RedisDataAttrModel {
    private String key;

    private String type;

    private Long ttl;
}