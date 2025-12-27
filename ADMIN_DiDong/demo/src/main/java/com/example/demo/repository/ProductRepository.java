package com.example.demo.repository;

import com.example.demo.entity.Product;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ProductRepository {

    private final DataSource dataSource;

    public ProductRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // --- CREATE (LƯU) ---
    public Product save(Product p) {
        String sql = """
                    INSERT INTO product
                    (title, slug, description, photo, price, price_root, qty, category_id, deleted)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
                """;
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, p.getTitle());
            ps.setString(2, p.getSlug());
            ps.setString(3, p.getDescription());
            ps.setString(4, p.getPhoto());
            ps.setDouble(5, p.getPrice());
            ps.setDouble(6, p.getPriceRoot());
            ps.setInt(7, p.getQty());

            if (p.getCategoryId() != null) {
                ps.setLong(8, p.getCategoryId());
            } else {
                ps.setNull(8, Types.BIGINT);
            }

            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    p.setId(rs.getLong(1));
                }
            }
            return p;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi lưu sản phẩm: " + e.getMessage());
        }
    }

    // --- UPDATE (CẬP NHẬT) - ĐÃ SỬA TRẢ VỀ PRODUCT ---
    public Product update(Long id, Product p) {
        String sql = """
                    UPDATE product
                    SET title=?, slug=?, description=?, photo=?, price=?, price_root=?, qty=?, category_id=?
                    WHERE id=?
                """;
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setString(1, p.getTitle());
            ps.setString(2, p.getSlug());
            ps.setString(3, p.getDescription());
            ps.setString(4, p.getPhoto());
            ps.setDouble(5, p.getPrice());
            ps.setDouble(6, p.getPriceRoot());
            ps.setInt(7, p.getQty());

            if (p.getCategoryId() != null) {
                ps.setLong(8, p.getCategoryId());
            } else {
                ps.setNull(8, Types.BIGINT);
            }

            ps.setLong(9, id);

            ps.executeUpdate();

            // Gán lại ID để đảm bảo object trả về đầy đủ
            p.setId(id);
            return p;

        } catch (Exception e) {
            throw new RuntimeException("Lỗi cập nhật sản phẩm: " + e.getMessage());
        }
    }

    // --- FIND ALL ACTIVE (LẤY DS) ---
    public List<Product> findActive(Long categoryId) {
        String sql = "SELECT * FROM product WHERE deleted = 0";
        if (categoryId != null)
            sql += " AND category_id = ?";
        sql += " ORDER BY id DESC";

        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            if (categoryId != null)
                ps.setLong(1, categoryId);
            try (ResultSet rs = ps.executeQuery()) {
                return mapList(rs);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // --- SEARCH (TÌM KIẾM) ---
    public List<Product> searchActive(String q, Long categoryId) {
        String sql = "SELECT * FROM product WHERE deleted = 0 AND title LIKE ?";
        if (categoryId != null)
            sql += " AND category_id = ?";
        sql += " ORDER BY id DESC";

        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, "%" + q + "%");
            if (categoryId != null)
                ps.setLong(2, categoryId);
            try (ResultSet rs = ps.executeQuery()) {
                return mapList(rs);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // --- FIND BY ID (CHI TIẾT) ---
    public Product findById(Long id) {
        String sql = "SELECT * FROM product WHERE id = ?";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                List<Product> list = mapList(rs);
                return list.isEmpty() ? null : list.get(0);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // --- DELETE (XÓA MỀM) ---
    public void softDelete(Long id) {
        execute("UPDATE product SET deleted=1 WHERE id=?", id);
    }

    // --- RESTORE (KHÔI PHỤC) ---
    public void restore(Long id) {
        execute("UPDATE product SET deleted=0 WHERE id=?", id);
    }

    // --- FORCE DELETE (XÓA VĨNH VIỄN) ---
    public void forceDelete(Long id) {
        execute("DELETE FROM product WHERE id=?", id);
    }

    // --- FIND TRASH (THÙNG RÁC) ---
    public List<Product> findTrash() {
        String sql = "SELECT * FROM product WHERE deleted = 1 ORDER BY id DESC";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            return mapList(rs);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // --- FIND RELATED (SẢN PHẨM CÙNG DANH MỤC) ---
    public List<Product> findRelated(Long productId, Long categoryId) {
        String sql = "SELECT * FROM product WHERE deleted = 0 AND category_id = ? AND id != ? LIMIT 10";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, categoryId);
            ps.setLong(2, productId);
            try (ResultSet rs = ps.executeQuery()) {
                return mapList(rs);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    // --- CÁC HÀM PHỤ TRỢ ---
    private void execute(String sql, Long id) {
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private List<Product> mapList(ResultSet rs) throws SQLException {
        List<Product> list = new ArrayList<>();
        while (rs.next()) {
            Product p = new Product();
            p.setId(rs.getLong("id"));
            p.setTitle(rs.getString("title"));
            p.setSlug(rs.getString("slug"));
            p.setDescription(rs.getString("description"));
            p.setPhoto(rs.getString("photo"));
            p.setPrice(rs.getDouble("price"));
            p.setPriceRoot(rs.getDouble("price_root"));
            p.setQty(rs.getInt("qty"));
            p.setCategoryId(rs.getLong("category_id"));
            p.setDeleted(rs.getBoolean("deleted"));
            list.add(p);
        }
        return list;
    }
}