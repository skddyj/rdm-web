package com.codeoffice.response;

import lombok.*;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private Long id;

    private Long channelId;

    private String mobile;

    private Integer loginStatus;

    private Date createTime;

    private Date updateTime;

    private String userName;

    private Integer checkMobileFlag;

    private String token;

    private String clientType;

    private Byte gender;

    private Byte marry;

    private Byte baby;

}