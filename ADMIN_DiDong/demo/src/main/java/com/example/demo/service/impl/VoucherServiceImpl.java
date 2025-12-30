package com.example.demo.service.impl;

import com.example.demo.entity.User;
import com.example.demo.entity.UserVoucher;
import com.example.demo.entity.Voucher;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserVoucherRepository;
import com.example.demo.repository.VoucherRepository;
import com.example.demo.service.VoucherService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;
    private final UserVoucherRepository userVoucherRepository;
    private final UserRepository userRepository;

    public VoucherServiceImpl(VoucherRepository voucherRepository,
                             UserVoucherRepository userVoucherRepository,
                             UserRepository userRepository) {
        this.voucherRepository = voucherRepository;
        this.userVoucherRepository = userVoucherRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll()
                .stream()
                .filter(v -> Boolean.TRUE.equals(v.getIsActive()))
                .filter(v -> !v.getExpiryDate().isBefore(LocalDate.now()))
                .collect(Collectors.toList());
    }

    @Override
    public void claimVoucher(Long userId, String code) {
        Voucher voucher = voucherRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));

        if (!Boolean.TRUE.equals(voucher.getIsActive()) || voucher.getExpiryDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Voucher đã hết hạn hoặc bị tạm dừng");
        }

        if (voucher.getUsageLimit() <= 0) {
            throw new RuntimeException("Voucher này đã hết lượt sử dụng");
        }

        // Kiểm tra xem user đã sở hữu voucher này chưa
        boolean existed = userVoucherRepository
                .findByUserIdAndVoucherId(userId, voucher.getId())
                .isPresent();

        if (existed) {
            throw new RuntimeException("Bạn đã nhận voucher này rồi");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        UserVoucher uv = new UserVoucher();
        uv.setUser(user);
        uv.setVoucher(voucher);
        uv.setIsUsed(false);
        userVoucherRepository.save(uv);
    }

    @Override
    public List<Voucher> getUserVouchers(Long userId) {
        return userVoucherRepository.findByUserIdAndIsUsedFalse(userId)
                .stream()
                .map(UserVoucher::getVoucher)
                .filter(v -> Boolean.TRUE.equals(v.getIsActive()))
                .filter(v -> !v.getExpiryDate().isBefore(LocalDate.now()))
                .collect(Collectors.toList());
    }

    @Override
    public Voucher getBestVoucher(Long userId, Double orderTotal) {
        return getUserVouchers(userId).stream()
                .filter(v -> orderTotal >= v.getMinOrderAmount())
                .max(Comparator.comparingDouble(Voucher::getDiscount))
                .orElse(null);
    }

    @Override
    public Double calculateDiscount(String code, Double totalAmount) {
        Voucher v = voucherRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Voucher không hợp lệ"));
        return (v.getIsActive() && totalAmount >= v.getMinOrderAmount()) ? v.getDiscount() : 0.0;
    }

    @Override
    public void useVoucher(Long userId, String code) {
        Voucher voucher = voucherRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Voucher không tồn tại"));
        UserVoucher uv = userVoucherRepository.findByUserIdAndVoucherId(userId, voucher.getId())
                .orElseThrow(() -> new RuntimeException("Bạn chưa sở hữu voucher này"));

        if (uv.getIsUsed()) throw new RuntimeException("Voucher đã được sử dụng");

        uv.setIsUsed(true);
        uv.setUsedAt(LocalDateTime.now());
        userVoucherRepository.save(uv);

        voucher.setUsageLimit(voucher.getUsageLimit() - 1);
        voucherRepository.save(voucher);
    }
}