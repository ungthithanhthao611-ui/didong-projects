package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_id")
    private Long cartItemId;

    @Column(name = "discount", nullable = false)
    private Double discount;

    @Column(name = "product_price", nullable = false)
    private Double productPrice;

    @Column(name = "quantity")
    private Integer quantity;

    // Nhiều CartItem thuộc 1 Cart
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    // FK product_id (không map Product cũng được)
    @Column(name = "product_id")
    private Long productId;

    // ===== Getter & Setter =====
    public Long getCartItemId() {
        return cartItemId;
    }

    public void setCartItemId(Long cartItemId) {
        this.cartItemId = cartItemId;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public Double getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(Double productPrice) {
        this.productPrice = productPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    // 🔥 THÊM HÀM NÀY LUÔN CHO CHẮC
    public Long getId() {
        return cartItemId;
    }
}
