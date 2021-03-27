package com.codeoffice.common;

public enum RestCode {
    OK(0, "OK"),
    UNKNOWN_ERROR(1, "未知异常"),
    WRONG_PAGE(10100, "页码不合法"),
    USER_NOT_FOUND(10101, "用户未找到"),
    ILLEGAL_PARAMS(10102, "参数不合法"),
    ILLEGAL_MOBILE(10105, "手机号不合法"),
    ILLEGAL_VERIFICATION(10104, "验证码错误"),
    PASSWORD_IS_NOT_RIGHT(10106, "密码不正确"),
    OLD_PASSWORD_NOT_MATCH(10107, "旧密码不匹配,修改失败"),
    USER_ACCOUNT_NOT_FOUND(10108, "用户账户不存在"),
    USER_ACCOUNT_AMOUNT_NOT_ENOUGH(10109, "账户可提现金额不足，无法提现"),

    USER_NO_ANY_MWNU(10201, "用户没有操作菜单的权限"),
    LOGIN_LOG_RECORD_FAIL(10202, "用户登录日志记录失败"),
    USER_POWER_NOT_ENOUGH(10203, "没有权限执行操作"),
    MOBILE_OR_CODE(10204, "手机号或验证码为空"),
    MOBILE_NO_CODE(10205, "手机号与验证码不匹配"),
    CODE_NO_OR_EXPIRE(10206, "验证码不存在或已过期"),
    USER_HAVE_PARTNER(20101, "用户已经绑定分享信息"),
    DATABASE_WRITE_ERROR(31234,"数据操作异常"),
    USER_HAS_EXISTENCE(31235,"用户名已被占用"),
    MENU_TARGET_URL_HAS_EXISTENCE(31236,"路径或名称重复"),
    MENU_HAS_EXISTENCE(32137,"权限名或权限路径重复"),
    MENU_HAS_DELETE(32138,"该添加为已删除权限,如需使用可进行恢复"),
    ROLE_NAME_EXISTENCE(32139,"角色名重复"),
    THIS_MENU_NOT_EXISTENCE(32140,"该URL所对应权限不存在"),
    WECHAT_NEWS_PUSH_FAIL(32160,"微信消息推送失败"),
    REPORT_DATA_NOT_FIND(32161,"对应的采样器数据不存在"),
    MSG_TASK_DATA_NOT_FIND(32161,"对应的推送任务不存在"),
    MOBILE_HAD_BIND_COLLECTOR(32162, "新号码已绑定报告"),


    PRODUCT_ALREADY_SALEOUT(30000, "商品已卖完"),
    ALREADY_BUY(30001, "不能重复购买"),
    SEC_KILL_FAILED(30000, "秒杀失败"),
    SERVICE_EXCEPTION(30000, "服务异常"),

    DELETE_IDS_IS_NULL(31000, "ID不能为空"),
    REDIS_CONNECTION_FAILED(31001, "Redis连接失败"),

    REDIS_DATA_KEY_EXISTED(31002, "该Key已存在，请重新输入"),
    REDIS_DATA_NO_SUCH_KEY(31003, "该Key不存在或已删除"),
    ;


    public final int code;
    public final String message;

    RestCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

}
