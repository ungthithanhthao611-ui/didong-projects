// package com.example.demo.controller;

// import com.example.demo.dto.MomoResponse;
// import com.example.demo.service.MomoService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.Map;

// @RestController
// @RequestMapping("/api/payment")
// @RequiredArgsConstructor
// public class PaymentController {

//     private final MomoService momoService;

//     @PostMapping("/momo")
//     public ResponseEntity<?> createMomoPayment(
//             @RequestParam long amount,
//             @RequestParam String orderId) {
//         try {
//             System.out.println("--- NEW MOMO REQUEST ---");
//             System.out.println("Amount: " + amount);
//             System.out.println("OrderId: " + orderId);

//             MomoResponse response = momoService.createPayment(amount, orderId, "Thanh toán đơn hàng " + orderId);

//             if (response == null) {
//                 return ResponseEntity.status(500).body(Map.of("message", "Không có phản hồi từ MoMo"));
//             }

//             if (response.getResultCode() != 0) {
//                 // MoMo returned an error (e.g., signature mismatch, duplicate orderId)
//                 return ResponseEntity.status(400).body(response);
//             }

//             return ResponseEntity.ok(response);
//         } catch (Exception e) {
//             System.err.println("CRITICAL ERROR IN PAYMENT CONTROLLER: " + e.getMessage());
//             e.printStackTrace();
//             return ResponseEntity.status(500).body(Map.of(
//                     "message", "Lỗi xử lý thanh toán: " + e.getMessage(),
//                     "details", e.toString()));
//         }
//     }

//     @GetMapping("/momo/return")
//     public ResponseEntity<?> momoReturn(@RequestParam Map<String, String> params) {
//         return ResponseEntity.ok(params);
//     }

//     @PostMapping("/momo/notify")
//     public ResponseEntity<?> momoNotify(@RequestBody Map<String, Object> body) {
//         System.out.println("MoMo IPN: " + body);
//         return ResponseEntity.ok("OK");
//     }
// }
