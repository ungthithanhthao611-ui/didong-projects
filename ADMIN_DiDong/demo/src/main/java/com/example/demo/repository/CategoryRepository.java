package com.example.demo.repository;

import org.springframework.stereotype.Repository;
import com.example.demo.entity.Category;
import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class CategoryRepository {

    private final DataSource dataSource;

    public CategoryRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // --- CÁC HÀM GET (GIỮ NGUYÊN) ---
    public List<Category> findAll() {
        List<Category> list = new ArrayList<>();
        String sql = "SELECT * FROM category WHERE deleted = 0 ORDER BY id DESC";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Category cat = mapRow(rs);
                list.add(cat);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return list;
    }

    public Category findById(Long id) {
        String sql = "SELECT * FROM category WHERE id = ?";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return mapRow(rs);
        } catch (SQLException e) { e.printStackTrace(); }
        return null;
    }

    // 🔥 [QUAN TRỌNG] SỬA HÀM SAVE: TRẢ VỀ CATEGORY CÓ ID
    public Category save(Category cat) {
        String sql = "INSERT INTO category (name, slug, deleted) VALUES (?, ?, 0)";
        
        // Thêm tham số Statement.RETURN_GENERATED_KEYS
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            ps.setString(1, cat.getName());
            ps.setString(2, cat.getSlug());
            ps.executeUpdate();

            // Lấy ID mới sinh ra gán ngược vào object
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    cat.setId(rs.getLong(1));
                }
            }
            return cat; // Trả về object đã có ID đầy đủ
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi tạo danh mục");
        }
    }

    // 🔥 SỬA HÀM UPDATE: TRẢ VỀ CATEGORY
    public Category update(Long id, Category cat) {
        String sql = "UPDATE category SET name=?, slug=? WHERE id=?";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, cat.getName());
            ps.setString(2, cat.getSlug());
            ps.setLong(3, id);
            ps.executeUpdate();
            
            cat.setId(id); // Đảm bảo ID đúng để trả về
            return cat;
        } catch (SQLException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi update danh mục");
        }
    }

    public void delete(Long id) {
        String sql = "UPDATE category SET deleted = 1 WHERE id=?";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }

    // Hàm phụ trợ map data cho gọn
    private Category mapRow(ResultSet rs) throws SQLException {
        Category cat = new Category();
        cat.setId(rs.getLong("id"));
        cat.setName(rs.getString("name"));
        try { cat.setSlug(rs.getString("slug")); } catch (Exception e) {}
        try { cat.setDeleted(rs.getBoolean("deleted")); } catch (Exception e) {}
        return cat;
    }
}