package com.codeoffice.config.id;

/**
 * From: https://github.com/twitter/snowflake An object that generates IDs. This is broken into a separate class in case we ever want to support multiple worker threads per process
 * 
 * 以下详细说明 Snowflake ID有64bits长，由以下三部分组成： 1. time—42bits,精确到ms，那就意味着其可以表示长达(2^42-1 )/(1000360024*365)=139.5年，另外使用者可以自己定义一个开始纪元（epoch)，
 * 然后用(当前时间-开始纪元）算出time，这表示在time这个部分在140年的时间里是不会重复的，官方文档在这里写成了41bits，应该是写错了。 另外，这里用time还有一个很重要的原因，就是可以直接更具time进行排序，对于twitter这种更新频繁的应用，时间排序就显得尤为重要了。
 * 
 * 2. machine id—10bits,该部分其实由datacenterId和workerId两部分组成，这两部分是在配置文件中指明的。
 * 
 * datacenterId的作用(个人看法) 1).方便搭建多个生成uid的service，并保证uid不重复，比如在datacenter0将机器0，1，2组成了一个生成uid的service， 而datacenter1此时也需要一个生成uid的service，从本中心获取uid显然是最快最方便的，那么它可以在自己中心搭建，
 * 只要保证datacenterId唯一。如果没有datacenterId，即用10bits，那么在搭建一个新的service前必须知道目前已经在用的id， 否则不能保证生成的id唯一，比如搭建的两个uid service中都有machine id为100的机器，如果其server时间相同，那么产生相同id的情况不可避免。
 * 
 * 2).加快server启动速度。启动一台uid server时，会去检查zk同workerId目录中其他机器的情况， 如其在zk上注册的id和向它请求返回的work_id是否相同，是否处同一个datacenter下， 另外还会检查该server的时间与目前已有机器的平均时间误差是否在10s范围内等，这些检查是会耗费一定时间的。
 * 将一个datacenter下的机器数限制在32台(5bits)以内，在一定程度上也保证了server的启动速度。
 * 
 * workerId是实际server机器的代号，最大到32，同一个datacenter下的workerId是不能重复的。 它会被注册到zookeeper上，确保workerId未被其他机器占用，并将host:port值存入，注册成功后就可以对外提供服务了。
 * 
 * sequence id —12bits,该id可以表示4096个数字，它是在time相同的情况下，递增该值直到为0，即一个循环结束，此时便只能等到下一个ms到来， 一般情况下4096/ms的请求是不太可能出现的，所以足够使用了。
 * 
 * Snowflake ID便是通过这三部分实现了UID的产生，策略也并不复杂。
 * 
 * 核心代码就是毫秒级时间41位+机器ID 10位+毫秒内序列12位
 * 
 */
public class IdWorker {

	private final long epoch = 1403854494756L; // 时间起始标记点，作为基准，一般取系统的最近时间
	private final long workerIdBits = 4L; // 机器标识位数
	private final long sequenceBits = 10L; // 毫秒内自增位

	private final long maxWorkerId = -1L ^ -1L << this.workerIdBits;// 机器ID最大值:16

	private final long workerIdShift = this.sequenceBits; // 12
	private final long timestampLeftShift = this.sequenceBits + this.workerIdBits;
	private final long sequenceMask = -1L ^ -1L << this.sequenceBits;

	private final long workerId;
	private long sequence = 0L; // 0，并发控制
	private long lastTimestamp = -1L;

	public IdWorker(long workerId) {
		if (workerId > this.maxWorkerId || workerId < 0) {
			throw new IllegalArgumentException(
					String.format("worker Id can't be greater than %d or less than 0", this.maxWorkerId));
		}
		this.workerId = workerId;
	}

	public synchronized long nextId() {
		long timestamp = this.currentTimeMillis();
		if (this.lastTimestamp == timestamp) { // 如果上一个timestamp与新产生的相等，则sequence加一(0-4095循环);
			// 对新的timestamp，sequence从0开始
			this.sequence = this.sequence + 1 & this.sequenceMask;
			if (this.sequence == 0) {
				timestamp = this.tilNextMillis(this.lastTimestamp);// 重新生成timestamp
			}
		} else {
			this.sequence = 0;
		}

		if (timestamp < this.lastTimestamp) {
			//log.error(String.format("clock moved backwards.Refusing to generate id for %d milliseconds",
					//(this.lastTimestamp - timestamp)));
			throw new RuntimeException(
					String.format("clock moved backwards.Refusing to generate id for %d milliseconds",
							(this.lastTimestamp - timestamp)));
		}

		this.lastTimestamp = timestamp;
		return timestamp - this.epoch << this.timestampLeftShift | this.workerId << this.workerIdShift | this.sequence;
	}

	/**
	 * 等待下一个毫秒的到来, 保证返回的毫秒数在参数lastTimestamp之后
	 */
	private long tilNextMillis(long lastTimestamp) {
		long timestamp = this.currentTimeMillis();
		while (timestamp <= lastTimestamp) {
			timestamp = this.currentTimeMillis();
		}
		return timestamp;
	}

	/**
	 * 获得系统当前毫秒数
	 */
	private long currentTimeMillis() {
		return System.currentTimeMillis();
	}
	public static void main(String[] args) {
		System.out.println(new IdWorker(0L).nextId());
	}

}
