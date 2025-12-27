import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getStoredUser, UserInfo } from "../../../services/auth.service";

// ========================================
// TYPES
// ========================================
type HeaderBarProps = {
  placeholder?: string;
  onMenuPress?: () => void;
  search?: string;
  setSearch?: (t: string) => void;
};

// ========================================
// COMPONENT CHÍNH
// ========================================
export default function HeaderBar({
  placeholder = "Search Here!",
  onMenuPress,
  search = "",
  setSearch,
}: HeaderBarProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);

  // Load user info
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await getStoredUser();
      setUser(storedUser);
    } catch (error) {
      console.log("Could not load user:", error);
    }
  };

  const goToSearch = () => {
    if (!setSearch) {
      router.push("/search");
    }
  };

  return (
    <View style={styles.container}>
      {/* MENU */}
      <TouchableOpacity onPress={onMenuPress}>
        <Feather name="menu" size={28} color="#FF5A9E" />
      </TouchableOpacity>

      {/* SEARCH */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          style={styles.input}
          editable={!!setSearch}
          onFocus={goToSearch}
        />
        <TouchableOpacity onPress={goToSearch}>
          <Feather name="search" size={18} color="#FF5A9E" />
        </TouchableOpacity>
      </View>

      {/* PROFILE - Hiển thị avatar/tên user nếu đã đăng nhập */}
      <TouchableOpacity
        onPress={() => router.push("/(auth)/profile")}
        style={styles.profileButton}
      >
        {user ? (
          <View style={styles.userBadge}>
            <Image
              source={require("../../../assets/images/bunny.jpg")}
              style={styles.miniAvatar}
            />
          </View>
        ) : (
          <Feather name="user" size={26} color="#FF5A9E" />
        )}
      </TouchableOpacity>

      {/* CART */}
      <TouchableOpacity
        onPress={() => router.push("/cart")}
        style={styles.iconButton}
      >
        <Feather name="shopping-bag" size={26} color="#FF5A9E" />
      </TouchableOpacity>
    </View>
  );
}

// ========================================
// STYLES
// ========================================
const styles = StyleSheet.create({
  container: {
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#FFD1E1",
    paddingHorizontal: 14,
    height: 42,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  input: {
    flex: 1,
    color: "#333",
    fontSize: 14,
    paddingVertical: 0,
  },

  iconButton: {
    marginLeft: 10,
  },

  profileButton: {
    marginLeft: 10,
  },

  userBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFE4E9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FF5A9E",
  },

  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
