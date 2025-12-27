package com.example.demo.dto.auth;

public class AuthResponse {
    public String token;
    public String tokenType = "Bearer";

    public AuthResponse(String token) {
        this.token = token;
    }
}
