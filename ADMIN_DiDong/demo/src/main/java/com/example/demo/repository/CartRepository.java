package com.example.demo.repository;

import org.springframework.stereotype.Repository;

import com.example.demo.entity.Cart;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

@Repository
public class CartRepository {

    private final DataSource dataSource;

    public CartRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // 1. Tìm cart_id
    public Long findCartIdByUser(Long userId) throws SQLException {
        String sql = "SELECT cart_id FROM carts WHERE user_id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ResultSet rs = ps.executeQuery();
            return rs.next() ? rs.getLong("cart_id") : null;
        }
    }

    // 2. Tạo cart mới
    public Long createCart(Long userId) throws SQLException {
        String sql = "INSERT INTO carts (user_id, total_price) VALUES (?, 0)";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setLong(1, userId);
            ps.executeUpdate();
            ResultSet rs = ps.getGeneratedKeys();
            if (rs.next())
                return rs.getLong(1);
            throw new SQLException("Không lấy được cart_id");
        }
    }

    // 3. Check số lượng item
    public Integer findCartItemQty(Long cartId, Long productId) throws SQLException {
        String sql = "SELECT quantity FROM cart_items WHERE cart_id = ? AND product_id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, cartId);
            ps.setLong(2, productId);
            ResultSet rs = ps.executeQuery();
            return rs.next() ? rs.getInt("quantity") : null;
        }
    }

    // 4. Thêm item
    public void insertCartItem(Long cartId, Long productId, int quantity, double productPrice, double discount)
            throws SQLException {
        String sql = "INSERT INTO cart_items (cart_id, product_id, quantity, product_price, discount) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, cartId);
            ps.setLong(2, productId);
            ps.setInt(3, quantity);
            ps.setDouble(4, productPrice);
            ps.setDouble(5, discount);
            ps.executeUpdate();
        }
    }

    // 5. Cập nhật số lượng
    public void updateCartItem(Long cartId, Long productId, int quantity) throws SQLException {
        String sql = "UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, quantity);
            ps.setLong(2, cartId);
            ps.setLong(3, productId);
            ps.executeUpdate();
        }
    }

    // 6. Cập nhật tổng tiền giỏ hàng
    public void updateTotalPrice(Long cartId) throws SQLException {
        // 🔥 Sử dụng discount như % (ví dụ: 10 nghĩa là giảm 10%)
        String sql = """
                    UPDATE carts
                    SET total_price = (
                        SELECT COALESCE(SUM((product_price * (1 - discount / 100)) * quantity), 0)
                        FROM cart_items
                        WHERE cart_id = ?
                    )
                    WHERE cart_id = ?
                """;
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, cartId);
            ps.setLong(2, cartId);
            ps.executeUpdate();
        }
    }

    // 7. Lấy chi tiết giỏ hàng
    public Map<String, Object> getCartByUser(Long userId) throws SQLException {
        Map<String, Object> result = new HashMap<>();
        Long cartId = findCartIdByUser(userId);
        if (cartId == null) {
            result.put("cartId", null);
            result.put("items", List.of());
            result.put("totalPrice", 0);
            return result;
        }

        String sql = """
                    SELECT ci.product_id, ci.quantity, ci.product_price, ci.discount, p.title, p.photo
                    FROM cart_items ci
                    JOIN product p ON p.id = ci.product_id
                    WHERE ci.cart_id = ?
                    ORDER BY ci.cart_item_id DESC
                """;

        List<Map<String, Object>> items = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, cartId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Map<String, Object> item = new HashMap<>();
                item.put("productId", rs.getLong("product_id"));
                item.put("title", rs.getString("title"));
                item.put("photo", rs.getString("photo"));
                item.put("quantity", rs.getInt("quantity"));
                item.put("price", rs.getDouble("product_price"));
                item.put("discount", rs.getDouble("discount"));
                items.add(item);
            }
        }
        result.put("cartId", cartId);
        result.put("items", items);
        result.put("totalPrice", getCartTotal(cartId));
        return result;
    }

    public double getCartTotal(Long cartId) throws SQLException {
        String sql = "SELECT total_price FROM carts WHERE cart_id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, cartId);
            ResultSet rs = ps.executeQuery();
            return rs.next() ? rs.getDouble("total_price") : 0;
        }
    }

    // 🔥 8. XÓA SẢN PHẨM KHỎI GIỎ (MỚI THÊM)
    public void deleteCartItem(Long cartId, Long productId) throws SQLException {
        String sql = "DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, cartId);
            ps.setLong(2, productId);
            ps.executeUpdate();
        }
    }

    // 👇 1. Lấy danh sách item để chuyển sang Order
    public List<Map<String, Object>> getCartItemsForCheckout(Long cartId) throws SQLException {
        String sql = "SELECT product_id, quantity, product_price, discount FROM cart_items WHERE cart_id = ?";
        List<Map<String, Object>> items = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, cartId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> item = new HashMap<>();
                    item.put("product_id", rs.getLong("product_id"));
                    item.put("quantity", rs.getInt("quantity"));
                    item.put("product_price", rs.getDouble("product_price"));
                    item.put("discount", rs.getDouble("discount"));
                    items.add(item);
                }
            }
        }
        return items;
    }

    // 👇 2. Xóa sạch giỏ hàng sau khi đặt hàng (Hết lỗi đỏ 2 bên OrderService)
    public void clearCartAfterCheckout(Long cartId) throws SQLException {
        String sql = "DELETE FROM cart_items WHERE cart_id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, cartId);
            ps.executeUpdate();
        }

        // Reset tổng tiền về 0
        String sqlUpdate = "UPDATE carts SET total_price = 0 WHERE cart_id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sqlUpdate)) {
            ps.setLong(1, cartId);
            ps.executeUpdate();
        }
    }

    // THÊM: Lấy tất cả giỏ hàng
    public List<Cart> findAll() {
        String sql = "SELECT * FROM carts ORDER BY cart_id DESC";
        List<Cart> list = new ArrayList<>();
        try (Connection c = dataSource.getConnection();
                Statement st = c.createStatement();
                ResultSet rs = st.executeQuery(sql)) {
            while (rs.next()) {
                Cart cart = new Cart();
                cart.setCartId(rs.getLong("cart_id"));
                cart.setUserId(rs.getLong("user_id"));
                cart.setTotalPrice(rs.getDouble("total_price"));
                list.add(cart);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return list;
    }

    // THÊM: Lấy chi tiết giỏ hàng bằng Cart ID (thay vì User ID)
    public Map<String, Object> getCartDetailById(Long cartId) {
        Map<String, Object> result = new HashMap<>();

        // Lấy thông tin chung
        String sqlCart = "SELECT * FROM carts WHERE cart_id = ?";
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sqlCart)) {
            ps.setLong(1, cartId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                result.put("id", rs.getLong("cart_id")); // React Admin cần trường "id"
                result.put("userId", rs.getLong("user_id"));
                result.put("totalPrice", rs.getDouble("total_price"));
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        // Lấy danh sách item
        String sqlItems = """
                    SELECT ci.cart_item_id, ci.product_id, ci.quantity, ci.product_price, ci.discount, p.title, p.photo
                    FROM cart_items ci
                    JOIN product p ON p.id = ci.product_id
                    WHERE ci.cart_id = ?
                """;
        List<Map<String, Object>> items = new ArrayList<>();
        try (Connection c = dataSource.getConnection(); PreparedStatement ps = c.prepareStatement(sqlItems)) {
            ps.setLong(1, cartId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Map<String, Object> item = new HashMap<>();
                item.put("id", rs.getLong("cart_item_id")); // React Admin cần id cho mỗi dòng
                item.put("productId", rs.getLong("product_id"));
                item.put("productName", rs.getString("title"));
                item.put("image", rs.getString("photo"));
                item.put("quantity", rs.getInt("quantity"));
                item.put("price", rs.getDouble("product_price"));
                item.put("discount", rs.getDouble("discount"));
                items.add(item);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        result.put("items", items); // Trả về list items
        return result;
    }
}