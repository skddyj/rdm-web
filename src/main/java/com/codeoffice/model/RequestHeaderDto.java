package com.codeoffice.model;

import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 请求头
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestHeaderDto implements Serializable {

    @ApiModelProperty("设备类型：1-android,2-ios,3-wp,4-未知")
    private Byte deviceType;

    @ApiModelProperty("来源")
    private String source;

    @ApiModelProperty("IP")
    private String ip;

    @ApiModelProperty("唯一请求标志")
    private String distinctId = "4102416001";

    @ApiModelProperty("启动时间")
    private String launchTime;

    @ApiModelProperty("系统版本")
    private String os;

    @ApiModelProperty("程序版本")
    private String vc;

    @ApiModelProperty("启动页面Id")
    private String startPageId = "unknown";

    @ApiModelProperty("上个页面Id")
    private String prePageId = "unknown";

    @ApiModelProperty("当前页面Id")
    private String currentPageId = "unknown";

    @ApiModelProperty("用户Id")
    private Long userId;

}
