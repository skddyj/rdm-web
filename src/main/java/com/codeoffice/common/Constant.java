package com.codeoffice.common;

import lombok.Data;

/**
 * @author: DongYanJun
 * @date: 2021/1/11 16:21
 */
public class Constant {
    public static final String DATA_SOURCE_PREFIX = "dataSource-";
    // 等待锁超时时间
    public static final long RLOCK_WAIT_MILLISECONDS = 100;

    // 释放锁超时时间
    public static final long RLOCK_LEASE_MILLISECONDS = 5000;

    public static final String PREVENT_RESUBMIT_LOCK_KEY_PREFIX = "PREVENT_RESUBMIT:";

    public static final String METHOD_ADD = "ADD_";

    public static final String METHOD_EDIT = "EDIT_";

    public static final String METHOD_DELETE = "DELETE_";

    public static final String METHOD_BATCH_DELETE = "BATCH_DELETE_";

    public static final String ORACLE_DRIVER = "oracle.jdbc.OracleDriver";

    public static final String MYSQL_DRIVER = "com.mysql.cj.jdbc.Driver";

    public static final String POSTGRESQL_DRIVER = "org.postgresql.Driver";

}
