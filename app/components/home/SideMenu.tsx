import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import httpAxios from "../../../services/httpAxios";

const { width } = Dimensions.get("window");
const MENU_WIDTH = width * 0.72;

type Category = {
  id: number | null;
  name: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (category: Category) => void;
};

export default function SideMenu({ visible, onClose, onSelectCategory }: Props) {
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const slide = useRef(new Animated.Value(-MENU_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      httpAxios
        .get("/categories")
        .then((res) => setDbCategories(res.data || []))
        .catch((err) => console.log("❌ Lỗi tải danh mục:", err));

      Animated.timing(slide, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slide, {
        toValue: -MENU_WIDTH,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <>
      {visible && (
        <TouchableOpacity
          activeOpacity={1}
          style={styles.overlay}
          onPress={onClose}
        />
      )}

      <Animated.View style={[styles.menu, { transform: [{ translateX: slide }] }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Danh mục</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={22} color="#999" />
          </TouchableOpacity>
        </View>

        {/* 🔥 TẤT CẢ */}
        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            onSelectCategory({ id: null, name: "Tất cả" })
          }
        >
          <View style={styles.iconBox}>
            <Feather name="grid" size={18} color="#FF5A9E" />
          </View>
          <Text style={styles.itemText}>Tất cả sản phẩm</Text>
        </TouchableOpacity>

        {/* 📂 DANH MỤC DB */}
        {dbCategories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.item}
            onPress={() =>
              onSelectCategory({
                id: item.id,
                name: item.name || item.tenDanhMuc,
              })
            }
          >
            <View style={styles.iconBox}>
              <Feather name="tag" size={18} color="#FF5A9E" />
            </View>
            <Text style={styles.itemText}>
              {item.name || item.tenDanhMuc}
            </Text>
            <Feather name="chevron-right" size={18} color="#CCC" />
          </TouchableOpacity>
        ))}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 9,
  },
  menu: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    width: MENU_WIDTH,
    backgroundColor: "#FFF",
    paddingTop: 60,
    paddingHorizontal: 18,
    zIndex: 10,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: { fontSize: 22, fontWeight: "900", color: "#FF5A9E" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: "#FFF6FA",
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFE3EE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemText: { flex: 1, fontSize: 16, fontWeight: "700", color: "#333" },
});
