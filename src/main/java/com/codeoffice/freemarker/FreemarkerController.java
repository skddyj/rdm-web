package com.codeoffice.freemarker;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
class FreemarkerController {

    @GetMapping("/index")
    public String index(Model model) {
        model.addAttribute("name", "hello alex");
        // 默认访问templates下的文件，访问html下的需要加redirect
        return "index";
    }
    // 一般来说 resources/static 或者 resources/public 文件夹可以用来提供 js , css ,图片等文件访问。
    // html、ftl等页面需要放到templates下，html或ftl只能用一种后缀，否则找不到另一种，用suffix: .ftl
//    @GetMapping("/index2")
//    public String index2(Model model) {
//        model.addAttribute("name", "hello alex");
//        return "index2";
//    }
}