package com.example.bookroom.config; // <-- 这里就是“您的实际包名”

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 允许对所有路径进行CORS配置
                .allowedOrigins("http://localhost:5173") // **允许您的前端地址访问**
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 允许的HTTP方法
                .allowedHeaders("*") // 允许所有头
                .allowCredentials(true) // 允许发送认证信息（如cookies，HTTP认证或客户端SSL证书）
                .maxAge(3600); // 预检请求的缓存时间
    }
}
