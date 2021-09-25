package com.codeoffice.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.lang.reflect.Method;

@Log4j2
@Configuration
public class BrowserAutoOpenConfig implements CommandLineRunner {
    @Value("${server.port}")
    private Integer port;

    @Override
    public void run(String... args) {
        String url = " http://127.0.0.1:" + port;
        this.openBrowser(url);
    }

    private void openBrowser(String url) {
        try {
            String osName = System.getProperty("os.name");
            if (osName.startsWith("Windows")) {
                // Windows
                Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler " + url);
            } else if (osName.startsWith("Mac OS")) {
                // Mac
                Class fileMgr = Class.forName("com.apple.eio.FileManager");
                Method openURL = fileMgr.getDeclaredMethod("openURL", String.class);
                openURL.invoke(null, url);
            } else {
                // Unix or Linux
                String[] browsers = {"firefox","mozilla", "opera", "konqueror", "epiphany", "netscape"};
                String browser = null;
                for (int count = 0; count < browsers.length && browser == null; count++)
                    if (Runtime.getRuntime().exec(new String[]{"which", browsers[count]}).waitFor() == 0)
                        browser = browsers[count];
                if (browser == null)
                    throw new Exception("Could not find web browser");
                else
                    Runtime.getRuntime().exec(new String[]{browser, url});
            }
        } catch (Exception e) {
            log.error("自动打开浏览器失败，请复制网址"+url+"到浏览器地址栏手动打开...");
        }
    }
}