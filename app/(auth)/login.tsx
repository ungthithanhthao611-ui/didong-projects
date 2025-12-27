import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import { login as loginService } from "../../services/auth.service";

export default function LoginScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // 🔔 TOAST STATE
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastAnim = useRef(new Animated.Value(-100)).current;

  // 🎬 Toast Animation
  useEffect(() => {
    if (showToast) {
      // Slide in
      Animated.spring(toastAnim, {
        toValue: 50,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      // Slide out
      Animated.timing(toastAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showToast]);

  // ===============================
  // HANDLE LOGIN
  // ===============================
  const handleLogin = async () => {
    const { email, password } = formData;

    if (!email.trim() || !password.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập email và mật khẩu");
      return;
    }

    setIsLoading(true);

    try {
      console.log("📤 Đang đăng nhập...");

      const response = await loginService(email, password);

      console.log("✅ Đăng nhập thành công:", response.user.name);

      // 🔔 HIỂN THỊ TOAST THÀNH CÔNG
      setToastMessage(`🎉 Đăng nhập thành công! Xin chào ${response.user.name}`);
      setShowToast(true);

      // ⏱️ TỰ ĐỘNG CHUYỂN VÀO HOME SAU 1.5 GIÂY
      setTimeout(() => {
        setShowToast(false);
        router.replace("/(home)/home");
      }, 1500);

    } catch (err: any) {
      console.error("❌ Login error:", err.message);
      Alert.alert("❌ Lỗi", err.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ===============================
  // UI
  // ===============================
  return (
    <LinearGradient
      colors={["#FF9A9E", "#FAD0C4", "#FBC2EB"]}
      style={styles.container}
    >
      {/* LOGO */}
      <View style={styles.topSection}>
        <Image
          source={require("../../assets/images/bunny.jpg")}
          style={styles.bunnyIcon}
        />
        <Text style={styles.title}>Sweetness</Text>
        <Text style={styles.subTitle}>Always give delicious food</Text>
      </View>

      {/* FORM */}
      <View style={styles.inputBox}>
        {/* EMAIL */}
        <View style={styles.inputWrapper}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="email" size={20} color="#FF1493" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#fff"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => updateFormField("email", text)}
            editable={!isLoading}
          />
        </View>

        {/* PASSWORD */}
        <View style={styles.inputWrapper}>
          <View style={styles.iconCircle}>
            <Entypo name="lock" size={20} color="#FF1493" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#fff"
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => updateFormField("password", text)}
            editable={!isLoading}
          />
        </View>
      </View>

      {/* LOGIN BUTTON */}
      <TouchableOpacity
        style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FF1493" />
        ) : (
          <Text style={styles.loginText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* 🔔 TOAST NOTIFICATION */}
      {showToast && (
        <Animated.View
          style={[
            styles.toast,
            { transform: [{ translateY: toastAnim }] },
          ]}
        >
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}
    </LinearGradient>
  );
}

// ===============================
// STYLES
// ===============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 35,
    justifyContent: "center",
  },
  topSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  bunnyIcon: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subTitle: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  inputBox: {
    width: "100%",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#fff",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
  },
  loginBtn: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginText: {
    color: "#FF1493",
    fontSize: 16,
    fontWeight: "bold",
  },

  // 🔔 TOAST STYLES
  toast: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 999,
  },
  toastText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
