package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // ========================================
    // PUBLIC THƯ MỤC ẢNH
    // ========================================
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry
                .addResourceHandler("/images/**")
                .addResourceLocations("file:uploads/images/");
    }

    // CORS đã được cấu hình trong CorsConfig.java
    // Không cần cấu hình ở đây nữa để tránh xung đột
}
