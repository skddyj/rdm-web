package com.codeoffice.config.id;

public class IdWorkerUtils {
	static private IdWorker idWorker;
	
	public static void setIdWorker(IdWorker idWorker) {
		IdWorkerUtils.idWorker = idWorker;
	}

	public static long nextId() {
		return idWorker.nextId();
	}
}
