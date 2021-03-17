//package com.codeoffice.job.config;
//
//import com.alibaba.druid.pool.DruidDataSource;
//import lombok.Data;
//import org.apache.shardingsphere.elasticjob.infra.listener.ElasticJobListener;
//import org.apache.shardingsphere.elasticjob.lite.api.listener.AbstractDistributeOnceElasticJobListener;
//import org.apache.shardingsphere.elasticjob.reg.base.CoordinatorRegistryCenter;
//import org.apache.shardingsphere.elasticjob.reg.zookeeper.ZookeeperConfiguration;
//import org.apache.shardingsphere.elasticjob.reg.zookeeper.ZookeeperRegistryCenter;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import javax.annotation.Resource;
//
//@Configuration
//@Data
//public class ElasticJobConfig {
//    @Value("${regCenter.serverLists}")
//    private String serverLists;
//    @Value("${regCenter.namespace}")
//    private String namespace;
//
//    @Resource
//    private DruidDataSource dataSource;
//
//    @Bean
//    public ZookeeperConfiguration zkConfig() {
//        return new ZookeeperConfiguration(serverLists, namespace);
//    }
//
//    @Bean(initMethod = "init")
//    public ZookeeperRegistryCenter regCenter(ZookeeperConfiguration config) {
//        return new ZookeeperRegistryCenter(config);
//    }
//
//    private CoordinatorRegistryCenter createRegistryCenter() {
//        CoordinatorRegistryCenter regCenter = new ZookeeperRegistryCenter(zkConfig());
//        regCenter.init();
//        return regCenter;
//    }
//
//}