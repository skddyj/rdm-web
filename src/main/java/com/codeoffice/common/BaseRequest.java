package com.codeoffice.common;

import lombok.Data;

@Data
public class BaseRequest {
    private int current = 1;
    private int pageSize = 20;
}
