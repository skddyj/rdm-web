//package com.codeoffice.config;
//
//import org.redisson.Redisson;
//import org.redisson.api.RedissonClient;
//import org.redisson.config.ClusterServersConfig;
//import org.redisson.config.Config;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
///**
// * redisson配置
// * redis cluster集群的redisson配置
// *
// *
// */
//@Configuration
//public class RedissonClusterConfig {
//
//    @Autowired
//    private RedissonClusterConfigProperties redissonClusterConfigProperties;
//
//
//    @Bean
//    public RedissonClient getRedisson(){
//
//        System.out.println("passsword:"+redissonClusterConfigProperties.getPassword());
//        Config config = new Config();
//        List<String> clusterNodes = redissonClusterConfigProperties.getCluster().getNodes().stream().map(e-> "redis://"+e).collect(Collectors.toList());
//            ClusterServersConfig clusterServersConfig = config.useClusterServers()
//
//                //.setScanInterval(2000) // 集群状态扫描间隔时间，单位是毫秒
//                .addNodeAddress(clusterNodes.toArray(new String[clusterNodes.size()]));
//        clusterServersConfig.setPassword(redissonClusterConfigProperties.getPassword());
//
//        return Redisson.create(config);
//    }
//
//}