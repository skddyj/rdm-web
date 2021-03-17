//package com.codeoffice.job.config;
//
//import org.apache.shardingsphere.elasticjob.reg.zookeeper.ZookeeperConfiguration;
//import org.apache.shardingsphere.elasticjob.reg.zookeeper.ZookeeperRegistryCenter;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//@Configuration
//@ConditionalOnExpression("'${regCenter.serverList}'.length() > 0")
//public class RegistryCenterConfig {
//    // 注册中心配置类
//    @Bean(initMethod = "init")
//    public ZookeeperRegistryCenter regCenter(@Value("${regCenter.serverLists}") final String serverLists, @Value("${regCenter.namespace}") final String namespace) {
//        return new ZookeeperRegistryCenter(new ZookeeperConfiguration(serverLists, namespace));
//    }
//}