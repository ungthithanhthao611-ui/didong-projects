package com.example.demo.service.impl;

import com.example.demo.dto.cart.CheckoutRequest;
import com.example.demo.entity.Order;
import com.example.demo.entity.Voucher;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.VoucherRepository;
import com.example.demo.service.OrderService;
import com.example.demo.service.VoucherService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
public class OrderServiceImpl implements OrderService {

    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final VoucherService voucherService;
    private final VoucherRepository voucherRepository;

    public OrderServiceImpl(CartRepository cartRepository, OrderRepository orderRepository,
            VoucherService voucherService, VoucherRepository voucherRepository) {
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.voucherService = voucherService;
        this.voucherRepository = voucherRepository;
    }

    @Override
    @Transactional
    public void checkout(CheckoutRequest request) {
        try {
            Long cartId = cartRepository.findCartIdByUser(request.getUserId());
            if (cartId == null)
                throw new RuntimeException("Giỏ hàng trống");

            double total = cartRepository.getCartTotal(cartId);
            double discountAmount = 0.0;
            Long voucherId = null;

            if (request.getVoucherCode() != null && !request.getVoucherCode().isEmpty()) {
                discountAmount = voucherService.calculateDiscount(request.getVoucherCode(), total);
                Voucher v = voucherRepository.findByCode(request.getVoucherCode()).orElse(null);
                if (v != null) {
                    voucherId = v.getId();
                    voucherService.useVoucher(request.getUserId(), request.getVoucherCode());
                }
            }

            double finalTotal = total - discountAmount;

            // Lấy email nếu request không có
            String email = request.getEmail();
            if (email == null || email.isEmpty()) {
                email = orderRepository.getUserEmailById(request.getUserId());
            }

            // Tạo order với đầy đủ thông tin
            Long orderId = orderRepository.createOrder(
                    request.getUserId(),
                    email,
                    finalTotal,
                    "PENDING",
                    request.getName(),
                    request.getPhone(),
                    request.getAddress(),
                    voucherId,
                    discountAmount);

            List<Map<String, Object>> cartItems = cartRepository.getCartItemsForCheckout(cartId);
            for (Map<String, Object> item : cartItems) {
                orderRepository.insertOrderItem(
                        orderId,
                        (Long) item.get("product_id"),
                        (Integer) item.get("quantity"),
                        (Double) item.get("product_price"),
                        (Double) item.get("discount"));
            }
            cartRepository.clearCartAfterCheckout(cartId);
        } catch (Exception e) {
            throw new RuntimeException("Checkout failed: " + e.getMessage(), e);
        }
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // ✅ IMPLEMENT HÀM LẤY CHI TIẾT THEO ID (QUAN TRỌNG)
    @Override
    public Order getById(Long id) {
        Order order = orderRepository.findById(id);
        if (order == null) {
            throw new RuntimeException("Không tìm thấy đơn hàng ID: " + id);
        }
        return order;
    }

    @Override
    public void updateOrderStatus(Long orderId, String newStatus) {
        orderRepository.updateStatus(orderId, newStatus);
    }

    @Override
    public List<OrderRepository.OrderItemDetail> getOrderItems(Long orderId) {
        return orderRepository.getOrderItems(orderId);
    }

    @Override
    public List<Order> getOrdersByUser(Long userId, String status) {
        return orderRepository.findByUser(userId, status);
    }

    @Override
    @Transactional
    public void cancelOrder(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId);
        if (order == null) {
            throw new RuntimeException("Đơn hàng không tồn tại (ID: " + orderId + ")");
        }

        String currentStatus = order.getOrderStatus();

        // Idempotency: Nếu đã hủy rồi thì không làm gì cả, trả về thành công
        if ("CANCELLED".equalsIgnoreCase(currentStatus)) {
            return;
        }

        // Chỉ cho hủy khi trạng thái là PENDING, CREATED, hoặc CONFIRMED
        if (!"PENDING".equalsIgnoreCase(currentStatus) &&
                !"CREATED".equalsIgnoreCase(currentStatus) &&
                !"CONFIRMED".equalsIgnoreCase(currentStatus)) {
            throw new RuntimeException("Không thể hủy đơn hàng đang ở trạng thái: " + currentStatus);
        }

        try {
            orderRepository.updateStatus(orderId, "CANCELLED");
            orderRepository.recordOrderCancel(orderId, order.getUserId(), reason);
        } catch (Exception e) {
            // Log thực tế lỗi hệ thống
            e.printStackTrace();
            throw new RuntimeException("Lỗi hệ thống khi cập nhật hủy đơn: " + e.getMessage());
        }
    }
}