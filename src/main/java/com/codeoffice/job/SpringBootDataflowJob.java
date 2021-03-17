//package com.codeoffice.job;
//
//import org.apache.shardingsphere.elasticjob.api.ShardingContext;
//import org.apache.shardingsphere.elasticjob.dataflow.job.DataflowJob;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.stereotype.Component;
//
//import javax.annotation.Resource;
//import java.text.SimpleDateFormat;
//import java.util.Date;
//import java.util.List;
//
//@Component
//public class SpringBootDataflowJob implements DataflowJob<Job> {
//
//    private final Logger logger = LoggerFactory.getLogger(SpringBootDataflowJob.class);
//
//    @Resource
//    private JobDao jobDao;
//
//    @Override
//    public List<Job> fetchData(final ShardingContext shardingContext) {
//        logger.info("Item: {} | Time: {} | Thread: {} | {}",
//                shardingContext.getShardingItem(), new SimpleDateFormat("HH:mm:ss").format(new Date()), Thread.currentThread().getId(), "DATAFLOW FETCH");
//        // 获取分片数据
//        return jobDao.findTodoData(shardingContext.getShardingParameter(), 10);
//    }
//
//    @Override
//    public void processData(final ShardingContext shardingContext, final List<Job> data) {
//        logger.info("Item: {} | Time: {} | Thread: {} | {}",
//                shardingContext.getShardingItem(), new SimpleDateFormat("HH:mm:ss").format(new Date()), Thread.currentThread().getId(), "DATAFLOW PROCESS");
//        System.out.println("任务数量："+data.size());
//        for (Job each : data) {
//            jobDao.setCompleted(each.getId());
//        }
//    }
//}
