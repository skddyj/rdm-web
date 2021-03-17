package com.codeoffice.utils.excel;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.EasyExcelFactory;
import com.alibaba.excel.ExcelReader;
import com.alibaba.excel.read.metadata.ReadSheet;
import org.springframework.util.StopWatch;

import java.io.File;

/**
 * @author: DongYanJun
 * @date: 2020/11/25 9:24
 */
public class ExcelUtil {



    public static void main(String[] args) {
        // File file=new File("C:\\Users\\ccbft\\Desktop\\测试文件\\1.xlsx");
        File file=new File("C:\\Users\\ccbft\\Desktop\\建信金科\\监管系统\\地方资管\\上海市地方金融组织基本情况统计表.xlsx");

        ExcelReadListener listener = new ExcelReadListener();
        ExcelReader excelReader = null;
        try {
            StopWatch stopWatch=new StopWatch();
            stopWatch.start();
            excelReader = EasyExcelFactory.read(file, listener).build();
            ReadSheet readSheet = EasyExcel.readSheet(0).headRowNumber(0).build();
            excelReader.read(readSheet);
            stopWatch.stop();
            System.out.println("耗时："+stopWatch.getTotalTimeMillis()+"毫秒");
            System.out.println(listener.getData());
            System.out.println(listener.getData().size());
        } finally {
            if (excelReader != null) {
                excelReader.finish();
            }
        }

        System.out.println(ExcelColumnNumberUtil.digit2ExcelNum(16385));
        System.out.println(ExcelColumnNumberUtil.excelNum2Digit("AA"));


    }

}
