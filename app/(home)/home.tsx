import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput
} from "react-native";

import HomeHero from "../components/home/HomeHero";
import { productData } from "../components/product/productData";
import { getStoredUser } from "../../services/auth.service";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await getStoredUser();
      if (storedUser) setUser(storedUser);
    } catch (error) {
      console.log("Error loading user:", error);
    }
  };

  /* 🫧 BUBBLE BACKGROUND */
  const bubbleAnim = useRef(
    [...Array(10)].map(() => new Animated.Value(height + 50))
  ).current;

  useEffect(() => {
    bubbleAnim.forEach(anim => {
      Animated.loop(
        Animated.timing(anim, {
          toValue: -50,
          duration: 6000 + Math.random() * 4000,
          useNativeDriver: true
        })
      ).start();
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#E1F5FE" }}>
      <LinearGradient
        colors={["#E1F5FE", "#F0F9FF", "#FFFFFF"]}
        style={{ flex: 1 }}
      >
        {/* BUBBLES */}
        {bubbleAnim.map((anim, i) => (
          <Animated.View
            key={i}
            style={[
              styles.bubble,
              { left: Math.random() * width, transform: [{ translateY: anim }] }
            ]}
          />
        ))}

        {/* HEADER */}
        <View style={styles.headerArea}>
          <Ionicons name="menu-outline" size={32} color="#FF69B4" />
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search here..."
              placeholderTextColor="#C0C0C0"
              style={styles.searchInput}
            />
            <Ionicons name="search-outline" size={20} color="#FF69B4" />
          </View>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.bagIcon}>
            <Feather name="shopping-bag" size={22} color="#FF69B4" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <HomeHero />

          {/* ANNOUNCE */}
          <View style={styles.announce}>
            <Ionicons name="water-outline" size={18} color="#00796B" />
            <Text style={styles.announceText}>
              {" "}
              Giải nhiệt mùa hè cùng bộ sưu tập Fresh & Sweet!
            </Text>
          </View>

          {/* PROMO */}
          <LinearGradient colors={["#0288D1", "#03A9F4"]} style={styles.promoCard}>
            <Text style={styles.promoTag}>💎 SPECIAL OFFER</Text>
            <Text style={styles.promoTitle}>Tươi Mát Mỗi Ngày</Text>
            <Text style={styles.promoDesc}>
              Giảm ngay 20k cho đơn hàng từ 100k
            </Text>
          </LinearGradient>

          {/* FLASH SALE */}
          <View style={styles.flashCard}>
            <View style={styles.flashInfo}>
              <View style={styles.hotDealTag}>
                <Text style={styles.hotDealText}>HOT DEAL</Text>
              </View>
              <Text style={styles.flashTitle}>Combo Giải Nhiệt</Text>
              <Text style={styles.flashSub}>⌛ Kết thúc sau 05:00</Text>
            </View>

            {/* 👉 CHUYỂN SANG TRANG COMBO */}
            <TouchableOpacity
              style={styles.flashBtn}
              onPress={() => router.push("/combo")}
            >
              <Text style={styles.flashBtnText}>Mua ngay</Text>
            </TouchableOpacity>
          </View>

          {/* BRAND */}
          <LinearGradient
            colors={["#4FC3F7", "#29B6F6"]}
            style={styles.brandBox}
          >
            <Text style={styles.brandTitle}>🌊 Sweetness Ocean</Text>
            <Text style={styles.brandDesc}>
              Tận hưởng hương vị thanh khiết từ thiên nhiên
            </Text>
          </LinearGradient>

          {/* PRODUCT */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gợi ý cho bạn</Text>
            <Text style={styles.seeMore}>Xem tất cả</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {productData.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.productItem}
                onPress={() =>
                  router.push({
                    pathname: "/productDetail",
                    params: { id: item.id }
                  })
                }
              >
                <Image source={item.img} style={styles.productImg} />
                <Text style={styles.productName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.productPrice}>{item.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  headerArea: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 25,
    height: 42,
    alignItems: "center",
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#FFC0CB"
  },
  searchInput: { flex: 1, fontSize: 13 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: "#FF69B4"
  },
  bagIcon: {
    padding: 6,
    borderWidth: 1.5,
    borderColor: "#FF69B4",
    borderRadius: 8
  },
  scrollContent: { padding: 16, paddingBottom: 120 },
  bubble: {
    position: "absolute",
    width: 15,
    height: 15,
    backgroundColor: "#B3E5FC",
    borderRadius: 10,
    opacity: 0.3
  },
  announce: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2F1",
    borderRadius: 12,
    padding: 10,
    marginVertical: 15
  },
  announceText: { color: "#00796B", fontSize: 12, fontWeight: "600" },
  promoCard: { borderRadius: 20, padding: 20, marginBottom: 20 },
  promoTag: { color: "#B3E5FC", fontSize: 10, fontWeight: "bold" },
  promoTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "900",
    marginVertical: 4
  },
  promoDesc: { color: "#E1F5FE", fontSize: 12 },
  flashCard: {
    backgroundColor: "#E1F5FE",
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#B3E5FC"
  },
  flashInfo: { flex: 1 },
  hotDealTag: {
    backgroundColor: "#0288D1",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 5
  },
  hotDealText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  flashTitle: { fontSize: 16, fontWeight: "bold", color: "#01579B" },
  flashSub: { fontSize: 12, color: "#546E7A" },
  flashBtn: {
    backgroundColor: "#0288D1",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12
  },
  flashBtnText: { color: "#FFF", fontWeight: "bold" },
  brandBox: { borderRadius: 20, padding: 20, marginVertical: 20 },
  brandTitle: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  brandDesc: { color: "#E1F5FE", fontSize: 13, marginTop: 5 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  seeMore: { color: "#0288D1", fontWeight: "bold" },
  productItem: {
    width: 140,
    marginRight: 15,
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 10,
    elevation: 3
  },
  productImg: { width: "100%", height: 100, borderRadius: 10 },
  productName: { marginTop: 8, fontSize: 13, fontWeight: "bold" },
  productPrice: { color: "#0288D1", fontWeight: "bold" }
});
