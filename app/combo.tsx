import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";

/**
 * 🔥 API ĐÚNG THEO BACKEND CỦA BẠN
 * @GetMapping("/search")
 * /api/products/search?q=combo
 */
const API_URL = "http://localhost:8081/api/products/search?q=combo";
const IMAGE_BASE = "http://localhost:8081/uploads/";

export default function ComboScreen() {
  const router = useRouter();

  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCombos();
  }, []);

  const loadCombos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      console.log("🔥 COMBO API DATA:", data);
      setCombos(data);
    } catch (e) {
      console.log("❌ Load combo error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#E1F5FE" }}>
      <LinearGradient
        colors={["#E1F5FE", "#F0F9FF", "#FFFFFF"]}
        style={{ flex: 1 }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#0288D1" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>🔥 Combo Ưu Đãi</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* BANNER */}
          <LinearGradient colors={["#0288D1", "#03A9F4"]} style={styles.banner}>
            <Text style={styles.bannerTag}>HOT DEAL</Text>
            <Text style={styles.bannerTitle}>Combo Giải Nhiệt</Text>
            <Text style={styles.bannerDesc}>
              Tiết kiệm hơn – mát lạnh hơn – ngon hơn
            </Text>
          </LinearGradient>

          {/* LOADING */}
          {loading && (
            <ActivityIndicator size="large" color="#0288D1" />
          )}

          {/* GRID COMBO */}
          {!loading && combos.length > 0 && (
            <View style={styles.grid}>
              {combos.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: "/productDetail",
                      params: { id: item.id }
                    })
                  }
                >
                  <Image
                    source={{ uri: IMAGE_BASE + item.photo }}
                    style={styles.image}
                  />

                  <View style={styles.cardBody}>
                    <Text style={styles.name} numberOfLines={2}>
                      {item.title}
                    </Text>

                    <Text style={styles.price}>
                      {item.price.toLocaleString()} đ
                    </Text>

                    {item.priceRoot > 0 && (
                      <Text style={styles.oldPrice}>
                        {item.priceRoot.toLocaleString()} đ
                      </Text>
                    )}
                  </View>

                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>COMBO</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* EMPTY */}
          {!loading && combos.length === 0 && (
            <Text style={styles.emptyText}>
              Không có sản phẩm combo nào 😢
            </Text>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E1F5FE"
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#01579B"
  },

  container: {
    padding: 16,
    paddingBottom: 100
  },

  banner: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20
  },
  bannerTag: {
    color: "#B3E5FC",
    fontSize: 11,
    fontWeight: "bold"
  },
  bannerTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "900",
    marginVertical: 4
  },
  bannerDesc: {
    color: "#E1F5FE",
    fontSize: 13
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },

  card: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 18,
    marginBottom: 16,
    elevation: 4,
    overflow: "hidden"
  },

  image: {
    width: "100%",
    height: 130
  },

  cardBody: {
    padding: 10
  },

  name: {
    fontSize: 13,
    fontWeight: "700",
    color: "#263238"
  },

  price: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "bold",
    color: "#0288D1"
  },

  oldPrice: {
    fontSize: 12,
    color: "#90A4AE",
    textDecorationLine: "line-through"
  },

  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#0288D1",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },

  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold"
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#607D8B",
    fontSize: 14
  }
});
