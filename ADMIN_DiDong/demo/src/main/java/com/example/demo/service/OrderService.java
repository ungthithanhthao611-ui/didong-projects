package com.example.demo.service;

import com.example.demo.dto.cart.CheckoutRequest;
import com.example.demo.entity.Order;
import com.example.demo.repository.OrderRepository;
import java.util.List;

public interface OrderService {
    void checkout(CheckoutRequest request);

    List<Order> getAllOrders();

    // ✅ THÊM DÒNG NÀY
    Order getById(Long id);

    void updateOrderStatus(Long orderId, String newStatus);

    List<OrderRepository.OrderItemDetail> getOrderItems(Long orderId);

    List<Order> getOrdersByUser(Long userId, String status);

    void cancelOrder(Long orderId, String reason);
}