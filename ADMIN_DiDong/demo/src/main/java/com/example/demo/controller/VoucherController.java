package com.example.demo.controller;

import com.example.demo.entity.Voucher;
import com.example.demo.repository.VoucherRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vouchers")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8081"}, exposedHeaders = "Content-Range")
public class VoucherController {

    private final VoucherRepository voucherRepository;

    public VoucherController(VoucherRepository voucherRepository) {
        this.voucherRepository = voucherRepository;
    }

    // ✅ Admin: Lấy danh sách (Có Header Content-Range)
    @GetMapping
    public ResponseEntity<List<Voucher>> getAll() {
        List<Voucher> list = voucherRepository.findAll();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Range", "vouchers 0-" + list.size() + "/" + list.size());
        headers.add("Access-Control-Expose-Headers", "Content-Range");
        return ResponseEntity.ok().headers(headers).body(list);
    }

    // ✅ Admin: Lấy chi tiết 1 voucher (Cho trang Edit)
    @GetMapping("/{id}")
    public Voucher getById(@PathVariable Long id) {
        return voucherRepository.findById(id);
    }

    // ✅ Admin: Tạo mới (Trả về Object có ID để React Admin biết thành công)
    @PostMapping
    public ResponseEntity<Voucher> create(@RequestBody Voucher voucher) {
        Voucher savedVoucher = voucherRepository.save(voucher);
        return ResponseEntity.ok(savedVoucher);
    }

    // ✅ Admin: Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<Voucher> update(@PathVariable Long id, @RequestBody Voucher voucher) {
        Voucher updatedVoucher = voucherRepository.update(id, voucher);
        return ResponseEntity.ok(updatedVoucher);
    }

    // Admin: Xóa
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        voucherRepository.delete(id);
    }

    // User: Kiểm tra mã
    @GetMapping("/check")
    public Voucher checkVoucher(@RequestParam String code, @RequestParam double total) {
        Voucher v = voucherRepository.findByCode(code.toUpperCase());
        if (v == null) throw new RuntimeException("Mã giảm giá không tồn tại hoặc đã hết hạn!");
        if (total < v.getMinOrderAmount()) throw new RuntimeException("Đơn hàng tối thiểu " + v.getMinOrderAmount() + "đ mới được dùng!");
        return v;
    }

    // Public: Lấy mã còn hạn
    @GetMapping("/public")
    public List<Voucher> getPublicVouchers() {
        return voucherRepository.findActiveVouchers();
    }
}