import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import httpAxios from "../../services/httpAxios";
import { globalFavorites } from "../globalState"; // Import kho lưu trữ

export default function FavoriteScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);
  const baseUrl = httpAxios.defaults.baseURL?.replace('/api', '') || 'http://localhost:8080';

  // Lấy dữ liệu từ kho mỗi khi màn hình này được mở
  useEffect(() => {
    setFavorites([...globalFavorites]);
  }, []);

  const removeItem = (id: number) => {
    const index = globalFavorites.findIndex(item => item.id === id);
    if (index > -1) {
      globalFavorites.splice(index, 1); // Xóa trong kho gốc
    }
    setFavorites([...globalFavorites]); // Cập nhật lại giao diện
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#FF1493" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sản phẩm yêu thích</Text>
        <AntDesign name="heart" size={22} color="#FF1493" />
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="heart-outline" size={80} color="#FF9ACD" />
          <Text style={styles.emptyText}>Bạn chưa thích món nào</Text>
          <TouchableOpacity style={styles.exploreBtn} onPress={() => router.push("/(home)/product")}>
            <Text style={styles.exploreText}>Đi mua sắm ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: `${baseUrl}/images/${item.photo}` }} style={styles.img} />
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.price}>{Number(item.price).toLocaleString()}đ</Text>
              </View>
              <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.id)}>
                <Feather name="trash-2" size={20} color="#FF3B96" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F7" },
  header: { flexDirection: "row", alignItems: "center", paddingTop: 50, paddingBottom: 15, paddingHorizontal: 16, backgroundColor: "#fff", elevation: 3 },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "700", color: "#333" },
  card: { flexDirection: "row", backgroundColor: "#fff", marginTop: 12, marginHorizontal: 16, borderRadius: 15, padding: 12, alignItems: "center", elevation: 2 },
  img: { width: 70, height: 70, borderRadius: 10 },
  info: { flex: 1, marginLeft: 15 },
  name: { fontSize: 15, fontWeight: "600", color: "#333" },
  price: { fontSize: 14, fontWeight: "700", color: "#FF3B96", marginTop: 4 },
  removeBtn: { padding: 10 },
  emptyBox: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { marginTop: 15, fontSize: 16, color: "#888" },
  exploreBtn: { marginTop: 20, backgroundColor: "#FF1493", paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25 },
  exploreText: { color: "#fff", fontWeight: "600" },
});