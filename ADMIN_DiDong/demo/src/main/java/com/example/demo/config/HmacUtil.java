package com.example.demo.config;

import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;
import java.nio.charset.StandardCharsets;

public class HmacUtil {

    public static String hmacSHA256(String data, String key) {
        return new HmacUtils(HmacAlgorithms.HMAC_SHA_256, key)
                .hmacHex(data.getBytes(StandardCharsets.UTF_8));
    }
}
