package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "vouchers")
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    // DB: discount
    @Column(name = "discount")
    private Double discount;

    // DB: min_order_amount
    @Column(name = "min_order_amount")
    private Double minOrderAmount;

    // DB: usage_limit
    @Column(name = "usage_limit")
    private Integer usageLimit;

    // DB: expiry_date
    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    // DB: is_active
    @Column(name = "is_active")
    private Boolean isActive;

    // ===== GETTER SETTER =====
    public Long getId() { return id; }
    public String getCode() { return code; }
    public Double getDiscount() { return discount; }
    public Double getMinOrderAmount() { return minOrderAmount; }
    public Integer getUsageLimit() { return usageLimit; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public Boolean getIsActive() { return isActive; }

    public void setId(Long id) { this.id = id; }
    public void setCode(String code) { this.code = code; }
    public void setDiscount(Double discount) { this.discount = discount; }
    public void setMinOrderAmount(Double minOrderAmount) { this.minOrderAmount = minOrderAmount; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public void setIsActive(Boolean active) { isActive = active; }
}
