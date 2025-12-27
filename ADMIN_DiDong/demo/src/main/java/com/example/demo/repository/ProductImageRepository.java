package com.example.demo.repository;

import com.example.demo.entity.ProductImage;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ProductImageRepository {

    private final DataSource dataSource;

    public ProductImageRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // 🔥 LẤY TẤT CẢ ẢNH THEO PRODUCT_ID
    public List<ProductImage> findByProductId(Long productId) {
        String sql = """
            SELECT id, product_id, image_url, is_main
            FROM product_images
            WHERE product_id = ?
            ORDER BY is_main DESC, id ASC
        """;

        List<ProductImage> images = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, productId);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    ProductImage img = new ProductImage();
                    img.setId(rs.getLong("id"));
                    img.setProductId(rs.getLong("product_id"));
                    img.setImageUrl(rs.getString("image_url"));
                    img.setMain(rs.getBoolean("is_main"));
                    images.add(img);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi lấy ảnh sản phẩm", e);
        }

        return images;
    }
}
