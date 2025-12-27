import { AntDesign, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState, useEffect } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";

import HeaderBar from "../components/home/HeaderBar";
import httpAxios from "../../services/httpAxios"; // Đảm bảo đúng đường dẫn tới axios config của bạn

export default function ExploreScreen() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Lấy Base URL để hiển thị hình ảnh
  const baseUrl = httpAxios.defaults.baseURL?.replace('/api', '') || 'http://localhost:8080';

  // 2. Gọi API lấy danh sách sản phẩm thực tế
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await httpAxios.get("/products");
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log("❌ Lỗi tải sản phẩm Explore:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 3. Phân loại sản phẩm (Dựa trên dữ liệu thật từ API)
  const bestSeller = products.slice(0, 6); // Lấy 6 món đầu làm bán chạy
  const topRated = products.filter((p) => p.price > 50000); // Ví dụ: Lọc món trên 50k
  const newArrivals = products.slice(-6).reverse(); // Lấy 6 món mới nhất

  /* ===== PRODUCT CARD ===== */
  const ProductCard = ({ item }: { item: any }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
      Animated.spring(scale, { toValue: 1.06, useNativeDriver: true }).start();
    };

    const onPressOut = () => {
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    };

    // Xử lý URL ảnh theo cột 'photo' từ database của bạn
    const imageUrl = item.photo 
      ? `${baseUrl}/images/${item.photo}`
      : "https://via.placeholder.com/150";

    return (
      <Pressable 
        onPressIn={onPressIn} 
        onPressOut={onPressOut}
        onPress={() => router.push({ pathname: "/productDetail", params: { id: item.id } })}
      >
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
          <Image source={{ uri: imageUrl }} style={styles.image} />

          <Text style={styles.name} numberOfLines={1}>
            {item.title || "Không tên"} 
          </Text>

          <Text style={styles.sub} numberOfLines={1}>{item.description || "Món ngon mỗi ngày"}</Text>

          <Text style={styles.price}>{Number(item.price).toLocaleString()}đ</Text>

          <View style={styles.rateRow}>
            <AntDesign name="star" size={14} color="#FFC107" />
            <Text style={styles.rate}>4.9</Text>
          </View>
        </Animated.View>
      </Pressable>
    );
  };

  /* ===== SECTION ===== */
  const Section = ({ title, icon, data }: any) => (
    <View style={{ marginBottom: 30 }}>
      <View style={styles.sectionHeader}>
        <Feather name={icon} size={18} color="#1E88E5" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.length > 0 ? (
          data.map((item: any) => (
            <ProductCard key={item.id} item={item} />
          ))
        ) : (
          <Text style={{ color: '#999', marginLeft: 5 }}>Đang cập nhật...</Text>
        )}
      </ScrollView>
    </View>
  );

  return (
    <LinearGradient
      colors={["#EAF6F6", "#F5FBFB", "#FFFFFF"]}
      style={{ flex: 1 }}
    >
      <HeaderBar
        search={search}
        setSearch={setSearch}
        onProfilePress={() => router.push("/profile")}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1E88E5" />
          <Text style={{ marginTop: 10, color: '#666' }}>Đang tìm món ngon...</Text>
        </View>
      ) : (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Khám phá</Text>
          <Text style={styles.subTitle}>
            Gợi ý món ngon dành riêng cho bạn 🍰
          </Text>

          <Section title="🔥 Bán chạy" icon="trending-up" data={bestSeller} />
          <Section title="⭐ Đánh giá cao" icon="star" data={topRated} />
          <Section title="🆕 Món mới" icon="gift" data={newArrivals} />
          <View style={{ height: 50 }} />
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { paddingLeft: 16, paddingTop: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: "800", color: "#1F2937" },
  subTitle: { fontSize: 14, color: "#4B5563", marginBottom: 24 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1F2937" },
  card: { width: 150, backgroundColor: "#FFFFFF", borderRadius: 18, padding: 12, marginRight: 12, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  image: { height: 90, width: "100%", borderRadius: 14, resizeMode: "cover", marginBottom: 8, backgroundColor: '#f9f9f9' },
  name: { fontSize: 14, fontWeight: "600", color: "#111827" },
  sub: { fontSize: 11, color: "#6B7280", marginTop: 2 },
  price: { fontSize: 15, fontWeight: "700", color: "#1E88E5", marginTop: 4 },
  rateRow: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 4 },
  rate: { fontSize: 12, color: "#374151" },
});