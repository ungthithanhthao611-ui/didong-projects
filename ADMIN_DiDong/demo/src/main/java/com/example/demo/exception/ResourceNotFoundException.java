package com.example.demo.exception;

/**
 * Exception khi không tìm thấy resource (vd: user không tồn tại)
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
