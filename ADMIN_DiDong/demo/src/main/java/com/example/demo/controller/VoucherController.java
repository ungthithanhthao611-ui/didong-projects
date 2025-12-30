package com.example.demo.controller;

import com.example.demo.entity.Voucher;
import com.example.demo.repository.VoucherRepository;
import com.example.demo.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vouchers")
@CrossOrigin("*")
public class VoucherController {

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private VoucherRepository voucherRepository;

    // ======================================================
    // 1️⃣ GET ALL VOUCHERS (ProductDetail)
    // ======================================================
    @GetMapping
    public ResponseEntity<List<Voucher>> getAllVouchers() {

        List<Voucher> vouchers = voucherRepository.findAll()
                .stream()
                .filter(v -> Boolean.TRUE.equals(v.getIsActive()))
                .filter(v -> !v.getExpiryDate().isBefore(LocalDate.now()))
                .toList();

        return ResponseEntity.ok(vouchers);
    }

    // ======================================================
    // 2️⃣ CLAIM VOUCHER
    // ======================================================
    @PostMapping("/claim")
    public ResponseEntity<?> claimVoucher(@RequestBody Map<String, Object> body) {

        System.out.println("CLAIM PAYLOAD = " + body);

        try {
            if (!body.containsKey("userId") || !body.containsKey("voucherCode")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Thiếu userId hoặc voucherCode"));
            }

            Long userId = Long.valueOf(body.get("userId").toString());
            String voucherCode = body.get("voucherCode").toString();

            voucherService.claimVoucher(userId, voucherCode);

            return ResponseEntity.ok(
                    Map.of("message", "Nhận voucher thành công")
            );

        } catch (Exception e) {
            // LOG LÝ DO THẬT SỰ
            System.out.println("CLAIM ERROR = " + e.getMessage());

            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ======================================================
    // 3️⃣ GET USER VOUCHERS (Checkout)
    // ======================================================
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Voucher>> getUserVouchers(@PathVariable Long userId) {
        return ResponseEntity.ok(
                voucherService.getUserVouchers(userId)
        );
    }

    // ======================================================
    // 4️⃣ CALCULATE DISCOUNT (Checkout apply voucher)
    // ======================================================
    @PostMapping("/calculate-discount")
    public ResponseEntity<?> calculateDiscount(@RequestBody Map<String, Object> body) {

        try {
            if (!body.containsKey("code") || !body.containsKey("totalAmount")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Thiếu code hoặc totalAmount"));
            }

            String code = body.get("code").toString();
            Double totalAmount = Double.valueOf(body.get("totalAmount").toString());

            Double discount = voucherService.calculateDiscount(code, totalAmount);

            return ResponseEntity.ok(
                    Map.of("discount", discount)
            );

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ======================================================
    // 5️⃣ GET BEST VOUCHER (Optional – gợi ý)
    // ======================================================
    @GetMapping("/best")
    public ResponseEntity<?> getBestVoucher(
            @RequestParam Long userId,
            @RequestParam Double orderTotal
    ) {
        return ResponseEntity.ok(
                voucherService.getBestVoucher(userId, orderTotal)
        );
    }
}
