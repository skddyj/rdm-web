//package com.codeoffice.job;
//
//import org.apache.shardingsphere.elasticjob.api.ShardingContext;
//import org.apache.shardingsphere.elasticjob.simple.job.SimpleJob;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//import java.text.SimpleDateFormat;
//import java.util.Date;
//import java.util.List;
//
//
//@Component
//public class SpringBootSimpleJob implements SimpleJob {
//
//    private final Logger logger = LoggerFactory.getLogger(SpringBootSimpleJob.class);
//
//    @Override
//    public void execute(ShardingContext shardingContext) {
//        logger.info("Item: {} | Time: {} | Thread: {} | {}",
//                shardingContext.getShardingItem(), new SimpleDateFormat("HH:mm:ss").format(new Date()), Thread.currentThread().getId(), "SIMPLE");
//        String s=shardingContext.getShardingParameter();
//        System.out.println(s);
//    }
//}
