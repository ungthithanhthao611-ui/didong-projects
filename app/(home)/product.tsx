import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";

import HeaderBar from "../components/home/HeaderBar";
import SideMenu from "../components/home/SideMenu";
import ProductCard from "../components/product/ProductCard";
import httpAxios from "../../services/httpAxios";

// Hàm loại bỏ dấu tiếng Việt để tìm kiếm chính xác
const removeVietnameseTones = (str: string) => {
  if (!str) return "";
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); 
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); 
  return str.trim();
};

export default function ProductScreen() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState<{ id: number | null; name: string }>({
    id: null,
    name: "Tất cả",
  });

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await httpAxios.get("/products");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("❌ Lỗi tải sản phẩm:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  // ✅ Logic lọc đã sửa theo database (dùng title và category_id)
  const filteredData = products.filter((item) => {
    if (!item) return false;

    // Tìm kiếm theo cột 'title' thay vì 'name'
    const productName = item.title || ""; 
    const matchesSearch = removeVietnameseTones(productName)
      .includes(removeVietnameseTones(search));

    // Lọc theo danh mục (Sửa categoryId thành category_id nếu lọc ko ra)
    if (category.id === null) return matchesSearch;
    
    const itemCatId = item.category_id || item.categoryId;
    return matchesSearch && itemCatId === category.id;
  });

  return (
    <LinearGradient
      colors={["#EAF6F6", "#F5FBFB", "#FFFFFF"]}
      style={styles.container}
    >
      <HeaderBar
        search={search}
        setSearch={setSearch}
        onMenuPress={() => setMenuOpen(true)}
        onProfilePress={() => router.push("/profile")}
      />

      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelectCategory={(cat) => {
          setCategory(cat);
          setMenuOpen(false);
        }}
      />

      <View style={styles.infoRow}>
        <Text style={styles.categoryLabel}>Danh mục: {category.name}</Text>
        <Text style={styles.countText}>{filteredData.length} sản phẩm</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF1493" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.grid}>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.cardWrapper}
                  onPress={() => router.push({
                    pathname: "/product-details", // <-- Tên file chi tiết của bạn
                    params: { id: item.id }
                  })}
                >
                  <ProductCard product={item} />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  categoryLabel: { fontSize: 16, fontWeight: "700", color: "#1F2937" },
  countText: { fontSize: 13, color: "#666" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%", // Chia 2 cột
    marginBottom: 15,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#555" },
  emptyContainer: { width: "100%", alignItems: "center", marginTop: 50 },
  emptyText: { color: "#888", fontSize: 14, textAlign: 'center' },
});