// import axios from "axios";

// // 🔥 QUAN TRỌNG: Dùng địa chỉ IP thật của máy (lấy từ ipconfig)
// // Không dùng 'localhost' nếu test trên điện thoại/Expo Go.
// // Theo ảnh cmd của bạn, IP là: 10.217.155.87
// const IP_ADDRESS = "10.217.155.87"; 
// const PORT = "8080";

// const httpAxios = axios.create({
//     baseURL: `http://${IP_ADDRESS}:${PORT}/api`, 
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

// export default httpAxios;


import axios from "axios";
import { Platform } from "react-native";

const API_BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:8080/api"      // 🌐 WEB
    : "http://10.217.155.87:8080/api"; // 📱 MOBILE

const httpAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default httpAxios;
