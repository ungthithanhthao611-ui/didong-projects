import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import httpAxios from "../../services/httpAxios";
import { getStoredUser } from "../../services/auth.service";

export default function OrdersCancel() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCancelledOrders = async () => {
    try {
      const user = await getStoredUser();
      if (!user) {
        router.replace("/(auth)/login");
        return;
      }
      // Gọi API lấy đơn hàng với trạng thái CANCELLED
      const res = await httpAxios.get(`/orders/user/${user.id}`, {
        params: { status: "CANCELLED" }
      });
      setOrders(res.data || []);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng đã huỷ:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCancelledOrders();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCancelledOrders(); }} />
      }
    >
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#E57373" />
        </TouchableOpacity>

        <Text style={styles.title}>Đơn đã huỷ</Text>

        <View style={{ width: 22 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E57373" style={{ marginTop: 50 }} />
      ) : (
        <>
          {/* ===== ORDER LIST ===== */}
          {orders.map((o) => (
            <View key={o.orderId} style={styles.card}>
              {/* TOP ROW */}
              <View style={styles.cardHeader}>
                <View style={styles.statusRow}>
                  <Feather name="x-circle" size={16} color="#E57373" />
                  <Text style={styles.statusText}>Đã huỷ</Text>
                </View>

                <Text style={styles.orderId}>#{o.orderId}</Text>
              </View>

              {/* INFO */}
              <Text style={styles.text}>📅 Ngày đặt: {o.orderDate}</Text>
              <Text style={styles.price}>
                Tổng tiền: {o.totalAmount?.toLocaleString()}đ
              </Text>

              {/* ACTION */}
              <TouchableOpacity style={styles.detailBtn} onPress={() => router.push({ pathname: "/(auth)/orders", params: { highlight: o.orderId } })}>
                <Text style={styles.detailText}>Xem chi tiết</Text>
                <Feather name="chevron-right" size={18} color="#E57373" />
              </TouchableOpacity>
            </View>
          ))}

          {/* ===== EMPTY STATE ===== */}
          {orders.length === 0 && (
            <View style={styles.emptyBox}>
              <Feather name="slash" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Không có đơn hàng bị huỷ</Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#444",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FDE2E2",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#E57373",
  },
  orderId: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  text: {
    marginTop: 6,
    fontSize: 14,
    color: "#666",
  },
  price: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: "700",
    color: "#E57373",
  },
  detailBtn: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E57373",
  },
  emptyBox: {
    marginTop: 80,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#999",
  },
});
