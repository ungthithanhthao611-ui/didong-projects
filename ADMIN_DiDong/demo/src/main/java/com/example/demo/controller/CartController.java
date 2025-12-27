// package com.example.demo.controller;

// import com.example.demo.dto.cart.AddToCartRequest;
// import com.example.demo.entity.Cart; // Đảm bảo import Entity
// import com.example.demo.repository.CartRepository; // Dùng repo trực tiếp cho Admin (đơn giản hóa)
// import com.example.demo.service.CartService;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/carts") // Đổi endpoint thành số nhiều cho chuẩn REST
// @CrossOrigin(origins = "http://localhost:5173", exposedHeaders = "Content-Range")
// public class CartController {

//     private final CartService cartService;
//     private final CartRepository cartRepository; // Inject thêm Repository

//     public CartController(CartService cartService, CartRepository cartRepository) {
//         this.cartService = cartService;
//         this.cartRepository = cartRepository;
//     }

//     // 1. ADMIN: Lấy danh sách tất cả giỏ hàng
//     @GetMapping
//     public ResponseEntity<List<Cart>> getAllCarts() {
//         List<Cart> carts = cartRepository.findAll(); // Cần thêm hàm findAll bên Repo
        
//         HttpHeaders headers = new HttpHeaders();
//         headers.add("Content-Range", "carts 0-" + carts.size() + "/" + carts.size());
//         headers.add("Access-Control-Expose-Headers", "Content-Range");

//         return ResponseEntity.ok().headers(headers).body(carts);
//     }

//     // 2. ADMIN: Lấy chi tiết 1 giỏ hàng (theo Cart ID)
//     @GetMapping("/{id}")
//     public ResponseEntity<Map<String, Object>> getCartById(@PathVariable Long id) {
//         // Tái sử dụng hàm lấy chi tiết, nhưng cần sửa service để nhận cartId thay vì userId
//         // Hoặc viết hàm mới. Ở đây mình gọi service lấy theo Cart ID.
//         Map<String, Object> cartDetail = cartService.getCartById(id); 
//         return ResponseEntity.ok(cartDetail);
//     }

//     // --- CÁC API CŨ CHO CLIENT (USER) ---
//     // Lưu ý: Endpoint cũ là /api/cart (số ít), endpoint mới là /api/carts (số nhiều)
//     // Bạn nên thống nhất hoặc giữ cả 2 nếu client app đang dùng cái cũ.
    
//     @PostMapping("/add")
//     public void addToCart(@RequestBody AddToCartRequest request) {
//         cartService.addToCart(request);
//     }

//     @GetMapping("/user/{userId}") // Đổi đường dẫn để tránh trùng
//     public Map<String, Object> getCartByUser(@PathVariable Long userId) {
//         return cartService.getCartByUser(userId);
//     }

//     @DeleteMapping("/{userId}/remove/{productId}")
//     public ResponseEntity<?> removeCartItem(@PathVariable Long userId, @PathVariable Long productId) {
//         cartService.removeItem(userId, productId);
//         return ResponseEntity.ok("Đã xóa sản phẩm thành công");
//     }
// }


package com.example.demo.controller;

import com.example.demo.dto.cart.AddToCartRequest;
import com.example.demo.entity.Cart;
import com.example.demo.repository.CartRepository;
import com.example.demo.service.CartService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carts")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8081"}, exposedHeaders = "Content-Range")
public class CartController {

    private final CartService cartService;
    private final CartRepository cartRepository;

    public CartController(CartService cartService, CartRepository cartRepository) {
        this.cartService = cartService;
        this.cartRepository = cartRepository;
    }

    // 1. ADMIN: Lấy danh sách
    @GetMapping
    public ResponseEntity<List<Cart>> getAllCarts() {
        List<Cart> carts = cartRepository.findAll();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Range", "carts 0-" + carts.size() + "/" + carts.size());
        headers.add("Access-Control-Expose-Headers", "Content-Range");
        return ResponseEntity.ok().headers(headers).body(carts);
    }

    // 2. ADMIN: Lấy chi tiết
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getCartById(@PathVariable Long id) {
        Map<String, Object> cartDetail = cartService.getCartById(id); 
        return ResponseEntity.ok(cartDetail);
    }

    // 🔥 FIX LỖI 500: Chuyển void thành ResponseEntity để Client nhận được phản hồi
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest request) {
        try {
            if (request.getUserId() == null || request.getProductId() == null) {
                return ResponseEntity.badRequest().body("Thiếu thông tin User ID hoặc Product ID");
            }
            cartService.addToCart(request);
            return ResponseEntity.ok().body(Map.of("message", "Đã thêm vào giỏ hàng thành công"));
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra Console Java để bạn xem
            return ResponseEntity.status(500).body("Lỗi Backend: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public Map<String, Object> getCartByUser(@PathVariable Long userId) {
        return cartService.getCartByUser(userId);
    }

    @DeleteMapping("/{userId}/remove/{productId}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long userId, @PathVariable Long productId) {
        cartService.removeItem(userId, productId);
        return ResponseEntity.ok("Đã xóa sản phẩm thành công");
    }
}