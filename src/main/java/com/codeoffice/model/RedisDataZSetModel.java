package com.codeoffice.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class RedisDataZSetModel {

    private String score;

    private String value;
}