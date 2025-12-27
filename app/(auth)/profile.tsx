import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Switch,
} from "react-native";
import {
  getStoredUser,
  logout as logoutService,
  UserInfo,
} from "../../services/auth.service";

/* =======================
   PROFILE ITEM
======================= */
interface ProfileItemProps {
  iconName: any;
  label: string;
  value: string;
}

const ProfileItem = ({ iconName, label, value }: ProfileItemProps) => (
  <View style={styles.itemContainer}>
    <Feather name={iconName} size={20} color="#FF6F91" />
    <View style={{ marginLeft: 12, flex: 1 }}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  </View>
);

/* =======================
   SETTING ROW
======================= */
const SettingRow = ({
  icon,
  title,
  subtitle,
  isSwitch = false,
  value,
  onValueChange,
}: any) => (
  <View style={styles.settingRow}>
    <View style={styles.settingIcon}>
      <Feather name={icon} size={18} color="#FF6F91" />
    </View>
    <View style={{ flex: 1, marginLeft: 14 }}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {isSwitch ? (
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#ccc", true: "#FF6F91" }}
        thumbColor="#fff"
      />
    ) : (
      <Feather name="chevron-right" size={20} color="#ccc" />
    )}
  </View>
);

/* =======================
   MAIN SCREEN
======================= */
export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(false);
  const [twoFA, setTwoFA] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await getStoredUser();
      if (!storedUser) {
        router.replace("/(auth)/login");
        return;
      }
      setUser(storedUser);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    } catch {
      Alert.alert("Lỗi", "Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await logoutService();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#FF6F91" />
        <Text style={{ marginTop: 10 }}>Đang tải...</Text>
      </SafeAreaView>
    );
  }

  if (!user) return null;

  const bg = darkMode ? "#1c1c1e" : "#f7f7f7";
  const card = darkMode ? "#2c2c2e" : "#fff";
  const text = darkMode ? "#fff" : "#333";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      {/* HEADER */}
      <View style={[styles.topNav, { backgroundColor: card }]}>
        <TouchableOpacity onPress={() => router.push("/(home)/home")}>
          <Feather name="chevron-left" size={28} color="#FF6F91" />
        </TouchableOpacity>
        <Text style={[styles.topNavTitle, { color: text }]}>
          Hồ sơ cá nhân
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          {/* PROFILE CARD */}
          <View style={[styles.headerCard, { backgroundColor: card }]}>
            <Image
              source={require("../../assets/images/bunny.jpg")}
              style={styles.avatar}
            />
            <Text style={[styles.userName, { color: text }]}>
              {user.name}
            </Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user.role}</Text>
            </View>
          </View>

          {/* QUICK ACTIONS */}
          <View style={styles.quickRow}>
            <Quick icon="heart" label="Yêu thích" onPress={() => router.push("/favorite")} />
            <Quick icon="package" label="Lịch sử" onPress={() => router.push("/(auth)/orders")} />
            <Quick icon="x-circle" label="Đã huỷ" onPress={() => router.push("/orders_cancel")} />
          </View>

          {/* PERSONAL INFO */}
          <View style={[styles.detailsCard, { backgroundColor: card }]}>
            <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
            <ProfileItem iconName="user" label="Họ tên" value={user.name} />
            <ProfileItem iconName="mail" label="Email" value={user.email} />
            <ProfileItem
              iconName="shield"
              label="Vai trò"
              value={user.role === "ADMIN" ? "Quản trị viên" : "Người dùng"}
            />
            <ProfileItem iconName="hash" label="ID tài khoản" value={`#${user.id}`} />
          </View>

          {/* SECURITY */}
          <View style={[styles.detailsCard, { backgroundColor: card }]}>
            <Text style={styles.cardTitle}>Bảo mật</Text>
            <SettingRow icon="lock" title="Đổi mật khẩu" />
            <SettingRow
              icon="shield"
              title="Xác thực 2 lớp (2FA)"
              isSwitch
              value={twoFA}
              onValueChange={setTwoFA}
            />
          </View>

          {/* SETTINGS */}
          <View style={[styles.detailsCard, { backgroundColor: card }]}>
            <Text style={styles.cardTitle}>Cài đặt ứng dụng</Text>
            <SettingRow icon="bell" title="Thông báo" />
            <SettingRow
              icon="moon"
              title="Chế độ tối"
              isSwitch
              value={darkMode}
              onValueChange={setDarkMode}
            />
            <SettingRow icon="globe" title="Ngôn ngữ" subtitle="Tiếng Việt" />
          </View>

          {/* LOGOUT */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Feather name="log-out" size={20} color="#fff" />
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Phiên bản 1.0.2</Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =======================
   QUICK ITEM
======================= */
const Quick = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.quickItem} onPress={onPress}>
    <Feather name={icon} size={22} color="#FF6F91" />
    <Text style={styles.quickText}>{label}</Text>
  </TouchableOpacity>
);

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  container: { padding: 20, paddingBottom: 40 },

  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  topNavTitle: { fontSize: 18, fontWeight: "700" },

  headerCard: {
    alignItems: "center",
    padding: 25,
    borderRadius: 22,
    marginBottom: 20,
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  userName: { fontSize: 22, fontWeight: "800", marginTop: 10 },
  roleBadge: {
    backgroundColor: "#FFE4E9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 6,
  },
  roleText: { color: "#FF6F91", fontWeight: "600" },

  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  quickItem: {
    width: "31%",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },
  quickText: { marginTop: 8, fontWeight: "600" },

  detailsCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    opacity: 0.6,
    marginBottom: 12,
    textTransform: "uppercase",
  },

  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemLabel: { fontSize: 12, color: "#aaa" },
  itemValue: { fontSize: 15, fontWeight: "600" },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FFE4E9",
    justifyContent: "center",
    alignItems: "center",
  },
  settingTitle: { fontSize: 15, fontWeight: "600" },
  settingSubtitle: { fontSize: 12, color: "#999" },

  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "700", marginLeft: 10 },

  version: { textAlign: "center", color: "#aaa", marginTop: 20 },
});
