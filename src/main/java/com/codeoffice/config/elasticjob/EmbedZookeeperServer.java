package com.codeoffice.config.elasticjob;

import org.apache.curator.test.TestingServer;

import java.io.File;
import java.io.IOException;

public final class EmbedZookeeperServer {
    
    private static TestingServer testingServer;
    
    /**
     * 嵌入式zookeeper，用于测试
     * @param port ZooKeeper port
     */
    public static void start(final int port) {
        try {
            testingServer = new TestingServer(port, new File(String.format("target/test_zk_data/%s/", System.nanoTime())),false);
            testingServer.start();
        } catch (Throwable ex) {
            ex.printStackTrace();
        } finally {
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                try {
                    Thread.sleep(1000L);
                    testingServer.close();
                } catch (final InterruptedException | IOException ignore) {
                }
            }));
        }
    }
}