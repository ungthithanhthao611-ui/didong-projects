import { Admin, Resource, defaultTheme } from "react-admin";

// DataProvider + AuthProvider
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";

// Resources
import { ProductList, ProductEdit, ProductCreate } from "./products";
import { CategoryList, CategoryEdit, CategoryCreate } from "./categories";
import { CartList, CartShow } from "./carts";
import { OrderList, OrderEdit } from "./order";
import { VoucherList, VoucherCreate, VoucherEdit } from "./vouchers";
import { UserList, UserEdit } from "./users";

// Icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PeopleIcon from "@mui/icons-material/People";

// 🌿 THEME
const myTheme = {
  ...defaultTheme,
  palette: {
    mode: "light",
    primary: { main: "#10b981" },
    secondary: { main: "#f97316" },
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: `"Inter","Segoe UI",Roboto,Arial,sans-serif`,
    h6: { fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg,#10b981 0%,#34d399 100%)",
          boxShadow: "0 4px 12px rgba(16,185,129,0.2)",
        },
      },
    },
  },
};

export const App = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    theme={myTheme}
  >
    <Resource
      name="products"
      list={ProductList}
      edit={ProductEdit}
      create={ProductCreate}
      icon={InventoryIcon}
      options={{ label: "Sản phẩm" }}
    />

    <Resource
      name="categories"
      list={CategoryList}
      edit={CategoryEdit}
      create={CategoryCreate}
      icon={CategoryIcon}
      options={{ label: "Danh mục" }}
    />

    <Resource
      name="orders"
      list={OrderList}
      edit={OrderEdit}
      icon={ReceiptLongIcon}
      options={{ label: "Đơn hàng" }}
    />

    <Resource
      name="vouchers"
      list={VoucherList}
      create={VoucherCreate}
      edit={VoucherEdit}
      icon={LocalOfferIcon}
      options={{ label: "Mã giảm giá" }}
    />

    <Resource
      name="carts"
      list={CartList}
      show={CartShow}
      icon={ShoppingCartIcon}
      options={{ label: "Giỏ hàng" }}
    />

    {/* 👤 USER MANAGEMENT */}
    <Resource
      name="users"
      list={UserList}
      edit={UserEdit}
      icon={PeopleIcon}
      options={{ label: "Người dùng" }}
    />
  </Admin>
);
