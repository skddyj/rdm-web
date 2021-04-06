package com.codeoffice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author: DongYanJun
 * @date: 2021/3/17 14:35
 */
@NoArgsConstructor
@AllArgsConstructor
@Data
public class RedisDatabaseModel {

    private Integer id;

    private String name;

    private Long keysCount;
}
