import { 
    List, 
    Datagrid, 
    TextField, 
    NumberField, 
    Edit, 
    SimpleForm, 
    TextInput, 
    NumberInput, 
    Create,
    EditButton,
    DeleteButton,
    ReferenceInput, 
    SelectInput,    
    ReferenceField,
    FunctionField,
    ImageInput, // <--- [MỚI] Để chọn file ảnh
    ImageField  // <--- [MỚI] Để xem trước ảnh khi chọn
} from "react-admin";

const IMAGE_BASE_URL = "http://localhost:8080/images/";

// --- 1. Giao diện Danh sách sản phẩm (Product List) ---
export const ProductList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" label="ID" />
            
            <FunctionField 
                label="Hình ảnh" 
                render={(record: any) => (
                    <img 
                        src={`${IMAGE_BASE_URL}${record.photo}`} 
                        alt={record.title} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/50?text=No+Img" }} 
                    />
                )} 
            />
            
            <TextField source="title" label="Tên sản phẩm" style={{ fontWeight: 'bold' }} />
            
            {/* [SỬA LỖI 1] Đổi categoryName -> name */}
            <ReferenceField source="categoryId" reference="categories" label="Danh mục">
                <TextField source="name" />
            </ReferenceField>

            <NumberField source="price" label="Giá gốc" options={{ style: 'currency', currency: 'VND' }} />
            
            <NumberField 
                source="price_root" 
                label="Giá Sale" 
                options={{ style: 'currency', currency: 'VND' }}
                sx={{ color: '#d32f2f', fontWeight: 'bold' }} 
            />
            
            <NumberField source="qty" label="Tồn kho" />
            
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

// --- 2. Giao diện Chỉnh sửa sản phẩm (Product Edit) ---
export const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled label="ID" />
            
            <TextInput source="title" label="Tên sản phẩm" fullWidth />
            <TextInput source="slug" label="Slug (URL)" fullWidth />
            
            {/* [SỬA LỖI 1] Đổi optionText="name" để hiện tên danh mục đúng */}
            <ReferenceInput source="categoryId" reference="categories">
                <SelectInput optionText="name" label="Danh mục" fullWidth />
            </ReferenceInput>

            <TextInput source="description" label="Mô tả" fullWidth multiline rows={3} />
            
            {/* Hiển thị ảnh hiện tại */}
            <FunctionField 
                label="Ảnh hiện tại" 
                render={(record: any) => (
                    <div style={{ margin: '10px 0' }}>
                        <img 
                            src={`${IMAGE_BASE_URL}${record.photo}`} 
                            style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
                        />
                    </div>
                )} 
            />
            {/* Update thường không cho chọn lại file ảnh trực tiếp dễ dàng, tạm giữ tên file */}
            <TextInput source="photo" label="Tên file ảnh (String)" fullWidth />
            
            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                <NumberInput source="price" label="Giá gốc" style={{ flex: 1 }} />
                <NumberInput source="price_root" label="Giá Sale" style={{ flex: 1 }} />
                <NumberInput source="qty" label="Số lượng" style={{ flex: 1 }} />
            </div>
        </SimpleForm>
    </Edit>
);

// --- 3. Giao diện Tạo mới sản phẩm (Product Create) ---
export const ProductCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" label="Tên sản phẩm" fullWidth />
            <TextInput source="slug" label="Slug (URL)" fullWidth />
            
            {/* [SỬA LỖI 1] Đổi optionText="name" để dropdown hiển thị tên danh mục */}
            <ReferenceInput source="categoryId" reference="categories">
                <SelectInput optionText="name" label="Danh mục" fullWidth />
            </ReferenceInput>

            <TextInput source="description" label="Mô tả" fullWidth multiline rows={3} />
            
            {/* [SỬA LỖI 2] Thay TextInput bằng ImageInput để chọn file từ máy */}
            <ImageInput source="image" label="Chọn ảnh sản phẩm" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
            
            <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
                <NumberInput source="price" label="Giá gốc" style={{ flex: 1 }} />
                <NumberInput source="price_root" label="Giá Sale (VNĐ)" defaultValue={0} style={{ flex: 1 }} />
                <NumberInput source="qty" label="Số lượng" defaultValue={1} style={{ flex: 1 }} />
            </div>
        </SimpleForm>
    </Create>
);