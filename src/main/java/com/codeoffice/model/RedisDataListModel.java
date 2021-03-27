package com.codeoffice.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class RedisDataListModel {

    private String id;

    private String value;
}