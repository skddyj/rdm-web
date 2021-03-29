package com.codeoffice.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class RedisDataZSetModel {

    private Integer index;

    private Double score;

    private String value;
}