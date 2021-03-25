package com.codeoffice.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RedisDataResponse<T> {
    private String key;

    private T value;

    private String type;

    private Long ttl;
}