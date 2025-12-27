import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import httpAxios from "../services/httpAxios";
import { getStoredUser } from "../services/auth.service";
import ProductCart from "./components/cart/productcart";
import HeaderBar from "./components/home/HeaderBar";

export default function CartScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  // 🚀 Hàm lấy dữ liệu giỏ hàng từ API
  const fetchCart = async (uid: number) => {
    try {
      console.log("Fetching cart for userId:", uid);
      const res = await httpAxios.get(`/carts/user/${uid}`);
      console.log("API response:", res.data);
      const items = res.data.items || [];
      console.log("Cart items:", items);
      setCartItems(items);

      // 🔥 Tính tổng tiền: Giả sử discount là phần trăm (0-100)
      const total = items.reduce((sum: number, i: any) => {
        const price = Number(i.price) || 0;
        const discountPercent = Number(i.discount) || 0;
        const qty = Number(i.quantity) || 0;
        const finalPrice = price * (1 - discountPercent / 100);
        return sum + finalPrice * qty;
      }, 0);
      setTotalPrice(total);
    } catch (error) {
      console.error("Lỗi fetchCart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const user = await getStoredUser();
      if (user) {
        setUserId(user.id);
        fetchCart(user.id);
      } else {
        router.replace("/(auth)/login");
      }
    };
    init();
  }, [params.ordered]);

  // ➕➖ Cập nhật số lượng qua API
  const updateQty = async (productId: number, delta: number, currentItem: any) => {
    try {
      await httpAxios.post("/carts/add", {
        userId: userId,
        productId,
        quantity: delta,
        productPrice: currentItem.price, // Gửi kèm giá để Backend tính toán
        discount: currentItem.discount,
      });
      if (userId) fetchCart(userId);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật số lượng");
    }
  };

  // 🗑️ Xóa sản phẩm khỏi giỏ
  const removeItem = async (productId: number) => {
    try {
      console.log("Removing item:", productId, "for user:", userId);
      const response = await httpAxios.delete(`/carts/${userId}/remove/${productId}`);
      console.log("Remove response:", response);
      if (userId) fetchCart(userId);
    } catch (error) {
      console.error("Lỗi removeItem:", error);
      Alert.alert("Lỗi", "Không thể xóa sản phẩm");
    }
  };

  return (
    <LinearGradient colors={["#FF9A9E", "#FAD0C4", "#FBC2EB"]} style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <HeaderBar
          placeholder="Giỏ hàng của bạn"
          search=""
          setSearch={() => { }}
          onMenuPress={() => router.back()}
        />

        <Text style={styles.title}>🛒 Giỏ hàng của bạn</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#FF1493" style={{ marginTop: 50 }} />
        ) : (
          <>
            {cartItems.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Giỏ hàng đang trống 🛍️</Text>
                <TouchableOpacity
                  style={styles.backShopBtn}
                  onPress={() => router.push("/product")}
                >
                  <Text style={styles.backShopText}>Tiếp tục mua sắm</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {cartItems.map((item) => (
                  <ProductCart
                    key={item.productId}
                    item={item}
                    quantity={item.quantity}
                    onIncrease={() => updateQty(item.productId, 1, item)}
                    onDecrease={() => item.quantity > 1 && updateQty(item.productId, -1, item)}
                    onRemove={() => removeItem(item.productId)}
                  />
                ))}

                <View style={styles.summaryBox}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.summaryLabel}>Tổng thanh toán</Text>
                    <Text style={styles.summaryPrice}>
                      {totalPrice.toLocaleString("vi-VN")}đ
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={() => router.push("/checkout")}
                  >
                    <Text style={styles.checkoutText}>Thanh toán</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 15 },
  title: { marginTop: 20, fontSize: 24, fontWeight: "700", color: "#333" },
  emptyBox: { marginTop: 50, alignItems: "center", backgroundColor: "#fff", padding: 30, borderRadius: 20 },
  emptyText: { fontSize: 18, color: "#666", marginBottom: 20 },
  backShopBtn: { backgroundColor: "#FF1493", padding: 12, borderRadius: 20 },
  backShopText: { color: "#fff", fontWeight: "600" },
  summaryBox: { marginTop: 30, backgroundColor: "#fff", padding: 20, borderRadius: 20, marginBottom: 40 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  summaryLabel: { fontSize: 18, color: "#666" },
  summaryPrice: { fontSize: 22, fontWeight: "800", color: "#FF1493" },
  checkoutBtn: { backgroundColor: "#FF1493", paddingVertical: 15, borderRadius: 15, alignItems: "center" },
  checkoutText: { color: "#fff", fontWeight: "700", fontSize: 18 },
});