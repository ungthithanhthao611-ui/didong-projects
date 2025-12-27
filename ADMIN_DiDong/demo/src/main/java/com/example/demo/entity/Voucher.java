package com.example.demo.entity;
import java.time.LocalDate;

public class Voucher {
    private Long id;
    private String code;
    private Double discount;
    private Double minOrderAmount;
    private LocalDate expiryDate;
    private Integer usageLimit;
    private Boolean isActive;

    // Constructor, Getter, Setter
    public Voucher() {}
    
    // ... Bạn tự generate Getter/Setter nhé (Alt+Insert trong IntelliJ) ...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public Double getDiscount() { return discount; }
    public void setDiscount(Double discount) { this.discount = discount; }
    public Double getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(Double minOrderAmount) { this.minOrderAmount = minOrderAmount; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }
    public Boolean getActive() { return isActive; }
    public void setActive(Boolean active) { isActive = active; }
}