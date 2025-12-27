import { AntDesign, Feather } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import httpAxios from "../../../services/httpAxios";

interface CartProps {
  item: any;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function ProductCart({ item, quantity, onIncrease, onDecrease, onRemove }: CartProps) {
  if (!item) return null;

  // Xử lý URL ảnh từ Backend Spring Boot
  const baseUrl = httpAxios.defaults.baseURL?.replace("/api", "") || "";
  const imageUrl = item.photo
    ? `${baseUrl}/images/${item.photo}`
    : "https://via.placeholder.com/150";

  // Tính giá sau khi giảm (giả sử discount là phần trăm)
  const discountPercent = Number(item.discount) || 0;
  const finalPrice = Number(item.price) * (1 - discountPercent / 100);

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.img} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.price}>{finalPrice.toLocaleString("vi-VN")}đ</Text>
        
        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={onDecrease} style={styles.qtyBtn}>
            <AntDesign name="minus" size={16} color="#555" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity onPress={onIncrease} style={styles.qtyBtn}>
            <AntDesign name="plus" size={16} color="#555" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={onRemove} style={styles.trashBtn}>
        <Feather name="trash-2" size={22} color="#FF3B3B" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 18,
    marginTop: 15,
    alignItems: "center",
    elevation: 3,
  },
  img: { width: 80, height: 80, borderRadius: 12, marginRight: 15 },
  name: { fontSize: 16, fontWeight: "600", color: "#333" },
  price: { marginTop: 6, color: "#FF1493", fontSize: 16, fontWeight: "700" },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  qtyBtn: { backgroundColor: "#f2f2f2", padding: 6, borderRadius: 8 },
  qtyText: { fontSize: 16, fontWeight: "700", marginHorizontal: 12 },
  trashBtn: { padding: 5 },
});