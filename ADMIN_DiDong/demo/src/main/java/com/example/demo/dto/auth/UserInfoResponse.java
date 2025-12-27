package com.example.demo.dto.auth;

/**
 * Response chứa thông tin user (không bao gồm password)
 */
public class UserInfoResponse {
    public Long id;
    public String name;
    public String email;
    public String role;

    public UserInfoResponse() {
    }

    public UserInfoResponse(Long id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}
