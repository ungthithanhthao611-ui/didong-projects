import {
    List,
    Datagrid,
    TextField,
    DateField,
    NumberField,
    Edit,
    SimpleForm,
    SelectInput,
    TextInput,
    NumberInput,
    EditButton,
    useRecordContext,
    FunctionField,
} from "react-admin";
import { useEffect, useState } from "react";

// URL gốc ảnh của bạn
const IMAGE_BASE_URL = "http://localhost:8080/images/";

const statusChoices = [
    { id: "PENDING", name: "Chờ xác nhận" },
    { id: "PAID", name: "Đã thanh toán" },
    { id: "SHIPPING", name: "Đang giao hàng" },
    { id: "COMPLETED", name: "Hoàn thành" },
    { id: "CANCELLED", name: "Đã hủy" },
];

// --- COMPONENT CON: HIỂN THỊ CHI TIẾT SẢN PHẨM ---
const OrderItemsTable = () => {
    const record = useRecordContext(); // Lấy thông tin đơn hàng hiện tại
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        if (record && record.id) {
            // Gọi API lấy chi tiết sản phẩm: /api/orders/{id}/items
            fetch(`http://localhost:8080/api/orders/${record.id}/items`)
                .then((res) => res.json())
                .then((data) => setItems(data))
                .catch((err) => console.error("Lỗi tải sản phẩm:", err));
        }
    }, [record]);

    if (!items.length) return <p>Đang tải sản phẩm hoặc đơn hàng trống...</p>;

    return (
        <div style={{ margin: "20px 0", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden" }}>
            <h3 style={{ backgroundColor: "#f5f5f5", padding: "10px", margin: 0 }}>📦 Sản phẩm trong đơn</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ backgroundColor: "#fafafa", borderBottom: "1px solid #eee" }}>
                        <th style={{ padding: "10px", textAlign: "left" }}>Ảnh</th>
                        <th style={{ padding: "10px", textAlign: "left" }}>Tên sản phẩm</th>
                        <th style={{ padding: "10px", textAlign: "center" }}>SL</th>
                        <th style={{ padding: "10px", textAlign: "right" }}>Đơn giá</th>
                        <th style={{ padding: "10px", textAlign: "right" }}>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "10px" }}>
                                <img 
                                    src={`${IMAGE_BASE_URL}${item.productPhoto}`} 
                                    alt="img" 
                                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px", border: "1px solid #ddd" }}
                                    onError={(e: any) => e.target.src = "https://via.placeholder.com/50"}
                                />
                            </td>
                            <td style={{ padding: "10px" }}>{item.productName}</td>
                            <td style={{ padding: "10px", textAlign: "center" }}>x{item.quantity}</td>
                            <td style={{ padding: "10px", textAlign: "right" }}>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                            </td>
                            <td style={{ padding: "10px", textAlign: "right", fontWeight: "bold" }}>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- 1. Danh sách đơn hàng ---
export const OrderList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" label="Mã đơn" />
            <TextField source="email" label="Khách hàng" />
            <DateField source="orderDate" label="Ngày đặt" />
            
            <FunctionField 
                label="Trạng thái" 
                render={(record: any) => {
                    let color = '#000';
                    if (record.orderStatus === 'PENDING') color = 'orange';
                    if (record.orderStatus === 'COMPLETED') color = 'green';
                    if (record.orderStatus === 'CANCELLED') color = 'red';
                    return <span style={{ color, fontWeight: 'bold' }}>{record.orderStatus}</span>;
                }} 
            />

            <NumberField 
                source="totalAmount" 
                label="Tổng tiền" 
                options={{ style: 'currency', currency: 'VND' }} 
                style={{ fontWeight: 'bold', color: '#d32f2f' }}
            />
            <EditButton />
        </Datagrid>
    </List>
);

// --- 2. Chỉnh sửa & Xem chi tiết ---
export const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                <TextInput source="id" disabled label="Mã đơn hàng" style={{ flex: 1 }} />
                <TextInput source="email" disabled label="Email Khách" style={{ flex: 2 }} />
                <DateField source="orderDate" label="Ngày đặt" style={{ flex: 1, paddingTop: '15px' }} />
            </div>

            {/* Component hiển thị danh sách sản phẩm */}
            <OrderItemsTable />

            <div style={{ display: 'flex', gap: '20px', width: '100%', marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                <NumberInput 
                    source="totalAmount" 
                    disabled 
                    label="Tổng thành tiền (VNĐ)" 
                    style={{ flex: 1 }}
                />
                
                {/* Chỉ cho phép Admin sửa trạng thái */}
                <SelectInput 
                    source="orderStatus" 
                    label="Cập nhật Trạng thái" 
                    choices={statusChoices} 
                    style={{ flex: 1 }}
                />
            </div>
        </SimpleForm>
    </Edit>
);