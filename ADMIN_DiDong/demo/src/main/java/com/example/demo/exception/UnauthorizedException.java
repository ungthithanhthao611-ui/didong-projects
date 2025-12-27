package com.example.demo.exception;

/**
 * Exception khi đăng nhập thất bại (sai email/password)
 */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
