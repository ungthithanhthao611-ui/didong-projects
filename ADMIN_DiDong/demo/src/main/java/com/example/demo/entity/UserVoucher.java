package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_vouchers",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "voucher_id"}))
public class UserVoucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "voucher_id", nullable = false)
    private Voucher voucher;

    private Boolean isUsed = false;
    private LocalDateTime savedAt = LocalDateTime.now();
    private LocalDateTime usedAt;

    // ===== GETTER SETTER =====
    public Long getId() { return id; }
    public User getUser() { return user; }
    public Voucher getVoucher() { return voucher; }
    public Boolean getIsUsed() { return isUsed; }
    public LocalDateTime getSavedAt() { return savedAt; }
    public LocalDateTime getUsedAt() { return usedAt; }

    public void setUser(User user) { this.user = user; }
    public void setVoucher(Voucher voucher) { this.voucher = voucher; }
    public void setIsUsed(Boolean used) { isUsed = used; }
    public void setUsedAt(LocalDateTime usedAt) { this.usedAt = usedAt; }
}
