//package com.codeoffice.config;
//
//import org.redisson.Redisson;
//import org.redisson.api.RedissonClient;
//import org.redisson.config.Config;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.stereotype.Component;
//
//import java.util.List;
//
///**
// * redisson配置
// * redis cluster集群的redisson配置
// *
// *
// */
//@Component
//@ConfigurationProperties(prefix = "spring.redis")
//public class RedissonClusterConfigProperties {
//
//    private Cluster cluster;
//
//    private String password;
//
//    public static class Cluster {
//        private List<String> nodes;
//
//        public List<String> getNodes() {
//            return nodes;
//        }
//
//        public void setNodes(List<String> nodes) {
//            this.nodes = nodes;
//        }
//    }
//
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }
//
//    public Cluster getCluster() {
//        return cluster;
//    }
//
//    public void setCluster(Cluster cluster) {
//        this.cluster = cluster;
//    }
//}