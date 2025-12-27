package com.example.demo.service.impl;

import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;
import com.example.demo.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repo;
    private final Path uploadPath = Paths.get("uploads/images");

    public ProductServiceImpl(ProductRepository repo) {
        this.repo = repo;
        try {
            if (!Files.exists(uploadPath))
                Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Không thể tạo thư mục uploads/images", e);
        }
    }

    @Override
    public Product create(Product p, MultipartFile image) throws IOException {
        if (image != null && !image.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
            try (InputStream is = image.getInputStream()) {
                Files.copy(is, uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            }
            p.setPhoto(fileName);
        } else {
            p.setPhoto("default.png");
        }
        return repo.save(p);
    }

    // ✅ Đã sửa để trả về Product
    @Override
    public Product update(Long id, Product p) {
        // Logic phụ: Nếu frontend gửi ảnh null (không chọn ảnh mới), giữ ảnh cũ
        Product old = repo.findById(id);
        if (old != null) {
            if (p.getPhoto() == null || p.getPhoto().isEmpty()) {
                p.setPhoto(old.getPhoto());
            }
        }
        return repo.update(id, p);
    }

    @Override
    public List<Product> getActive(Long categoryId) {
        return repo.findActive(categoryId);
    }

    @Override
    public List<Product> getRelated(Long productId, Long categoryId) {
        return repo.findRelated(productId, categoryId);
    }

    @Override
    public List<Product> search(String q, Long categoryId) {
        return repo.searchActive(q, categoryId);
    }

    @Override
    public List<Product> getTrash() {
        return repo.findTrash();
    }

    @Override
    public Product getById(Long id) {
        return repo.findById(id);
    }

    @Override
    public void delete(Long id) {
        repo.softDelete(id);
    }

    @Override
    public void restore(Long id) {
        repo.restore(id);
    }

    @Override
    public void forceDelete(Long id) {
        repo.forceDelete(id);
    }
}