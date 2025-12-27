package com.example.demo.controller;

import com.example.demo.dto.auth.AuthResponse;
import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.LoginResponse;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.dto.auth.UserInfoResponse;
import com.example.demo.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Đăng ký tài khoản mới
     */
    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return new AuthResponse(authService.register(request));
    }

    /**
     * Đăng nhập - trả về token + thông tin user
     */
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.loginWithUserInfo(request);
    }

    /**
     * Lấy thông tin user từ token (header Authorization: Bearer xxx)
     */
    @GetMapping("/me")
    public UserInfoResponse getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        // Lấy token từ header "Bearer xxx"
        String token = authHeader.replace("Bearer ", "");
        return authService.getUserFromToken(token);
    }
}
