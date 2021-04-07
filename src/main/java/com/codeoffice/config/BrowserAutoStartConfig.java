package com.codeoffice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BrowserAutoStartConfig implements CommandLineRunner {
    @Value("${server.port}")
    private Integer port;

    @Override
    public void run(String... args) {

        String runCmd = "cmd /c start http://127.0.0.1:"+port;
        Runtime run = Runtime.getRuntime();
        try {
            run.exec(runCmd);
        } catch (Exception e) {
        }
    }
}