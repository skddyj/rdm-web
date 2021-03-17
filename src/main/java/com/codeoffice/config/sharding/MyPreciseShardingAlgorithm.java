/*
package com.codeoffice.config.sharding;

import org.apache.shardingsphere.api.sharding.standard.PreciseShardingAlgorithm;
import org.apache.shardingsphere.api.sharding.standard.PreciseShardingValue;

import java.util.Collection;

// sharing-jdbc数据库分片算法（分表）、分库算法
public class MyPreciseShardingAlgorithm implements PreciseShardingAlgorithm<Long> {

	// PreciseShardingAlgorithm是必选的，用于处理=和IN的分片。
	// RangeShardingAlgorithm是可选的，用于处理BETWEEN AND分片，如果不配置RangeShardingAlgorithm，SQL中的BETWEEN AND将按照全库路由处理。
	@Override
	public String doSharding(Collection<String> availableTargetNames, PreciseShardingValue<Long> shardingValue) {
		for (String tableName : availableTargetNames) {
			if (tableName.endsWith(shardingValue.getValue() % 2 + "")) {
				return tableName;
			}
		}
		throw new IllegalArgumentException();
	}

}*/
