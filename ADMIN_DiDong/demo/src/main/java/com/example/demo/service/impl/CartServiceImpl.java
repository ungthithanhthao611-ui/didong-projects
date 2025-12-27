package com.example.demo.service.impl;

import com.example.demo.dto.cart.AddToCartRequest;
import com.example.demo.entity.Product;
import com.example.demo.repository.CartRepository;
import com.example.demo.service.CartService;
import com.example.demo.service.ProductService;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final ProductService productService;

    public CartServiceImpl(CartRepository cartRepository, ProductService productService) {
        this.cartRepository = cartRepository;
        this.productService = productService;
    }

    @Override
    public void addToCart(AddToCartRequest request) {
        try {
            Long cartId = cartRepository.findCartIdByUser(request.getUserId());
            if (cartId == null) {
                cartId = cartRepository.createCart(request.getUserId());
            }
            
            Integer currentQty = cartRepository.findCartItemQty(cartId, request.getProductId());

            if (currentQty == null) {
                // Lấy giá từ sản phẩm để đảm bảo chính xác
                Product product = productService.getById(request.getProductId());
                if (product == null) {
                    throw new RuntimeException("Sản phẩm không tồn tại");
                }
                double price = product.getPrice();
                double disc = request.getDiscount() != null ? request.getDiscount() : 0.0;

                cartRepository.insertCartItem(
                    cartId, request.getProductId(), request.getQuantity(), price, disc
                );
            } else {
                cartRepository.updateCartItem(cartId, request.getProductId(), currentQty + request.getQuantity());
            }
            cartRepository.updateTotalPrice(cartId);
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra Console để debug
            throw new RuntimeException("Lỗi Backend: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> getCartByUser(Long userId) {
        try { return cartRepository.getCartByUser(userId); }
        catch (Exception e) { throw new RuntimeException(e); }
    }

    @Override
    public void removeItem(Long userId, Long productId) {
        try {
            Long cartId = cartRepository.findCartIdByUser(userId);
            if (cartId == null) {
                throw new RuntimeException("Người dùng không có giỏ hàng");
            }
            // Check if item exists
            Integer qty = cartRepository.findCartItemQty(cartId, productId);
            if (qty == null) {
                throw new RuntimeException("Sản phẩm không có trong giỏ hàng");
            }
            cartRepository.deleteCartItem(cartId, productId);
            cartRepository.updateTotalPrice(cartId);
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra Console để debug
            throw new RuntimeException("Lỗi Backend: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> getCartById(Long cartId) {
        try { return cartRepository.getCartDetailById(cartId); }
        catch (Exception e) { throw new RuntimeException(e); }
    }
}