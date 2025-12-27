import { 
    List, 
    Datagrid, 
    TextField, 
    NumberField, 
    Show, 
    SimpleShowLayout, 
    ShowButton,
    useRecordContext,
    FunctionField
} from "react-admin";
import { useEffect, useState } from "react";

// URL ảnh
const IMAGE_BASE_URL = "http://localhost:8080/images/";

// --- COMPONENT CON: HIỂN THỊ CHI TIẾT GIỎ HÀNG ---
const CartItemsTable = () => {
    const record = useRecordContext();
    // Dữ liệu items đã được backend trả về trong object record (nếu gọi getCartById chuẩn)
    // Hoặc ta lấy từ state nếu backend trả về cấu trúc lồng nhau
    
    // Tuy nhiên, React Admin Show lấy record từ API getOne.
    // Backend trả về: { id: 1, userId: 5, totalPrice: 100, items: [...] }
    
    const items = record?.items || [];

    if (!items || items.length === 0) return <p>Giỏ hàng trống</p>;

    return (
        <div style={{ margin: "20px 0", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
            <h3 style={{ backgroundColor: "#f5f5f5", padding: "10px", margin: 0 }}>🛒 Chi tiết sản phẩm</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ backgroundColor: "#fafafa", borderBottom: "1px solid #eee" }}>
                        <th style={{ padding: "10px", textAlign: "left" }}>Ảnh</th>
                        <th style={{ padding: "10px", textAlign: "left" }}>Tên sản phẩm</th>
                        <th style={{ padding: "10px", textAlign: "center" }}>SL</th>
                        <th style={{ padding: "10px", textAlign: "right" }}>Giá gốc</th>
                        <th style={{ padding: "10px", textAlign: "right" }}>Giảm giá</th>
                        <th style={{ padding: "10px", textAlign: "right" }}>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item: any, index: number) => (
                        <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "10px" }}>
                                <img 
                                    src={item.image ? `${IMAGE_BASE_URL}${item.image}` : "https://via.placeholder.com/50"} 
                                    alt="img" 
                                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", border: "1px solid #ddd" }}
                                />
                            </td>
                            <td style={{ padding: "10px" }}>
                                <div>{item.productName}</div>
                                <small style={{color: '#888'}}>ID: {item.productId}</small>
                            </td>
                            <td style={{ padding: "10px", textAlign: "center" }}>x{item.quantity}</td>
                            <td style={{ padding: "10px", textAlign: "right" }}>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                            </td>
                            <td style={{ padding: "10px", textAlign: "right", color: 'green' }}>
                                -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.discount)}
                            </td>
                            <td style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((item.price - item.discount) * item.quantity)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// 1. Danh sách Giỏ hàng
export const CartList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="id" label="Mã Giỏ (CartID)" />
            <TextField source="userId" label="Mã User" />
            
            <NumberField 
                source="totalPrice" 
                label="Tổng giá trị" 
                options={{ style: 'currency', currency: 'VND' }}
                style={{ fontWeight: 'bold', color: '#d32f2f' }}
            />
            
            {/* Đếm số lượng sản phẩm (nếu backend chưa trả items ở list thì bỏ qua) */}
            <FunctionField 
                label="Trạng thái" 
                render={() => <span style={{ color: 'blue' }}>Đang hoạt động</span>} 
            />

            <ShowButton />
        </Datagrid>
    </List>
);

// 2. Xem chi tiết Giỏ hàng
export const CartShow = () => (
    <Show>
        <SimpleShowLayout>
            <div style={{ display: 'flex', gap: '30px', marginBottom: '20px' }}>
                <TextField source="id" label="Mã Giỏ Hàng" style={{ fontSize: '1.2em', fontWeight: 'bold' }} />
                <TextField source="userId" label="Mã Khách Hàng (User ID)" style={{ fontSize: '1.2em' }} />
                <NumberField 
                    source="totalPrice" 
                    label="Tổng tạm tính" 
                    options={{ style: 'currency', currency: 'VND' }} 
                    style={{ fontSize: '1.2em', color: '#d32f2f', fontWeight: 'bold' }}
                />
            </div>

            <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '0 0 20px 0' }} />

            {/* Bảng chi tiết sản phẩm */}
            <CartItemsTable />
            
        </SimpleShowLayout>
    </Show>
);