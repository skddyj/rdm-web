package com.codeoffice.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class RedisDataZSetModel {

    private String key;

    private String host;
}