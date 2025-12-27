import {
    List,
    Datagrid,
    TextField,
    NumberField,
    DateField,
    EditButton,
    DeleteButton,
    Create,
    SimpleForm,
    TextInput,
    NumberInput,
    DateInput,
    Edit,
    required
} from "react-admin";

// --- GIAO DIỆN DANH SÁCH ---
export const VoucherList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" label="ID" />
            <TextField source="code" label="Mã Voucher" sx={{ fontWeight: 'bold', color: 'blue' }} />
            
            <NumberField 
                source="discount" 
                label="Giảm giá" 
                options={{ style: 'currency', currency: 'VND' }} 
                sx={{ color: 'green', fontWeight: 'bold' }}
            />
            
            <NumberField 
                source="minOrderAmount" 
                label="Đơn tối thiểu" 
                options={{ style: 'currency', currency: 'VND' }} 
            />
            
            <NumberField source="usageLimit" label="Lượt dùng" />
            <DateField source="expiryDate" label="Hạn sử dụng" />
            
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

// --- GIAO DIỆN TẠO MỚI ---
export const VoucherCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="code" label="Mã Voucher (VD: SALE50)" fullWidth validate={required()} />
            
            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                <NumberInput source="discount" label="Số tiền giảm (VNĐ)" style={{ flex: 1 }} validate={required()} />
                <NumberInput source="minOrderAmount" label="Đơn tối thiểu (VNĐ)" style={{ flex: 1 }} defaultValue={0} />
            </div>

            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                <NumberInput source="usageLimit" label="Số lượt dùng tối đa" style={{ flex: 1 }} defaultValue={100} />
                <DateInput source="expiryDate" label="Ngày hết hạn" style={{ flex: 1 }} validate={required()} />
            </div>
        </SimpleForm>
    </Create>
);

// --- GIAO DIỆN CHỈNH SỬA ---
export const VoucherEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled label="ID" />
            <TextInput source="code" label="Mã Voucher" fullWidth validate={required()} />
            
            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                <NumberInput source="discount" label="Số tiền giảm" style={{ flex: 1 }} />
                <NumberInput source="minOrderAmount" label="Đơn tối thiểu" style={{ flex: 1 }} />
            </div>

            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                <NumberInput source="usageLimit" label="Số lượt dùng" style={{ flex: 1 }} />
                <DateInput source="expiryDate" label="Ngày hết hạn" style={{ flex: 1 }} />
            </div>
        </SimpleForm>
    </Edit>
);