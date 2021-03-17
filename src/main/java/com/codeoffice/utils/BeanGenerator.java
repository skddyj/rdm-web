package com.codeoffice.utils;

import lombok.Data;
import org.springframework.beans.BeanUtils;

/**
 * @author: DongYanJun
 * @date: 2021/1/8 16:57
 */

public class BeanGenerator {

    public static<T> T generate(Object source,Class<T> clazz) {
        T target= null;
        try {
            target = clazz.newInstance();
        } catch (Exception e) {
            e.printStackTrace();
        }
        BeanUtils.copyProperties(source,target);
        return target;
    }
}
