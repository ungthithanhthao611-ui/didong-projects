package com.example.demo.repository;

import com.example.demo.entity.Voucher;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class VoucherRepository {

    private final DataSource dataSource;

    public VoucherRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // 1. TẠO MỚI (CREATE) - Trả về Voucher có ID
    public Voucher save(Voucher v) {
        String sql = "INSERT INTO vouchers (code, discount, min_order_amount, expiry_date, usage_limit, is_active) VALUES (?, ?, ?, ?, ?, 1)";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            
            ps.setString(1, v.getCode().toUpperCase());
            ps.setDouble(2, v.getDiscount());
            ps.setDouble(3, v.getMinOrderAmount());
            ps.setDate(4, Date.valueOf(v.getExpiryDate()));
            ps.setInt(5, v.getUsageLimit());
            ps.executeUpdate();

            // Lấy ID mới sinh ra
            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    v.setId(rs.getLong(1));
                }
            }
            return v;
        } catch (SQLException e) {
            throw new RuntimeException("Lỗi tạo voucher: " + e.getMessage());
        }
    }

    // 2. CẬP NHẬT (UPDATE) - Trả về Voucher sau khi sửa
    public Voucher update(Long id, Voucher v) {
        String sql = "UPDATE vouchers SET code=?, discount=?, min_order_amount=?, expiry_date=?, usage_limit=? WHERE id=?";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            
            ps.setString(1, v.getCode().toUpperCase());
            ps.setDouble(2, v.getDiscount());
            ps.setDouble(3, v.getMinOrderAmount());
            ps.setDate(4, Date.valueOf(v.getExpiryDate()));
            ps.setInt(5, v.getUsageLimit());
            ps.setLong(6, id);
            
            ps.executeUpdate();
            
            v.setId(id); // Đảm bảo trả về đúng ID
            return v;
        } catch (SQLException e) {
            throw new RuntimeException("Lỗi cập nhật voucher: " + e.getMessage());
        }
    }

    // 3. TÌM THEO ID (Dùng cho trang Edit)
    public Voucher findById(Long id) {
        String sql = "SELECT * FROM vouchers WHERE id = ?";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return mapRow(rs);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    // 4. LẤY DANH SÁCH (Dùng cho trang List)
    public List<Voucher> findAll() {
        List<Voucher> list = new ArrayList<>();
        String sql = "SELECT * FROM vouchers ORDER BY id DESC";
        try (Connection c = dataSource.getConnection();
             Statement st = c.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return list;
    }

    // 5. XÓA (DELETE)
    public void delete(Long id) {
        String sql = "DELETE FROM vouchers WHERE id=?";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // 6. TÌM THEO MÃ CODE (Dùng cho User check mã)
    public Voucher findByCode(String code) {
        String sql = "SELECT * FROM vouchers WHERE code = ? AND is_active = 1 AND usage_limit > 0 AND expiry_date >= CURDATE()";
        try (Connection c = dataSource.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, code);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return mapRow(rs);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null; // Không tìm thấy hoặc hết hạn
    }

    // 7. LẤY MÃ CÒN HIỆU LỰC (Public API)
    public List<Voucher> findActiveVouchers() {
        String sql = "SELECT * FROM vouchers WHERE is_active = 1 AND usage_limit > 0 AND expiry_date >= CURDATE() ORDER BY discount DESC";
        List<Voucher> list = new ArrayList<>();
        try (Connection c = dataSource.getConnection();
             Statement st = c.createStatement();
             ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                list.add(mapRow(rs));
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return list;
    }

    // --- Helper: Map dữ liệu từ SQL vào Java Object ---
    private Voucher mapRow(ResultSet rs) throws SQLException {
        Voucher v = new Voucher();
        v.setId(rs.getLong("id"));
        v.setCode(rs.getString("code"));
        v.setDiscount(rs.getDouble("discount"));
        v.setMinOrderAmount(rs.getDouble("min_order_amount"));
        v.setExpiryDate(rs.getDate("expiry_date").toLocalDate());
        v.setUsageLimit(rs.getInt("usage_limit"));
        v.setActive(rs.getBoolean("is_active"));
        return v;
    }
}