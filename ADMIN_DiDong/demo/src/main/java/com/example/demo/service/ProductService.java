package com.example.demo.service;

import com.example.demo.entity.Product;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    Product create(Product p, MultipartFile image) throws IOException;

    // ✅ Đã sửa void thành Product
    Product update(Long id, Product p);

    List<Product> getActive(Long categoryId);

    List<Product> getRelated(Long productId, Long categoryId);

    List<Product> search(String q, Long categoryId);

    List<Product> getTrash();

    Product getById(Long id);

    void delete(Long id);

    void restore(Long id);

    void forceDelete(Long id);
}