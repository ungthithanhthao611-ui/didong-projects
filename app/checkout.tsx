import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from "react-native";
import httpAxios from "../services/httpAxios";
import { getStoredUser, UserInfo } from "../services/auth.service";

export default function CheckoutScreen() {
  const router = useRouter();

  // State quản lý
  const [loading, setLoading] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);

  const shipping = 15000;
  const grandTotal = subTotal + shipping;

  const [payment, setPayment] = useState<"COD" | "MOMO">("COD");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // 1. Lấy dữ liệu giỏ hàng để hiển thị
  const fetchCheckoutData = async (uid: number) => {
    try {
      console.log("Fetching cart for checkout, userId:", uid);
      const res = await httpAxios.get(`/carts/user/${uid}`);
      const items = res.data.items || [];
      setCartItems(items);

      // Tính lại tổng tiền từ items
      const total = items.reduce((sum: number, i: any) => {
        const price = Number(i.price) || 0;
        const discountPercent = Number(i.discount) || 0; // Backend trả về %
        const qty = Number(i.quantity) || 0;
        const finalPrice = price * (1 - discountPercent / 100);
        return sum + (finalPrice * qty);
      }, 0);

      setSubTotal(total);
    } catch (error) {
      console.error("fetchCheckoutData Error:", error);
      Alert.alert("Lỗi", "Không thể tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const user = await getStoredUser();
      if (user) {
        setUserId(user.id);
        setCustomerInfo(prev => ({ ...prev, name: user.name }));
        fetchCheckoutData(user.id);
      } else {
        router.replace("/(auth)/login");
      }
    };
    init();
  }, []);

  // 2. Logic Lưu Order và thông báo
  const handleOrder = async () => {
    console.log("Button Pressed - Starting handleOrder");
    console.log("Customer Info:", customerInfo);

    // Kiểm tra validation
    if (!customerInfo.name.trim() || !customerInfo.phone.trim() || !customerInfo.address.trim()) {
      Alert.alert("⚠️ Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin nhận hàng.");
      return;
    }

    try {
      setIsOrdering(true);

      // Dữ liệu gửi lên API (Chỉ gửi các thông tin cần thiết nhất)
      const orderData = {
        userId: userId,
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        payment_method: payment
      };

      // GỌI API LƯU ĐƠN HÀNG
      const res = await httpAxios.post("/orders/checkout", orderData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("API Response:", res.data, res.status);

      if (res.data === "ORDER_SUCCESS" || res.status === 200 || res.status === 201) {
        console.log("Order Successful, navigating to order success splash");
        // Chuyển hướng sang trang chúc mừng thành công
        router.replace("/(auth)/orders_success");
      }
    } catch (error: any) {
      console.error("Lỗi đặt hàng chi tiết:", error.response?.data || error.message);
      Alert.alert("Lỗi", "Đặt hàng thất bại: " + (error.response?.data || error.message));
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00BFA5" />
        <Text style={{ marginTop: 10, color: '#666' }}>Đang tải thông tin...</Text>
      </View>
    );
  }

  const baseUrl = httpAxios.defaults.baseURL?.replace('/api', '') || '';

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <AntDesign name="left" size={20} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Xác nhận thanh toán</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* 📦 Đơn hàng */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sản phẩm đã chọn</Text>
            {cartItems.map((item, index) => (
              <View key={index} style={styles.productCard}>
                <Image
                  source={{ uri: item.photo ? `${baseUrl}/images/${item.photo}` : "https://via.placeholder.com/150" }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.productQty}>Số lượng: {item.quantity}</Text>
                  <Text style={styles.productPrice}>{(item.price * item.quantity).toLocaleString()}đ</Text>
                </View>
              </View>
            ))}
          </View>

          {/* 👤 Nhập thông tin khách hàng */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin nhận hàng</Text>
            <View style={styles.inputBox}>
              <Feather name="user" size={18} color="#00BFA5" />
              <TextInput
                style={styles.input}
                placeholder="Họ tên người nhận"
                value={customerInfo.name}
                onChangeText={(t) => setCustomerInfo({ ...customerInfo, name: t })}
              />
            </View>
            <View style={styles.inputBox}>
              <Feather name="phone" size={18} color="#00BFA5" />
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại liên hệ"
                keyboardType="phone-pad"
                value={customerInfo.phone}
                onChangeText={(t) => setCustomerInfo({ ...customerInfo, phone: t })}
              />
            </View>
            <View style={[styles.inputBox, { alignItems: 'flex-start', paddingTop: 12 }]}>
              <Feather name="map-pin" size={18} color="#00BFA5" />
              <TextInput
                style={[styles.input, { minHeight: 60, textAlignVertical: 'top' }]}
                placeholder="Địa chỉ giao hàng đầy đủ"
                multiline
                value={customerInfo.address}
                onChangeText={(t) => setCustomerInfo({ ...customerInfo, address: t })}
              />
            </View>
          </View>

          {/* 💳 Thanh toán */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
            <TouchableOpacity
              style={[styles.payOption, payment === "COD" && styles.payOptionActive]}
              onPress={() => setPayment("COD")}
            >
              <MaterialCommunityIcons name="truck-check-outline" size={24} color={payment === "COD" ? "#00BFA5" : "#666"} />
              <Text style={[styles.payOptionText, payment === "COD" && styles.activeText]}>Tiền mặt (COD)</Text>
              {payment === "COD" && <AntDesign name="check-circle" size={18} color="#00BFA5" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.payOption, payment === "MOMO" && styles.payOptionActive]}
              onPress={() => setPayment("MOMO")}
            >
              <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png' }} style={{ width: 24, height: 24, borderRadius: 5 }} />
              <Text style={[styles.payOptionText, payment === "MOMO" && styles.activeText]}>Ví MoMo (Sắp ra mắt)</Text>
              {payment === "MOMO" && <AntDesign name="check-circle" size={18} color="#00BFA5" />}
            </TouchableOpacity>
          </View>

          {/* 💰 Tổng tiền */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tạm tính</Text>
              <Text style={styles.summaryValue}>{subTotal.toLocaleString()}đ</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
              <Text style={styles.summaryValue}>{shipping.toLocaleString()}đ</Text>
            </View>
            <View style={styles.dashLine} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Tổng thanh toán</Text>
              <Text style={styles.totalValue}>{grandTotal.toLocaleString()}đ</Text>
            </View>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>

        {/* 🚀 Sticky Footer Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.orderBtn}
            onPress={handleOrder}
            disabled={isOrdering}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#00BFA5", "#009688"]}
              style={styles.gradientBtn}
              {...Platform.select({ web: { pointerEvents: 'none' } as any, default: {} })}
            >
              {isOrdering ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.orderBtnText}>XÁC NHẬN ĐẶT HÀNG</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 50, marginBottom: 20 },
  backBtn: { width: 40, height: 40, backgroundColor: '#fff', borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },

  section: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 15 },

  productCard: { flexDirection: 'row', marginBottom: 15, alignItems: 'center' },
  productImage: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#F9F9F9' },
  productInfo: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 14, fontWeight: '600', color: '#333' },
  productQty: { fontSize: 12, color: '#888', marginTop: 2 },
  productPrice: { fontSize: 14, fontWeight: '700', color: '#00BFA5', marginTop: 2 },

  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 12, paddingHorizontal: 12, marginBottom: 10, borderWidth: 1, borderColor: '#F0F0F0' },
  input: { flex: 1, paddingVertical: 12, marginLeft: 10, fontSize: 14, color: '#333' },

  payOption: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#F0F0F0', marginBottom: 10 },
  payOptionActive: { borderColor: '#00BFA5', backgroundColor: '#F0FFFD' },
  payOptionText: { flex: 1, marginLeft: 12, fontSize: 14, color: '#666' },
  activeText: { color: '#00BFA5', fontWeight: '700' },

  summaryBox: { paddingHorizontal: 5, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#888', fontSize: 14 },
  summaryValue: { color: '#333', fontSize: 14, fontWeight: '600' },
  dashLine: { height: 1, backgroundColor: '#EEE', marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  totalValue: { fontSize: 22, fontWeight: '800', color: '#00BFA5' },

  orderBtn: { borderRadius: 16, overflow: 'hidden', elevation: 4, shadowColor: '#00BFA5', shadowOpacity: 0.3, shadowRadius: 10 },
  gradientBtn: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  orderBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -5 }
  }
});