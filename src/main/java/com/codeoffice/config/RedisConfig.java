package com.codeoffice.config;

import com.google.common.collect.Sets;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * redis配置
 *
 */
@Configuration
public class RedisConfig {

	@Bean
	public RedisTemplate<Object, Object> redisTemplate(
			RedisConnectionFactory redisConnectionFactory) {
		RedisTemplate<Object, Object> template = new RedisTemplate();
		template.setConnectionFactory(redisConnectionFactory);

		StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();

		Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<>(Object.class);
		// Java序列化是指把Java对象转换为字节序列的过程，而Java反序列化是指把字节序列恢复为Java对象的过程；
		// Java的序列化会保存对象的所有属性包括方法，但是JSON序列化只能保存属性
		// 序列化的作用：网络传输或者持久化存储，将对象转换成二进制流或者字符串
		// 序列化方式 默认是JdkSerializationRedisSerializer，这种序列化方式使用redis可视化工具时看不到具体数据
		// 修改成Jackson2JsonRedisSerializer

		// GenericJackson2JsonRedisSerializer和Jackson2JsonRedisSerializer的区别
		// 都是用JSON格式存储数据
		// Jackson2JsonRedisSerializer需要指明序列化的类，生成的数据不包含类信息，速度快
		// GenericJackson2JsonRedisSerializer不需要指明序列化类，生成的数据包含类信息，速度慢于Jackson2JsonRedisSerializer
		// Jackson2JsonRedisSerializer反序列化带泛型的数组类会报转换异常，解决办法存储以JSON字符串存储。
		// template.setDefaultSerializer(jackson2JsonRedisSerializer);

		// key序列化
		template.setKeySerializer(stringRedisSerializer);
		// hash的key序列化
		template.setHashKeySerializer(stringRedisSerializer);
		// value序列化
		template.setValueSerializer(jackson2JsonRedisSerializer);
		// hash的value序列化
		template.setHashKeySerializer(jackson2JsonRedisSerializer);
		return template;
	}

	@Bean
	public RedisCacheManager cacheManager(RedisConnectionFactory redisConnectionFactory){
		StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
		// 用这种序列化器会报错，因为没有保存@class信息
		//Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<>(Object.class);
		GenericJackson2JsonRedisSerializer genericJackson2JsonRedisSerializer = new GenericJackson2JsonRedisSerializer();

		// RedisCacheWriter redisCacheWriter = RedisCacheWriter.nonLockingRedisCacheWriter(redisConnectionFactory);
		RedisCacheConfiguration redisCacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()
				.entryTtl(Duration.ofMinutes(2))  // 默认配置
				.computePrefixWith(name->name+":")
				.disableCachingNullValues() // 不允许缓存null值
				.serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(stringRedisSerializer))
				.serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(genericJackson2JsonRedisSerializer));

		// RedisCacheConfiguration配置写死
		/*return RedisCacheManager.builder(redisConnectionFactory)
				.cacheDefaults(redisCacheConfiguration)
				.transactionAware() // 事务提交正常时才缓存
				.build();*/
		// 根据key动态获取RedisCacheConfiguration
		return RedisCacheManager.builder(redisConnectionFactory)
				.cacheDefaults(redisCacheConfiguration)
				//.initialCacheNames(this.getRedisCacheNames()) // 好像不需要设置也可以
				.withInitialCacheConfigurations(this.getRedisCacheConfigurationMap())
				.transactionAware() // 事务提交正常时才缓存
				.build();
	}

	// cache key set
	private Set<String> getRedisCacheNames() {
		Set<String> cacheNames = Sets.newHashSet("userCache","userListCache");
		return cacheNames;
	}

	// 根据key动态获取ttl
	private Map<String, RedisCacheConfiguration> getRedisCacheConfigurationMap() {
		Map<String, RedisCacheConfiguration> redisCacheConfigurationMap = new HashMap<>();
		redisCacheConfigurationMap.put("userCache", this.getRedisCacheConfigurationWithTtl(Duration.ofMinutes(10)));
		redisCacheConfigurationMap.put("userListCache", this.getRedisCacheConfigurationWithTtl(Duration.ofMinutes(20)));
		return redisCacheConfigurationMap;
	}


	// 根据ttl生成RedisCacheConfiguration
	private RedisCacheConfiguration getRedisCacheConfigurationWithTtl(Duration duration) {
//		Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<>(Object.class);
//		ObjectMapper om = new ObjectMapper();
//		// 指定要序列化的域，field,get和set,以及修饰符范围，ANY是都有包括private和public
//		om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
//		// 指定序列化输入的类型，类必须是非final修饰的，final修饰的类，比如String,Integer等会抛出异常
//		om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
//		jackson2JsonRedisSerializer.setObjectMapper(om);

		StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
		// 用这种序列化器会报错，因为没有保存@class信息
		//Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer<>(Object.class);
		GenericJackson2JsonRedisSerializer genericJackson2JsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
		RedisCacheConfiguration redisCacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()
				.entryTtl(duration) // 动态获取duration
				.computePrefixWith(name->name+":")
				.disableCachingNullValues() // 不允许缓存null值
				.serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(stringRedisSerializer))
				.serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(genericJackson2JsonRedisSerializer));
		return redisCacheConfiguration;
	}
	
}