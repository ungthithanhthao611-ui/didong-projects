import {
    List,
    Datagrid,
    TextField,
    EditButton,
    DeleteButton,
    Edit,
    SimpleForm,
    TextInput,
    Create,
} from "react-admin";

// 1. Giao diện Danh sách (List)
export const CategoryList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            
            {/* [SỬA LỖI] categoryName -> name (cho khớp với code Java) */}
            <TextField source="name" label="Tên danh mục" />
            
            <TextField source="slug" label="Slug (URL)" />
            
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

// 2. Giao diện Chỉnh sửa (Edit)
export const CategoryEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            
            {/* [SỬA LỖI] categoryName -> name */}
            <TextInput source="name" label="Tên danh mục" fullWidth />
            <TextInput source="slug" label="Slug (URL)" fullWidth />
        </SimpleForm>
    </Edit>
);

// 3. Giao diện Tạo mới (Create)
export const CategoryCreate = () => (
    <Create>
        <SimpleForm>
            {/* [SỬA LỖI] categoryName -> name */}
            <TextInput source="name" label="Tên danh mục" fullWidth />
            <TextInput source="slug" label="Slug (URL)" fullWidth />
        </SimpleForm>
    </Create>
);