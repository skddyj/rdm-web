package com.codeoffice.servlet;

public class
Servlet {

    private final String id = "servlet";
    // 模拟servlet的service方法
    public String service(Integer s){
        if(s%5==0){
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        return s+"-"+id;
    }
}
