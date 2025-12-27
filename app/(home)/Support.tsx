import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

const SUPPORT_PHONE = "19001234"; // SĐT ảo – dùng cho đồ án

export default function Support() {
  const router = useRouter();
  const [showCall, setShowCall] = useState(false);

  const handleCall = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE}`);
    setShowCall(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <Ionicons name="headset-outline" size={44} color="#FF5A9E" />
        <Text style={styles.title}>Trung tâm hỗ trợ</Text>
        <Text style={styles.subtitle}>
          Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc 💖
        </Text>
      </View>

      {/* ===== ORDER TRACKING ENTRY ===== */}
      <TouchableOpacity
        style={styles.trackEntry}
        onPress={() => router.push("/OrderTracking")}
      >
        <Ionicons name="cube-outline" size={26} color="#FF5A9E" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.trackTitle}>Theo dõi đơn hàng</Text>
          <Text style={styles.trackDesc}>
            Kiểm tra trạng thái đơn hàng của bạn
          </Text>
        </View>
      </TouchableOpacity>

      {/* ===== FAQ ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Câu hỏi thường gặp</Text>

        {FAQ_DATA.map((item, index) => (
          <View key={index} style={styles.faqItem}>
            <View style={styles.faqIcon}>
              <Ionicons name={item.icon} size={18} color="#FF5A9E" />
            </View>
            <View style={styles.faqContent}>
              <Text style={styles.question}>{item.q}</Text>
              <Text style={styles.answer}>{item.a}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* ===== CONTACT SUPPORT ===== */}
      <View style={styles.contactBox}>
        <Ionicons name="call-outline" size={36} color="#FF5A9E" />
        <Text style={styles.contactTitle}>Liên hệ hỗ trợ</Text>
        <Text style={styles.contactDesc}>
          Tổng đài hỗ trợ khách hàng hoạt động{"\n"}
          từ 8:00 – 22:00 mỗi ngày
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowCall(true)}
        >
          <Text style={styles.buttonText}>Gọi tổng đài</Text>
        </TouchableOpacity>
      </View>

      {/* ===== CALL MODAL ===== */}
      <Modal
        visible={showCall}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCall(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons name="call" size={36} color="#FF5A9E" />
            <Text style={styles.modalTitle}>Gọi hỗ trợ Sweetness</Text>
            <Text style={styles.modalPhone}>{SUPPORT_PHONE}</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setShowCall(false)}
              >
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.callBtn]}
                onPress={handleCall}
              >
                <Text style={styles.callText}>Gọi ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

/* ===== FAQ DATA ===== */
const FAQ_DATA = [
  {
    icon: "cart-outline",
    q: "Làm thế nào để đặt hàng?",
    a: "Bạn có thể chọn sản phẩm, thêm vào giỏ hàng và xác nhận đặt hàng trực tiếp trên ứng dụng.",
  },
  {
    icon: "time-outline",
    q: "Thời gian giao hàng dự kiến?",
    a: "Đơn hàng thường được giao trong vòng 30–60 phút tùy khu vực.",
  },
  {
    icon: "close-circle-outline",
    q: "Tôi có thể hủy đơn không?",
    a: "Bạn có thể hủy đơn trước khi cửa hàng xác nhận xử lý đơn hàng.",
  },
  {
    icon: "card-outline",
    q: "Ứng dụng hỗ trợ thanh toán gì?",
    a: "Hiện tại hỗ trợ thanh toán khi nhận hàng và các ví điện tử phổ biến.",
  },
];

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7FB",
  },

  header: {
    padding: 28,
    backgroundColor: "#FFE4EC",
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#333",
    marginTop: 8,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },

  trackEntry: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    elevation: 4,
  },

  trackTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#333",
  },

  trackDesc: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  section: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
    color: "#333",
  },

  faqItem: {
    flexDirection: "row",
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    elevation: 2,
  },

  faqIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFF1F5",
    alignItems: "center",
    justifyContent: "center",
  },

  faqContent: {
    marginLeft: 12,
    flex: 1,
  },

  question: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },

  answer: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    lineHeight: 20,
  },

  contactBox: {
    marginTop: 36,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    alignItems: "center",
    elevation: 4,
  },

  contactTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FF5A9E",
    marginTop: 10,
  },

  contactDesc: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginVertical: 10,
    lineHeight: 20,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#FF5A9E",
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 22,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 10,
    color: "#333",
  },

  modalPhone: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FF5A9E",
    marginVertical: 12,
  },

  modalActions: {
    flexDirection: "row",
    marginTop: 10,
  },

  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 18,
    marginHorizontal: 6,
  },

  cancelBtn: {
    backgroundColor: "#EEE",
  },

  callBtn: {
    backgroundColor: "#FF5A9E",
  },

  cancelText: {
    color: "#555",
    fontWeight: "700",
  },

  callText: {
    color: "#fff",
    fontWeight: "800",
  },
});
