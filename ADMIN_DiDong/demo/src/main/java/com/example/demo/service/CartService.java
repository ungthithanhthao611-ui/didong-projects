package com.example.demo.service;

import com.example.demo.dto.cart.AddToCartRequest;
import java.util.Map;

public interface CartService {
    // 1. Thêm vào giỏ
    void addToCart(AddToCartRequest request);

    // 2. Lấy giỏ hàng theo User ID (Cho Client)
    Map<String, Object> getCartByUser(Long userId);
    
    // 3. Xóa sản phẩm khỏi giỏ
    void removeItem(Long userId, Long productId);

    // 🔥 4. [MỚI] Lấy giỏ hàng theo Cart ID (Cho Admin)
    Map<String, Object> getCartById(Long cartId);
}