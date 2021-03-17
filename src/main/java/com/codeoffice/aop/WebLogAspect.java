package com.codeoffice.aop;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Arrays;

@Slf4j
@Aspect
public class WebLogAspect {

    // 定义切点
    @Pointcut("execution(public * com.codeoffice.controller..*.*(..))")
    public void webLog(){

    }

    @Before("webLog()")
    public void doBefore(JoinPoint joinPoint){
        ServletRequestAttributes attributes =(ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request=attributes.getRequest();

        log.info("REQUEST_TIME: {}, REQUEST_URL: {}, IP: {}, METHOD: {}, ARGS: {}", LocalDateTime.now(),request.getRequestURL().toString(),request.getRemoteAddr(),joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName(), Arrays.toString(joinPoint.getArgs()));
    }

    @AfterReturning(returning = "ret",pointcut = "webLog()")
    public void doAfterReturning(Object ret){
        log.info("RESPONSE_TIME: {}, RESPONSE: {}",LocalDateTime.now(),ret);
    }

    @Around("webLog()")
    public void around(ProceedingJoinPoint pjp){
        String name=pjp.getSignature().getName();
        System.out.println(name+"环绕执行前");
        try {
            pjp.proceed();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
        System.out.println(name+"环绕后执行");
    }
}
