import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ENDPOINTS } from '../../config/api.config';

// ========================================
// COMPONENT CHÍNH
// ========================================
export default function SignupScreen() {
  const router = useRouter();

  // State quản lý form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // ========================================
  // XỬ LÝ ĐĂNG KÝ
  // ========================================
  const handleRegister = async () => {
    const { username, email, password } = formData;

    // Validate input
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Thông báo", "Email không hợp lệ!");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      Alert.alert("Thông báo", "Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setIsLoading(true);

    try {
      console.log("📤 Đang gửi request tới:", ENDPOINTS.register);

      const response = await fetch(ENDPOINTS.register, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          email: email,
          password: password,
        }),
      });

      console.log("📥 Response status:", response.status);

      // Parse response body
      const data = await response.json();
      console.log("📦 Response data:", data);

      if (response.ok) {
        // Đăng ký thành công
        Alert.alert(
          "🎉 Thành công",
          "Tài khoản đã được tạo!",
          [{ text: "Đăng nhập ngay", onPress: () => router.push("/(auth)/login") }]
        );
      } else {
        // Đăng ký thất bại - hiển thị lỗi từ server
        const errorMessage = data.message || "Đăng ký thất bại. Vui lòng thử lại.";
        Alert.alert("❌ Lỗi", errorMessage);
      }
    } catch (error) {
      console.error("🔥 Network Error:", error.message);
      Alert.alert(
        "⚠️ Lỗi kết nối",
        "Không thể kết nối đến máy chủ.\nVui lòng kiểm tra:\n• Backend đang chạy\n• IP address đúng\n• Cùng mạng WiFi"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ========================================
  // CẬP NHẬT FORM DATA
  // ========================================
  const updateFormField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ========================================
  // RENDER UI
  // ========================================
  return (
    <LinearGradient
      colors={['#FF9A9E', '#FAD0C4', '#FBC2EB']}
      style={styles.container}
    >
      {/* Header Section */}
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/images/bunny.jpg')}
          style={styles.bunnyIcon}
        />
        <Text style={styles.title}>Sweetness</Text>
        <Text style={styles.subTitle}>Always give delicious food</Text>
        <Text style={styles.signUpTitle}>SIGN UP</Text>
      </View>

      {/* Form Section */}
      <View style={styles.inputBox}>
        {/* Username Input */}
        <View style={styles.inputWrapper}>
          <View style={styles.iconCircle}>
            <AntDesign name="user" size={20} color="#FF1493" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#fff"
            value={formData.username}
            onChangeText={(text) => updateFormField('username', text)}
            editable={!isLoading}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputWrapper}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="email" size={20} color="#FF1493" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#fff"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => updateFormField('email', text)}
            editable={!isLoading}
          />
        </View>

        {/* Password Input */}
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
            onChangeText={(text) => updateFormField('password', text)}
            editable={!isLoading}
          />
        </View>
      </View>

      {/* Register Button */}
      <TouchableOpacity
        style={[styles.registerBtn, isLoading && styles.registerBtnDisabled]}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FF1493" />
        ) : (
          <Text style={styles.registerText}>Register</Text>
        )}
      </TouchableOpacity>

      {/* Login Link */}
      <View style={styles.loginRow}>
        <Text style={styles.whiteText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")} disabled={isLoading}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Support Link */}
      <TouchableOpacity disabled={isLoading}>
        <Text style={styles.supportText}>Contact For Support</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

// ========================================
// STYLES
// ========================================
const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    paddingHorizontal: 35,
    justifyContent: 'center'
  },

  // Header
  topSection: {
    alignItems: 'center',
    marginBottom: 40
  },
  bunnyIcon: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff'
  },
  subTitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5
  },
  signUpTitle: {
    marginTop: 30,
    fontSize: 25,
    color: '#fff',
    fontWeight: '600',
    textDecorationLine: 'underline'
  },

  // Form
  inputBox: {
    marginTop: 20,
    width: '100%'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#fff'
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  input: {
    flex: 1,
    color: '#fff'
  },

  // Buttons
  registerBtn: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10
  },
  registerBtnDisabled: {
    opacity: 0.7,
  },
  registerText: {
    color: '#FF1493',
    fontSize: 16,
    fontWeight: 'bold'
  },

  // Links
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15
  },
  whiteText: {
    color: '#fff'
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  supportText: {
    marginTop: 40,
    textAlign: 'center',
    color: '#fff'
  },
});