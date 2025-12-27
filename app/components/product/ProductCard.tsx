import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import httpAxios from "../../../services/httpAxios";
import { globalFavorites } from "../../globalState"; // Import kho lưu trữ

export default function ProductCard({ product }: { product: any }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  
  // Kiểm tra xem sản phẩm này đã nằm trong danh sách yêu thích chưa để hiển thị màu tim
  const isAlreadyLiked = globalFavorites.some(item => item.id === product.id);
  const [liked, setLiked] = useState(isAlreadyLiked);

  const cardWidth = (width - 45) / 2;
  const baseUrl = httpAxios.defaults.baseURL?.replace('/api', '') || 'http://localhost:8080';
  const imageUrl = product?.photo ? `${baseUrl}/images/${product.photo}` : "https://via.placeholder.com/150";

  const toggleLike = () => {
    if (!liked) {
      // Nếu chưa thích -> Thêm vào kho
      if (!globalFavorites.find(item => item.id === product.id)) {
        globalFavorites.push(product);
      }
    } else {
      // Nếu đã thích -> Xóa khỏi kho
      const index = globalFavorites.findIndex(item => item.id === product.id);
      if (index > -1) {
        globalFavorites.splice(index, 1);
      }
    }
    setLiked(!liked); // Chỉ cập nhật trạng thái nút tim tại chỗ
  };

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <TouchableOpacity onPress={() => router.push({ pathname: "/productDetail", params: { id: product.id } })}>
        <View style={styles.imageBox}>
          <Image source={{ uri: imageUrl }} style={styles.img} resizeMode="cover" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.heartBtn} onPress={toggleLike}>
        <Ionicons
          name={liked ? "heart" : "heart-outline"}
          size={20}
          color={liked ? "red" : "#FF1493"}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.price}>{Number(product?.price || 0).toLocaleString()}đ</Text>
        <Text style={styles.title} numberOfLines={1}>{product?.title || "Sản phẩm"}</Text>
        <View style={styles.rateRow}>
          <AntDesign name="star" size={12} color="#FFD700" />
          <Text style={styles.rateText}>4.8</Text> 
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 20, marginBottom: 15, elevation: 4, overflow: 'hidden', position: 'relative' },
  imageBox: { height: 150, width: "100%", backgroundColor: "#FDF2F5" },
  img: { width: "100%", height: "100%" },
  heartBtn: { position: "absolute", top: 10, right: 10, backgroundColor: "rgba(255,255,255,0.9)", padding: 6, borderRadius: 20, zIndex: 10 },
  content: { padding: 10 },
  price: { fontSize: 16, fontWeight: "bold", color: '#FF4D67' },
  title: { fontSize: 14, fontWeight: "700", color: "#333", marginTop: 2 },
  rateRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  rateText: { marginLeft: 4, fontSize: 11, color: "#666" },
});