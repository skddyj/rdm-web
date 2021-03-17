package com.codeoffice.config.id;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "idworker")
public class IdWorkerProperties {

	private int workerId;

	public int getWorkerId() {
		return workerId;
	}

	public void setWorkerId(int workId) {
		this.workerId = workId;
	}
}
