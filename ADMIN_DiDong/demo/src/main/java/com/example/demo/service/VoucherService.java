package com.example.demo.service;

import com.example.demo.entity.Voucher;

import java.util.List;

public interface VoucherService {

    List<Voucher> getAllVouchers();

    void claimVoucher(Long userId, String code);

    List<Voucher> getUserVouchers(Long userId);

    Voucher getBestVoucher(Long userId, Double orderTotal);

    Double calculateDiscount(String code, Double totalAmount);

    void useVoucher(Long userId, String code);
}
