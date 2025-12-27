import {
  List,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
} from "react-admin";

export const UserList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="role" />
      <EditButton />
    </Datagrid>
  </List>
);

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" disabled />
      <TextInput source="email" disabled />
      <SelectInput
        source="role"
        choices={[
          { id: "USER", name: "USER" },
          { id: "ADMIN", name: "ADMIN" },
        ]}
      />
    </SimpleForm>
  </Edit>
);
