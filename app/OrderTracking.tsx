import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";

/* ===== STATUS FLOW (MAP API SAU NÀY) ===== */
const STATUS_FLOW = [
  { key: "CREATED", label: "Đã đặt hàng" },
  { key: "CONFIRMED", label: "Cửa hàng xác nhận" },
  { key: "PREPARING", label: "Đang chuẩn bị" },
  { key: "DELIVERING", label: "Đang giao hàng" },
  { key: "COMPLETED", label: "Hoàn tất" },
];

export default function OrderTracking() {
  const router = useRouter();

  const [orderCode, setOrderCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [orderTime, setOrderTime] = useState<string | null>(null);

  /* ===== MOCK TRACKING (SAU NÀY GỌI API ORDER) ===== */
  const handleTracking = () => {
    if (!orderCode) return;

    /**
     * SAU NÀY:
     * const res = await fetch(`/api/orders/${orderCode}`)
     * setStatus(res.status)
     * setOrderTime(res.createdAt)
     */

    // MOCK DATA
    setStatus("DELIVERING");
    setOrderTime("2025-01-10T14:20:00");
  };

  /* ===== FORMAT TIME ===== */
  const formatTime = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${d
      .getHours()
      .toString()
      .padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")} - ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ===== TOP NAV (BACK TO SUPPORT) ===== */}
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={26} color="#333" />
        </TouchableOpacity>

        <Text style={styles.navTitle}>Theo dõi đơn hàng</Text>
      </View>

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <Ionicons name="cube-outline" size={42} color="#FF5A9E" />
        <Text style={styles.subtitle}>
          Nhập mã đơn để kiểm tra trạng thái đơn hàng của bạn
        </Text>
      </View>

      {/* ===== INPUT ===== */}
      <View style={styles.trackBox}>
        <TextInput
          style={styles.input}
          placeholder="Nhập mã đơn hàng (VD: 2222)"
          value={orderCode}
          onChangeText={setOrderCode}
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[styles.button, !orderCode && { opacity: 0.6 }]}
          disabled={!orderCode}
          onPress={handleTracking}
        >
          <Text style={styles.buttonText}>Theo dõi</Text>
        </TouchableOpacity>
      </View>

      {/* ===== RESULT ===== */}
      {status && (
        <View style={styles.resultBox}>
          <Text style={styles.orderTitle}>
            📦 Đơn hàng: {orderCode}
          </Text>

          {orderTime && (
            <Text style={styles.orderTime}>
              ⏰ Thời gian đặt: {formatTime(orderTime)}
            </Text>
          )}

          <View style={styles.timeline}>
            {STATUS_FLOW.map((item, index) => {
              const activeIndex = STATUS_FLOW.findIndex(
                (s) => s.key === status
              );
              const isActive = activeIndex >= index;

              return (
                <View key={item.key} style={styles.timelineItem}>
                  <View
                    style={[
                      styles.dot,
                      isActive && styles.dotActive,
                    ]}
                  />
                  <Text
                    style={[
                      styles.timelineText,
                      isActive && styles.textActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF3F8",
  },

  /* TOP NAV */
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: "#FFF3F8",
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  navTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
    marginLeft: 12,
  },

  /* HEADER */
  header: {
    padding: 22,
    backgroundColor: "#FFE4EC",
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },

  /* INPUT */
  trackBox: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
  },

  input: {
    height: 46,
    borderRadius: 16,
    backgroundColor: "#FFF1F5",
    paddingHorizontal: 14,
    fontSize: 15,
  },

  button: {
    marginTop: 14,
    backgroundColor: "#FF5A9E",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  /* RESULT */
  resultBox: {
    marginTop: 26,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
  },

  orderTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#333",
  },

  orderTime: {
    marginTop: 6,
    fontSize: 13,
    color: "#777",
  },

  timeline: {
    marginTop: 16,
  },

  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#DDD",
    marginRight: 12,
  },

  dotActive: {
    backgroundColor: "#FF5A9E",
  },

  timelineText: {
    fontSize: 14,
    color: "#999",
  },

  textActive: {
    color: "#333",
    fontWeight: "700",
  },
});
