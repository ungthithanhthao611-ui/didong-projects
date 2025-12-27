package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Long orderItemId;

    @Column(name = "discount", nullable = false)
    private Double discount;

    @Column(name = "ordered_product_price", nullable = false)
    private Double orderedProductPrice;

    @Column(name = "quantity")
    private Integer quantity;

    // Nhiều item thuộc 1 order
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    // FK product_id (chưa map Product cũng được)
    @Column(name = "product_id")
    private Long productId;

    // ===== Getter & Setter =====
    public Long getOrderItemId() {
        return orderItemId;
    }

    public void setOrderItemId(Long orderItemId) {
        this.orderItemId = orderItemId;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public Double getOrderedProductPrice() {
        return orderedProductPrice;
    }

    public void setOrderedProductPrice(Double orderedProductPrice) {
        this.orderedProductPrice = orderedProductPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
}
