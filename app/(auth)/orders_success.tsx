import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  Dimensions
} from "react-native";

const { width } = Dimensions.get("window");

export default function OrderSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        {/* 🎉 Success Animation Placeholder / Icon */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={["#E8F5E9", "#C8E6C9"]}
            style={styles.iconBg}
          >
            <AntDesign name="check-circle" size={80} color="#4CAF50" />
          </LinearGradient>

          {/* Subtle micro-particles (circles) */}
          <View style={[styles.particle, { top: -10, left: -10, width: 20, height: 20, backgroundColor: '#A5D6A7' }]} />
          <View style={[styles.particle, { bottom: 20, right: -15, width: 15, height: 15, backgroundColor: '#81C784' }]} />
          <View style={[styles.particle, { top: 40, right: -25, width: 10, height: 10, backgroundColor: '#C8E6C9' }]} />
        </View>

        {/* 📝 Success Message */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Đặt hàng thành công!</Text>
          <Text style={styles.subtitle}>
            Cảm ơn bạn đã tin tưởng lựa chọn chúng tôi. Đơn hàng của bạn đang được xử lý và sẽ sớm giao đến bạn.
          </Text>
        </View>

        {/* 📦 Order Summary Card (Visual only) */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Feather name="package" size={20} color="#666" />
            <Text style={styles.infoText}>Trạng thái: <Text style={styles.statusText}>Đang chờ xác nhận</Text></Text>
          </View>
          <View style={styles.dashLine} />
          <View style={styles.infoRow}>
            <Feather name="clock" size={20} color="#666" />
            <Text style={styles.infoText}>Dự kiến giao: <Text style={styles.boldText}>2 - 3 ngày tới</Text></Text>
          </View>
        </View>

        {/* 🚀 Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.replace("/home")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#00BFA5", "#009688"]}
              style={styles.gradientBtn}
            >
              <Text style={styles.primaryBtnText}>TIẾP TỤC MUA SẮM</Text>
              <AntDesign name="arrow-right" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push("/(auth)/orders")}
            activeOpacity={0.6}
          >
            <Text style={styles.secondaryBtnText}>Xem lịch sử đơn hàng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDFD",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  iconContainer: {
    marginBottom: 40,
    position: 'relative',
  },
  iconBg: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.6,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#444",
  },
  statusText: {
    color: '#00BFA5',
    fontWeight: '700',
  },
  boldText: {
    fontWeight: '700',
    color: '#333',
  },
  dashLine: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 15,
  },
  footer: {
    width: '100%',
  },
  primaryBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#00BFA5',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  gradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    paddingVertical: 15,
    alignItems: "center",
  },
  secondaryBtnText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "600",
    textDecorationLine: 'underline',
  },
});
