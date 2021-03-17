package com.codeoffice.servlet;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


// 自定义servlet
@WebServlet(name = "customServlet",urlPatterns = "/servlet/customServlet")
public class CustomServlet extends HttpServlet {

    // 有一个问题我们应当注意：就是init()方法（Servlet的两个生命周期函数之一，另一个是destroy()）和service()方法的区别，
    // 当我们改变源程序而重新生成一个新的.class文件的时候，此时如果再次执行该Servlet，会发现执行的结果跟没做更改的时候一样，
    // 原因就是因为相同的Servlet的init只执行一次，所以当我们在调试Servlet的时候要不断改变文件名和类名，或者重新启动服务（Tomcat或者JWS等）。
    // 就是说，init()方法仅在服务器装载Servlet时才由服务器执行一次，而每次客户向服务器发请求时，服务器就会调用Service()方法。

    // 不管是get方式还是post方式的请求，如果Servlet类中有 service方法，则优先调用Service方法。
    // doGet和doPost是HttpServlet中的方法，service是GenericServlet中的方法
    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        System.out.println(req.getHeader("token"));
        resp.getWriter().print("customServlet");
        resp.getWriter().flush();
        resp.getWriter().close();
    }


    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        this.doGet(req, resp);
    }


    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        System.out.println("service方法");
        super.service(req, resp);
    }

}
