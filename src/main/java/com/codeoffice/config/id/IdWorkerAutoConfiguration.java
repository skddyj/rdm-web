package com.codeoffice.config.id;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(prefix = "idworker", name = { "workerId" })
@EnableConfigurationProperties(IdWorkerProperties.class)
public class IdWorkerAutoConfiguration {
	@Autowired
	private IdWorkerProperties idWorkerProperties;

	@Bean
	IdWorker idWorker() {
		IdWorker idWorker=new IdWorker(idWorkerProperties.getWorkerId());
		IdWorkerUtils.setIdWorker(idWorker);
		return idWorker;
	}
}
