package com.codeoffice.common.enums;

public enum ConnectionType {
    DEFAULT(0, "单机"),
    CLUSTER(1, "集群"),
    SENTINEL(2, "哨兵");

    public final int code;
    public final String message;

    ConnectionType(int code, String message) {
        this.code = code;
        this.message = message;
    }

}
