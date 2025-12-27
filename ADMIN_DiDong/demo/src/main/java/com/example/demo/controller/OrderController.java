package com.example.demo.controller;

import com.example.demo.dto.cart.CheckoutRequest;
import com.example.demo.entity.Order;
import com.example.demo.repository.OrderRepository;
import com.example.demo.service.OrderService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.cart.CancelOrderRequest;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:8081" }, exposedHeaders = "Content-Range")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 1. CHECKOUT
    @PostMapping("/checkout")
    public ResponseEntity<String> checkout(@RequestBody CheckoutRequest request) {
        orderService.checkout(request);
        return ResponseEntity.ok("ORDER_SUCCESS");
    }

    // 2. ADMIN: Lấy tất cả đơn hàng
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Range", "orders 0-" + orders.size() + "/" + orders.size());
        headers.add("Access-Control-Expose-Headers", "Content-Range");
        return ResponseEntity.ok().headers(headers).body(orders);
    }

    // 🔥🔥 3. THÊM API NÀY: Lấy chi tiết 1 đơn hàng (Để trang Edit hoạt động)
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getById(id);
    }

    // 4. ADMIN: Cập nhật trạng thái
    @PutMapping("/{id}") // React Admin gọi PUT /{id} để update
    public Order updateOrder(@PathVariable Long id, @RequestBody Order order) {
        // React Admin gửi cả cục Order về, ta chỉ cần lấy status để update
        orderService.updateOrderStatus(id, order.getOrderStatus());
        return order; // Trả về order đã update
    }

    // API phụ cho nút riêng nếu cần (nhưng React Admin dùng PUT /{id} ở trên)
    @PutMapping("/{id}/status")
    public void updateStatus(@PathVariable Long id, @RequestParam String status) {
        orderService.updateOrderStatus(id, status);
    }

    // 5. ADMIN & CLIENT: Lấy chi tiết sản phẩm
    @GetMapping("/{id}/items")
    public List<OrderRepository.OrderItemDetail> getOrderItems(@PathVariable Long id) {
        return orderService.getOrderItems(id);
    }

    // 6. CLIENT: Lấy đơn hàng theo User
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId, @RequestParam(required = false) String status) {
        return orderService.getOrdersByUser(userId, status);
    }

    // 7. CLIENT: Hủy đơn hàng
    @PostMapping("/{id}/cancel")
    public ResponseEntity<String> cancelOrder(@PathVariable Long id, @RequestBody CancelOrderRequest request) {
        orderService.cancelOrder(id, request.getReason());
        return ResponseEntity.ok("ORDER_CANCELLED");
    }
}