import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import HeaderBar from "./components/home/HeaderBar";
import SearchResult from "./components/search/SearchResult";
import httpAxios from "../services/httpAxios";

// 1. Hàm loại bỏ dấu tiếng Việt để tìm kiếm chính xác
const removeVietnameseTones = (str) => {
  if (!str) return "";
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  // Loại bỏ dấu phụ và các ký tự đặc biệt
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); 
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); 
  return str.trim();
};

// ... (Các phần import và hàm removeVietnameseTones giữ nguyên)

// ... (Hàm removeVietnameseTones giữ nguyên)

export default function SearchScreen() {
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    httpAxios.get("/products")
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.log(err));
  }, []);

  const filtered = products.filter((item) => {
    if (!item || !keyword.trim()) return false;
    
    // Tìm kiếm dựa trên cột 'title' từ database
    const productName = item.title || ""; 
    
    return removeVietnameseTones(productName)
      .includes(removeVietnameseTones(keyword));
  });

  return (
    <LinearGradient colors={["#FFE9EE", "#FFF5F7", "#FFFFFF"]} style={{ flex: 1 }}>
      <HeaderBar search={keyword} setSearch={setKeyword} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {keyword.trim() === "" ? (
          <Text style={styles.hint}>🔍 Nhập tên sản phẩm để tìm kiếm</Text>
        ) : filtered.length === 0 ? (
          <Text style={styles.hint}>❌ Không tìm thấy: "{keyword}"</Text>
        ) : (
          filtered.map((item) => (
            <SearchResult key={item.id} item={item} />
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

// ... styles giữ nguyên

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  hint: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
    fontSize: 16,
    lineHeight: 24,
  },
  emptyBox: {
    paddingHorizontal: 20,
  }
});