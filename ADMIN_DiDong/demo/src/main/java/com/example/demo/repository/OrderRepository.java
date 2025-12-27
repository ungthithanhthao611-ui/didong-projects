package com.example.demo.repository;

import com.example.demo.entity.Order;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Repository
public class OrderRepository {

    private final DataSource dataSource;

    public OrderRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // --- DTO: Class chứa thông tin chi tiết sản phẩm trong đơn ---
    public static class OrderItemDetail {
        private Long productId;
        private String productName;
        private String productPhoto;
        private int quantity;
        private double price;
        private double discount;

        // Getter & Setter
        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public String getProductPhoto() {
            return productPhoto;
        }

        public void setProductPhoto(String productPhoto) {
            this.productPhoto = productPhoto;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }

        public double getDiscount() {
            return discount;
        }

        public void setDiscount(double discount) {
            this.discount = discount;
        }
    }

    // ✅ 1. TÌM ĐƠN HÀNG THEO ID (QUAN TRỌNG CHO TRANG EDIT)
    public Order findById(Long id) {
        String sql = "SELECT * FROM orders WHERE order_id = ?";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Order o = new Order();
                    o.setOrderId(rs.getLong("order_id"));
                    o.setEmail(rs.getString("email"));

                    // Fix: Handle NULL user_id
                    long userId = rs.getLong("user_id");
                    o.setUserId(rs.wasNull() ? null : userId);

                    o.setCustomerName(rs.getString("customer_name"));
                    o.setPhone(rs.getString("phone"));
                    o.setAddress(rs.getString("address"));

                    // Fix: Handle NULL order_date
                    Date date = rs.getDate("order_date");
                    if (date != null) {
                        o.setOrderDate(date.toLocalDate());
                    }

                    o.setOrderStatus(rs.getString("order_status"));
                    o.setTotalAmount(rs.getDouble("total_amount"));
                    return o;
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    // --- 2. LẤY CHI TIẾT SẢN PHẨM TRONG ĐƠN HÀNG ---
    public List<OrderItemDetail> getOrderItems(Long orderId) {
        String sql = """
                    SELECT p.id, p.title, p.photo, oi.quantity, oi.ordered_product_price, oi.discount
                    FROM order_items oi
                    JOIN product p ON oi.product_id = p.id
                    WHERE oi.order_id = ?
                """;

        List<OrderItemDetail> items = new ArrayList<>();
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {

            ps.setLong(1, orderId);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    OrderItemDetail item = new OrderItemDetail();
                    item.setProductId(rs.getLong("id"));
                    item.setProductName(rs.getString("title"));
                    item.setProductPhoto(rs.getString("photo"));
                    item.setQuantity(rs.getInt("quantity"));
                    item.setPrice(rs.getDouble("ordered_product_price"));
                    item.setDiscount(rs.getDouble("discount"));
                    items.add(item);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return items;
    }

    // --- 3. TẠO ĐƠN HÀNG ---
    public Long createOrder(Long userId, String email, double totalAmount, String status, String name, String phone,
            String address)
            throws SQLException {
        String sql = "INSERT INTO orders (user_id, email, order_date, order_status, total_amount, customer_name, phone, address) VALUES (?, ?, CURDATE(), ?, ?, ?, ?, ?)";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setObject(1, userId);
            ps.setString(2, email);
            ps.setString(3, status);
            ps.setDouble(4, totalAmount);
            ps.setString(5, name);
            ps.setString(6, phone);
            ps.setString(7, address);
            ps.executeUpdate();
            ResultSet rs = ps.getGeneratedKeys();
            rs.next();
            return rs.getLong(1);
        }
    }

    // --- 4. LƯU CHI TIẾT ĐƠN ---
    public void insertOrderItem(Long orderId, Long productId, int qty, double price, double discount)
            throws SQLException {
        String sql = "INSERT INTO order_items (order_id, product_id, quantity, ordered_product_price, discount) VALUES (?, ?, ?, ?, ?)";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, orderId);
            ps.setLong(2, productId);
            ps.setInt(3, qty);
            ps.setDouble(4, price);
            ps.setDouble(5, discount);
            ps.executeUpdate();
        }
    }

    // --- 5. LẤY TẤT CẢ ĐƠN (ADMIN) ---
    public List<Order> findAll() {
        return queryOrders("SELECT * FROM orders ORDER BY order_id DESC");
    }

    // --- 6. CẬP NHẬT TRẠNG THÁI (ADMIN) ---
    public void updateStatus(Long orderId, String status) {
        String sql = "UPDATE orders SET order_status = ? WHERE order_id = ?";
        Connection c = org.springframework.jdbc.datasource.DataSourceUtils.getConnection(dataSource);
        try (PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setObject(2, orderId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } finally {
            org.springframework.jdbc.datasource.DataSourceUtils.releaseConnection(c, dataSource);
        }
    }

    // --- 6.2 Ghi nhận hủy đơn ---
    public void recordOrderCancel(Long orderId, Long userId, String reason) throws SQLException {
        String sql = "INSERT INTO orders_cancel (order_id, user_id, reason, cancelled_at) VALUES (?, ?, ?, NOW())";
        // Sử dụng DataSourceUtils để cùng tham gia Transaction với Service
        Connection c = org.springframework.jdbc.datasource.DataSourceUtils.getConnection(dataSource);
        try (PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setObject(1, orderId); // setObject tự xử lý null và không bị lỗi unboxing
            ps.setObject(2, userId);
            ps.setString(3, reason);
            ps.executeUpdate();
        } finally {
            org.springframework.jdbc.datasource.DataSourceUtils.releaseConnection(c, dataSource);
        }
    }

    // --- 7. LẤY ĐƠN CỦA USER ---
    public List<Order> findByUser(Long userId, String status) {
        String sql = "SELECT * FROM orders WHERE user_id = ?";
        if (status != null && !status.isEmpty())
            sql += " AND order_status = ?";
        sql += " ORDER BY order_id DESC";

        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, userId);
            if (status != null && !status.isEmpty())
                ps.setString(2, status.toUpperCase());
            try (ResultSet rs = ps.executeQuery()) {
                return mapOrderList(rs);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // Helper: Lấy email từ bảng users
    public String getUserEmailById(Long userId) {
        String sql = "SELECT email FROM users WHERE id = ?";
        try (Connection c = dataSource.getConnection();
                PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setLong(1, userId);
            ResultSet rs = ps.executeQuery();
            if (rs.next())
                return rs.getString("email");
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return "";
    }

    // Helper: Map ResultSet
    private List<Order> queryOrders(String sql) {
        try (Connection c = dataSource.getConnection();
                Statement st = c.createStatement();
                ResultSet rs = st.executeQuery(sql)) {
            return mapOrderList(rs);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private List<Order> mapOrderList(ResultSet rs) throws SQLException {
        List<Order> list = new ArrayList<>();
        while (rs.next()) {
            Order o = new Order();
            o.setOrderId(rs.getLong("order_id"));
            o.setEmail(rs.getString("email"));

            // Fix: Handle NULL user_id correctly
            long userId = rs.getLong("user_id");
            o.setUserId(rs.wasNull() ? null : userId);

            o.setCustomerName(rs.getString("customer_name"));
            o.setPhone(rs.getString("phone"));
            o.setAddress(rs.getString("address"));

            // Fix: Handle NULL order_date
            Date date = rs.getDate("order_date");
            if (date != null) {
                o.setOrderDate(date.toLocalDate());
            }

            o.setOrderStatus(rs.getString("order_status"));
            o.setTotalAmount(rs.getDouble("total_amount"));
            list.add(o);
        }
        return list;
    }
}