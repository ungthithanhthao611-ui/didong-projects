package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // ========================================
        // CHO PHÉP TẤT CẢ ORIGINS (cho mobile app)
        // Sử dụng allowedOriginPatterns thay vì allowedOrigins khi cần allowCredentials
        // ========================================
        config.setAllowedOriginPatterns(List.of("*"));

        // Hoặc liệt kê cụ thể:
        // config.setAllowedOrigins(List.of(
        // "http://localhost:8081",
        // "http://localhost:5173",
        // "http://10.217.155.87:8081"
        // ));

        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Content-Range", "Authorization"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
