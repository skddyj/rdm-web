package com.codeoffice.utils.excel;

import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import com.alibaba.fastjson.JSON;
import com.google.common.collect.Maps;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

public class ExcelReadListener extends AnalysisEventListener<Map<Integer,String>> {
    private static final Logger LOGGER = LoggerFactory.getLogger(ExcelReadListener.class);

    private static final int BATCH_COUNT = 5;
//    Map<Integer,Map<Integer,String>> data = new HashMap<>();
    Map<String,String> data = Maps.newHashMapWithExpectedSize(256);

    public ExcelReadListener() {
    }

    
    @Override
    public void invoke(Map<Integer,String> rowData, AnalysisContext context) {
        Integer rowIndex=context.readRowHolder().getRowIndex();
        rowData.forEach((k,v)-> data.put(ExcelColumnNumberUtil.digit2ExcelNum(k+1)+(rowIndex+1),v) );
        LOGGER.info("解析到一条数据:{}", JSON.toJSONString(rowData));
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        LOGGER.info("所有数据解析完成！");
    }

    public Map<String, String> getData() {
        return data;
    }
}