package com.codeoffice.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StopWatch;

import javax.servlet.*;
import java.io.IOException;



/**
 * @description : 请求耗时过滤器
 * @author: dongyanjun
 * @date: 2020/9/1
 */

@Slf4j
public class TimeCalculateFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        StopWatch stopWatch=new StopWatch();
        stopWatch.start();
        filterChain.doFilter(servletRequest,servletResponse);
        stopWatch.stop();
        log.info("耗时：{}毫秒",stopWatch.getTotalTimeMillis());
    }

    @Override
    public void destroy() {
        System.out.println("time filter destroy");
    }
}
