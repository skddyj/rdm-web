//package com.codeoffice.job;
//
//import lombok.extern.slf4j.Slf4j;
//import org.apache.curator.framework.CuratorFramework;
//import org.apache.curator.framework.imps.CuratorFrameworkImpl;
//import org.apache.shardingsphere.elasticjob.api.JobConfiguration;
//import org.apache.shardingsphere.elasticjob.api.ShardingContext;
//import org.apache.shardingsphere.elasticjob.lite.api.bootstrap.impl.OneOffJobBootstrap;
//import org.apache.shardingsphere.elasticjob.lite.api.bootstrap.impl.ScheduleJobBootstrap;
//import org.apache.shardingsphere.elasticjob.reg.zookeeper.ZookeeperRegistryCenter;
//import org.apache.shardingsphere.elasticjob.simple.job.SimpleJob;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
///**
// * @author: DongYanJun
// * @date: 2020/12/1 15:14
// */
//@Slf4j
//@Service
//public class JobService {
//
//    private final ZookeeperRegistryCenter zookeeperRegistryCenter;
//
//    public JobService(ZookeeperRegistryCenter zookeeperRegistryCenter) {
//        this.zookeeperRegistryCenter = zookeeperRegistryCenter;
//    }
//
//    public boolean getJobList() {
//        System.out.println(zookeeperRegistryCenter.get("test"));
//        return true;
//    }
//
//    // 动态添加定时任务
//    public boolean addScheduleJob() {
//        log.info("动态添加定时任务");
//        JobConfiguration jobConfiguration = JobConfiguration.newBuilder("test", 2)
//                .cron("0/5 * * * * ?")
//                .shardingItemParameters("0=alex,1=tom").build();
//        SimpleJob simpleJob=new SimpleJob() {
//            @Override
//            public void execute(ShardingContext shardingContext) {
//                System.out.println("定时任务");
//            }
//        };
//        ScheduleJobBootstrap scheduleJobBootstrap=new ScheduleJobBootstrap(zookeeperRegistryCenter,simpleJob,jobConfiguration);
//        // 启动任务
//        scheduleJobBootstrap.schedule();
//        return true;
//    }
//
//    // 动态添加一次性任务
//    public boolean addOneOffJob() {
//        log.info("动态添加一次性任务");
//        JobConfiguration jobConfiguration = JobConfiguration.newBuilder("test2", 2)
//                .shardingItemParameters("0=alex,1=tom").build();
//        SimpleJob simpleJob=new SimpleJob() {
//            @Override
//            public void execute(ShardingContext shardingContext) {
//                System.out.println("一次性任务");
//            }
//        };
//        OneOffJobBootstrap oneOffJobBootstrap=new OneOffJobBootstrap(zookeeperRegistryCenter,simpleJob,jobConfiguration);
//        // 执行任务
//        oneOffJobBootstrap.execute();
//        return true;
//    }
//}
