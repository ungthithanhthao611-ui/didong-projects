import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { useEffect, useRef, useState } from "react";

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width;
const TOTAL_BANNER = 3;

export default function HomeHero() {
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  // AUTO SLIDE – 1 banner / lần
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (index + 1) % TOTAL_BANNER;
      scrollRef.current?.scrollTo({
        x: nextIndex * BANNER_WIDTH,
        animated: true,
      });
      setIndex(nextIndex);
    }, 3500);

    return () => clearInterval(timer);
  }, [index]);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(
            e.nativeEvent.contentOffset.x / BANNER_WIDTH
          );
          setIndex(newIndex);
        }}
      >
        {/* ================= BANNER 1 ================= */}
        <View style={styles.page}>
          <View style={[styles.banner, { backgroundColor: "#F8BBD0" }]}>
            <View style={styles.left}>
              <Text style={styles.brand}>🎄 Sweetness Christmas</Text>
              <Text style={styles.title}>
                Ngọt ngào{"\n"}mùa Noel
              </Text>
              <Text style={styles.desc}>
                Ưu đãi bánh & nước{"\n"}Chỉ hôm nay 🎁
              </Text>
            </View>

            <View style={styles.right}>
              <Image
                source={require("../../../assets/images/icon/santa.png")}
                style={styles.santa}
              />
              <Image
                source={require("../../../assets/images/Nuoc/baker.jpg")}
                style={styles.product}
              />
            </View>
          </View>
        </View>

        {/* ================= BANNER 2 ================= */}
        <View style={styles.page}>
          <View style={[styles.banner, { backgroundColor: "#C8E6C9" }]}>
            <View style={styles.left}>
              <Text style={styles.brand}>🎅 Christmas Deal</Text>
              <Text style={styles.title}>
                Giảm đến{"\n"}30%
              </Text>
              <Text style={styles.desc}>
                Áp dụng hôm nay{"\n"}Đừng bỏ lỡ ❄️
              </Text>
            </View>

            <View style={styles.right}>
              <Image
                source={require("../../../assets/images/icon/santa.png")}
                style={styles.santa}
              />
              <Image
                source={require("../../../assets/images/cafe/bacxiu.jpg")}
                style={styles.product}
              />
            </View>
          </View>
        </View>

        {/* ================= BANNER 3 ================= */}
        <View style={styles.page}>
          <View style={[styles.banner, { backgroundColor: "#BBDEFB" }]}>
            <View style={styles.left}>
              <Text style={styles.brand}>❄️ Winter Special</Text>
              <Text style={styles.title}>
                Mát lạnh{"\n"}ngọt ngào
              </Text>
              <Text style={styles.desc}>
                Tặng topping{"\n"}mùa Noel 🎄
              </Text>
            </View>

            <View style={styles.right}>
              <Image
                source={require("../../../assets/images/Nuoc/bule.jpg")}
                style={styles.product}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* DOT INDICATOR */}
      <View style={styles.dots}>
        {[...Array(TOTAL_BANNER)].map((_, i) => (
          <View
            key={i}
            style={[styles.dot, index === i && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },

  page: {
    width: BANNER_WIDTH, // 🔥 FULL NGANG
  },

  banner: {
    width: "100%",
    height: 210,
    flexDirection: "row",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderRadius: 0, // 🔥 sát mép màn hình
    overflow: "hidden",
  },

  left: {
    flex: 1,
    justifyContent: "center",
  },

  right: {
    width: 140,
    alignItems: "center",
    justifyContent: "flex-end",
  },

  brand: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
    opacity: 0.95,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    marginTop: 6,
    lineHeight: 32,
  },

  desc: {
    fontSize: 13,
    color: "#fff",
    marginTop: 8,
    lineHeight: 18,
  },

  santa: {
    width: 56,
    height: 56,
    resizeMode: "contain",
    marginBottom: 6,
  },

  product: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },

  dotActive: {
    backgroundColor: "#FF5A9E",
    width: 16,
  },
});
