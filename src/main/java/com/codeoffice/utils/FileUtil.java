package com.codeoffice.utils;

/**
 * @author: DongYanJun
 * @date: 2020/11/25 9:50
 */
public class FileUtil {

    public static void main(String[] args) {
        System.out.println(get());
    }

    public static long get(){
        long count = 0;
        long startTimeMills =System.currentTimeMillis();
        for (; ;) {
            long endTimeMills =System.currentTimeMillis();

            if (endTimeMills-startTimeMills<1000) {
                count++;
            } else {
                return count;
            }

        }
    }
}
