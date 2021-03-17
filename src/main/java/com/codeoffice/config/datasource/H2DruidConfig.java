//
//package com.codeoffice.config.datasource;
//
//import com.alibaba.druid.spring.boot.autoconfigure.DruidDataSourceBuilder;
//import org.apache.ibatis.session.SqlSessionFactory;
//import org.mybatis.spring.SqlSessionFactoryBean;
//import org.mybatis.spring.SqlSessionTemplate;
//import org.mybatis.spring.annotation.MapperScan;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.boot.context.properties.ConfigurationProperties;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Primary;
//import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
//import org.springframework.jdbc.datasource.DataSourceTransactionManager;
//
//import javax.sql.DataSource;
//
//@MapperScan(basePackages = "com.codeoffice.mapper", sqlSessionTemplateRef = "h2SessionTemplate" )
//@Configuration
//public class H2DruidConfig {
//
//    // DataSource 数据源 传统JDBC连接需要每次都要创建断开连接，
//    @Primary
//    @Bean(name="h2DataSource")
//    @ConfigurationProperties("spring.datasource")
//    public DataSource h2DataSource(){
//        return DruidDataSourceBuilder.create().build();
//    }
//
//    // TransactionManager 事务管理器
//    @Primary
//    @Bean(name = "h2TransactionManager")
//    public DataSourceTransactionManager h2TransactionManager(@Qualifier("h2DataSource") DataSource dataSource) {
//        return new DataSourceTransactionManager(dataSource);
//    }
//
//
//    // SqlSession 描述了一种会话,数据库连接客户端和数据库Server之间的一种会话，并维护了客户端和数据库Server的一些状态信息。
//    // SqlSession是接口，接口是一种高层次的抽象，你可以认为接口是声明了一种能力。。若是实现了该接口，就拥有了该接口的能力（方法）和特征（属性）。
//    // 官方的描述是：“你可以通过它执行命令、获取mapper和管理事务”。那也就是说，只要我实现了SqlSession接口，那我就有了同样的能力了。至于它是如何实现发送sql语句，管理事务和获取mapper的
//
//    // SqlSessionManager、DefaultSqlSession、SqlSessionTemplate都实现了Sqlsession
//
//
//    // SqlSessionFactory 生产SqlSession的工厂 sqlSession可以被关闭，代表SqlSession是需要反复被创建的，如果反复创建和销毁资源浪费很高，所以基于数据库连接池实现的，档sqlsession使用完关闭时，不直接销毁
//    // 而是将连接对象放入连接池中，提高资源利用率，减少连接时间
//    // SqlSessionFactoryBean 是生产 SqlSessionFactory的工厂
//    // SqlSessionFactory 打开SqlSession会话的工厂，是一个接口，可以根据需求自己实现，它的默认实现类DefaultSqlSessionFactory使用了数据库连接池技术。
//    // SqlSession是客户端和数据库服务端之间的会话信息，里面有许多操作数据库的方法。
//    // SqlSessionTemplate是SqlSession的一个具体实现。
//
//
//    // SqlSessionFactoryBean 获取SqlSessionFactory实例 实现了FactoryBean，可以自定义获取实例的方法
//    // 典型应用创建aop的代理对象 例如 spring中 ProxyFactoryBean
//
//
//    // BeanFactory是Spring容器的顶层接口，FactoryBean更类似于用户自定义的工厂接口。
//    // BeanFactory是一个接口，它是Spring中工厂的顶层规范，是SpringIoc容器的核心接口，它定义了getBean()、containsBean()等管理Bean的通用方法。Spring的容器都是它的具体实现如：DefaultListableBeanFactory、XmlBeanFactory、ApplicationContext
//
//    @Primary
//    @Bean(name = "h2SqlSessionFactory")
//    public SqlSessionFactory h2SqlSessionFactory(@Qualifier("h2DataSource") DataSource dataSource) throws Exception {
//        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
//        bean.setDataSource(dataSource);
//        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mapper/*.xml"));
//        bean.setConfigLocation (new PathMatchingResourcePatternResolver ().getResource ("classpath:mybatis/mybatis-config.xml"));
//        return bean.getObject();
//    }
//
//    // SqlSession 数据库crud以及事务操作的接口 线程不安全，用于request和method范围，
//    // SessionTemplate SqlSession的一个具体实现，是sqlSession的动态代理，sqlSession的装饰器模式，增强sqlSession的生命周期管理
//    // localSession每个线程内部都持有一个sqlSession 线程之间互不干扰
//    // 每次invoke之前判断 线程内部存在sqlSession直接调用不新建，
//    @Primary
//    @Bean(name="h2SessionTemplate")
//    public SqlSessionTemplate h2SqlSessionTemplate(@Qualifier("h2SqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception {
//        return new SqlSessionTemplate(sqlSessionFactory);
//    }
//
//
//
//
//
///*
//
//     SqlSessionManager源码
//
//public class SqlSessionManager implements SqlSessionFactory, SqlSession {
//    private final SqlSessionFactory sqlSessionFactory;
//    // SqlSession动态代理，增强SqlSession生命周期管理
//    private final SqlSession sqlSessionProxy;
//
//    // 线程局部变量localSqlSession，每个线程内部都持有一个sqlSession副本，互不干扰
//    private final ThreadLocal<SqlSession> localSqlSession = new ThreadLocal<SqlSession>();
//
//    private SqlSessionManager(SqlSessionFactory sqlSessionFactory) {
//        this.sqlSessionFactory = sqlSessionFactory;
//        // 创建代理对象SqlSessionProxy
//        this.sqlSessionProxy = (SqlSession) Proxy.newProxyInstance(
//                SqlSessionFactory.class.getClassLoader(),
//                new Class[]{SqlSession.class},
//                new SqlSessionInterceptor());
//    }
//
//    private class SqlSessionInterceptor implements InvocationHandler {
//
//        @Override
//        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
//            final SqlSession sqlSession = SqlSessionManager.this.localSqlSession.get();
//            if (sqlSession != null) {
//                // 如果线程内已存在sqlSession，直接共用，方法调用后由程序员手动关闭
//                try {
//                    return method.invoke(sqlSession, args);
//                } catch (Throwable t) {
//                    throw ExceptionUtil.unwrapThrowable(t);
//                }
//            } else {
//                // 1. 创建方法级sqlSession
//                final SqlSession autoSqlSession = openSession();
//                try {
//                    // 2. 调用SqlSession方法执行sql
//                    final Object result = method.invoke(autoSqlSession, args);
//                    // 3.1 执行成功，提交事务
//                    autoSqlSession.commit();
//                    return result;
//                } catch (Throwable t) {
//                    // 3.2 执行异常，回滚事务
//                    autoSqlSession.rollback();
//                    throw ExceptionUtil.unwrapThrowable(t);
//                } finally {
//                    // 4. 关闭SqlSession
//                    autoSqlSession.close();
//                }
//            }
//        }
//    }
//}
//
//*//*
//
//
//*/
///*
//
// SqlSessionTemplate 装饰器模式 spring管理线程安全
//
// // 1. Thread safe, Spring managed, {@code SqlSession} that works with Spring
// // transaction management to ensure that that the actual SqlSession used is the
// // one associated with the current Spring transaction.
// // spring管理，线程安全，确保SqlSession是当前spring事务的sqlSession
// // 2. SqlSession生命周期管理，包括commit, rollback, close
// // 3. 单例，所有DAO可以共用一个
//
//    public class SqlSessionTemplate implements SqlSession, DisposableBean {
//
//        private final SqlSessionFactory sqlSessionFactory;
//
//        private final ExecutorType executorType;
//
//        private final SqlSession sqlSessionProxy;
//
//        public SqlSessionTemplate(SqlSessionFactory sqlSessionFactory, ExecutorType executorType,
//                                  PersistenceExceptionTranslator exceptionTranslator) {
//
//            notNull(sqlSessionFactory, "Property 'sqlSessionFactory' is required");
//            notNull(executorType, "Property 'executorType' is required");
//
//            this.sqlSessionFactory = sqlSessionFactory;
//            this.executorType = executorType;
//            this.exceptionTranslator = exceptionTranslator;
//            this.sqlSessionProxy = (SqlSession) newProxyInstance(
//                    SqlSessionFactory.class.getClassLoader(),
//                    new Class[] { SqlSession.class },
//                    new SqlSessionInterceptor());
//        }
//
//        private class SqlSessionInterceptor implements InvocationHandler {
//            @Override
//            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
//                SqlSession sqlSession = getSqlSession(
//                        SqlSessionTemplate.this.sqlSessionFactory,
//                        SqlSessionTemplate.this.executorType,
//                        SqlSessionTemplate.this.exceptionTranslator);
//                try {
//                    Object result = method.invoke(sqlSession, args);
//                    // 非事务的sqlSession，执行完立即commit
//                    if (!isSqlSessionTransactional(sqlSession, SqlSessionTemplate.this.sqlSessionFactory)) {
//                        sqlSession.commit(true);
//                    }
//                    return result;
//                } catch (Throwable t) {
//                    Throwable unwrapped = unwrapThrowable(t);
//                    if (SqlSessionTemplate.this.exceptionTranslator != null && unwrapped instanceof PersistenceException) {
//                        // release the connection to avoid a deadlock if the translator is no loaded. See issue #22
//                        closeSqlSession(sqlSession, SqlSessionTemplate.this.sqlSessionFactory);
//                        sqlSession = null;
//                        Throwable translated = SqlSessionTemplate.this.exceptionTranslator.translateExceptionIfPossible((PersistenceException) unwrapped);
//                        if (translated != null) {
//                            unwrapped = translated;
//                        }
//                    }
//                    throw unwrapped;
//                } finally {
//                    if (sqlSession != null) {
//                        closeSqlSession(sqlSession, SqlSessionTemplate.this.sqlSessionFactory);
//                    }
//                }
//            }
//        }
//    }
//
//
//     // 1. 非事务SqlSession，close
//     // 2. 事务sqlsession, 更新引用计数器，当计数器为0，即事务结束时，spring调用close callback
//
//    public static void closeSqlSession(SqlSession session, SqlSessionFactory sessionFactory) {
//    ......
//    }
//     */
//
//}
//
