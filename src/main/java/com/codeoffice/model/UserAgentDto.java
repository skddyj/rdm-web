package com.codeoffice.model;

import lombok.Data;

/**
 * 用户请求代理信息
 */
@Data
public class UserAgentDto {

    /**
     * 1-android,2-ios，3-wp,4-未知
     */
    private Byte deviceType;

    //设备名称
    private String deviceName;

    //设备id
    private String deviceId;

    //大版本号
    private String bigV;

    //小版本号
    private String smallV;

    //系统版本
    private String osV;

    //应用包名
    private String appPackName;

    //渠道号
    private String channleCode;

    //head:Refere
    private String fromUrl;

    //请求ip
    private String ip;
}
