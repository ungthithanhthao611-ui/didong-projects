// package com.example.demo.service.impl;

// import com.example.demo.config.HmacUtil;
// import com.example.demo.dto.MomoResponse;
// import com.example.demo.service.MomoService;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.*;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.HttpClientErrorException;
// import org.springframework.web.client.RestTemplate;

// import java.util.HashMap;
// import java.util.Map;

// @Service
// public class MomoServiceImpl implements MomoService {

//     @Value("${momo.endpoint}")
//     private String endpoint;
//     @Value("${momo.partnerCode}")
//     private String partnerCode;
//     @Value("${momo.accessKey}")
//     private String accessKey;
//     @Value("${momo.secretKey}")
//     private String secretKey;
//     @Value("${momo.returnUrl}")
//     private String returnUrl;
//     @Value("${momo.notifyUrl}")
//     private String notifyUrl;
//     @Value("${momo.requestType}")
//     private String requestType;

//     @Override
//     public MomoResponse createPayment(long amount, String orderId, String orderInfo) {

//         String requestId = String.valueOf(System.currentTimeMillis());
//         String extraData = "";
//         String amountStr = String.valueOf(amount);

//         // Signature order: accessKey, amount, extraData, ipnUrl, orderId, orderInfo,
//         // partnerCode, redirectUrl, requestId, requestType
//         String rawData = "accessKey=" + accessKey +
//                 "&amount=" + amountStr +
//                 "&extraData=" + extraData +
//                 "&ipnUrl=" + notifyUrl +
//                 "&orderId=" + orderId +
//                 "&orderInfo=" + orderInfo +
//                 "&partnerCode=" + partnerCode +
//                 "&redirectUrl=" + returnUrl +
//                 "&requestId=" + requestId +
//                 "&requestType=" + requestType;

//         System.out.println("--- MoMo Request Info ---");
//         System.out.println("Raw Data for Signature: " + rawData);

//         String signature = HmacUtil.hmacSHA256(rawData, secretKey);
//         System.out.println("Generated Signature: " + signature);

//         // Maintain field order in payload (though not strictly required for JSON, it
//         // helps debugging)
//         Map<String, Object> payload = new java.util.LinkedHashMap<>();
//         payload.put("partnerCode", partnerCode);
//         payload.put("partnerName", "MoMo");
//         payload.put("storeId", "TestStore");
//         payload.put("requestId", requestId);
//         payload.put("amount", amount);
//         payload.put("orderId", orderId);
//         payload.put("orderInfo", orderInfo);
//         payload.put("redirectUrl", returnUrl);
//         payload.put("ipnUrl", notifyUrl);
//         payload.put("lang", "vi");
//         payload.put("extraData", extraData);
//         payload.put("requestType", requestType);
//         payload.put("signature", signature);

//         System.out.println("Payload to MoMo: " + payload);

//         RestTemplate restTemplate = new RestTemplate();
//         try {
//             MomoResponse response = restTemplate.postForObject(endpoint, payload, MomoResponse.class);

//             if (response != null) {
//                 System.out.println("MoMo Response: " + response);
//             } else {
//                 System.err.println("MoMo Response is NULL");
//             }

//             return response;
//         } catch (HttpClientErrorException e) {
//             String errorBody = e.getResponseBodyAsString();
//             System.err.println("MoMo API HTTP Error: " + errorBody);
//             // Re-throw with body so controller can catch it
//             throw new RuntimeException("MoMo API Error: " + errorBody);
//         } catch (Exception e) {
//             System.err.println("MoMo API Connection Error: " + e.getMessage());
//             throw e;
//         }
//     }
// }
