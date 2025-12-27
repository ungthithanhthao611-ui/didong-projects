package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtService;
import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.LoginResponse;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.dto.auth.UserInfoResponse;
import com.example.demo.exception.DataAlreadyExistsException;
import com.example.demo.exception.UnauthorizedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // ========================================
    // ĐĂNG KÝ
    // ========================================
    public String register(RegisterRequest request) {
        // Kiểm tra email đã tồn tại
        if (userRepository.findByEmail(request.email).isPresent()) {
            throw new DataAlreadyExistsException("Email đã tồn tại");
        }

        // Mã hóa password và lưu user
        String hashedPassword = passwordEncoder.encode(request.password);
        userRepository.save(request.name, request.email, hashedPassword, "USER");

        // Trả về JWT token
        return jwtService.generateToken(request.email, "USER");
    }

    // ========================================
    // ĐĂNG NHẬP - Trả về token + thông tin user
    // ========================================
    public LoginResponse loginWithUserInfo(LoginRequest request) {
        // Tìm user theo email
        User user = userRepository.findByEmail(request.email)
                .orElseThrow(() -> new UnauthorizedException("Sai email hoặc mật khẩu"));

        // Kiểm tra password
        if (!passwordEncoder.matches(request.password, user.getPassword())) {
            throw new UnauthorizedException("Sai email hoặc mật khẩu");
        }

        // Tạo JWT token
        String role = (user.getRole() == null || user.getRole().isBlank()) ? "USER" : user.getRole();
        String token = jwtService.generateToken(user.getEmail(), role);

        // Tạo user info response (không bao gồm password)
        UserInfoResponse userInfo = new UserInfoResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                role);

        return new LoginResponse(token, userInfo);
    }

    // ========================================
    // LẤY THÔNG TIN USER TỪ TOKEN
    // ========================================
    public UserInfoResponse getUserFromToken(String token) {
        // Validate token và lấy email
        String email = jwtService.extractEmail(token);

        if (email == null || !jwtService.isTokenValid(token)) {
            throw new UnauthorizedException("Token không hợp lệ hoặc đã hết hạn");
        }

        // Tìm user theo email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Không tìm thấy người dùng"));

        return new UserInfoResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole());
    }

    // ========================================
    // ĐĂNG NHẬP CŨ (Giữ lại để tương thích)
    // ========================================
    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email)
                .orElseThrow(() -> new UnauthorizedException("Sai email hoặc mật khẩu"));

        if (!passwordEncoder.matches(request.password, user.getPassword())) {
            throw new UnauthorizedException("Sai email hoặc mật khẩu");
        }

        String role = (user.getRole() == null || user.getRole().isBlank()) ? "USER" : user.getRole();
        return jwtService.generateToken(user.getEmail(), role);
    }
}
