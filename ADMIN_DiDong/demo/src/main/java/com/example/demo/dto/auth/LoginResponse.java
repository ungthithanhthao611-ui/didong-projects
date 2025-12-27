package com.example.demo.dto.auth;

/**
 * Response cho login - trả về token + thông tin user
 */
public class LoginResponse {
    public String token;
    public UserInfoResponse user;

    public LoginResponse(String token, UserInfoResponse user) {
        this.token = token;
        this.user = user;
    }
}
