package com.example.demo.exception;

/**
 * Exception khi dữ liệu đã tồn tại (vd: email trùng)
 */
public class DataAlreadyExistsException extends RuntimeException {
    public DataAlreadyExistsException(String message) {
        super(message);
    }
}
