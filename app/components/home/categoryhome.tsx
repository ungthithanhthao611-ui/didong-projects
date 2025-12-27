import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";

import ProductCard from "../product/ProductCard";

// ===================== 4 Ô CATEGORY =====================
const CATEGORY_BOXES = [
  {
    id: 1,
    title: "Nước",
    sub: "Giải khát",
    color: "#A3D8FF",
    icon: require("../../../assets/images/icon/icon_nuoc.jpg"),
  },
  {
    id: 2,
    title: "Cafe",
    sub: "Đậm vị",
    color: "#D8B4FF",
    icon: require("../../../assets/images/icon/icon_tra.jpg"),
  },
  {
    id: 3,
    title: "Bánh",
    sub: "Ngọt ngào",
    color: "#B3F7C8",
    icon: require("../../../assets/images/icon/icon_banh.jpg"),
  },
  {
    id: 4,
    title: "Khác",
    sub: "Nhiều món",
    color: "#FFC8B4",
    icon: require("../../../assets/images/icon/icon_banh.jpg"),
  },
];

// ===================== SẢN PHẨM DEMO =====================
const DATA_CATEGORIES = [
  {
    title: "Nước (Drinks)",
    items: [
      { id: 1, name: "Baker", sub: "Mát lạnh", price: "25.000đ", rate: 4.8, img: require("../../../assets/images/Nuoc/baker.jpg") },
      { id: 2, name: "Bule", sub: "Đậm vị", price: "28.000đ", rate: 4.6, img: require("../../../assets/images/Nuoc/bule.jpg") },
      { id: 3, name: "Chanh dây", sub: "Chua ngọt", price: "22.000đ", rate: 4.9, img: require("../../../assets/images/Nuoc/chanhday.jpg") },
      { id: 4, name: "Lạnh", sub: "Đá xay", price: "30.000đ", rate: 4.7, img: require("../../../assets/images/Nuoc/laplanh.jpg") },
    ],
  },
  {
    title: "Cafe",
    items: [
      { id: 5, name: "Bạc xỉu", sub: "Ngọt béo", price: "28.000đ", rate: 5.0, img: require("../../../assets/images/cafe/bacxiu.jpg") },
      { id: 6, name: "Cacao", sub: "Đậm đà", price: "30.000đ", rate: 4.8, img: require("../../../assets/images/cafe/cacao.jpg") },
      { id: 7, name: "Cafe đen", sub: "Nguyên chất", price: "22.000đ", rate: 4.7, img: require("../../../assets/images/cafe/cafeden.jpg") },
      { id: 8, name: "Matcha", sub: "Thơm mát", price: "35.000đ", rate: 5.0, img: require("../../../assets/images/cafe/matchaxay.jpg") },
    ],
  },
];

export default function CategoryHome() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 900;

  return (
    <View>

      {/* 🔥 RENDER 4 Ô CATEGORY */}
      <Text style={styles.sectionTitle}>Category</Text>

      <View style={styles.boxContainer}>
        {CATEGORY_BOXES.map((cat) => (
          <View key={cat.id} style={[styles.boxItem, { backgroundColor: cat.color }]}>
            <Text style={styles.boxTitle}>{cat.title}</Text>
            <Text style={styles.boxSub}>{cat.sub}</Text>

            <View style={styles.boxIconWrap}>
              <Image source={cat.icon} style={styles.boxIcon} />
            </View>
          </View>
        ))}
      </View>

      {/* 🔥 LIST SẢN PHẨM */}
      {DATA_CATEGORIES.map((cat, i) => (
        <View key={i} style={{ marginBottom: 20 }}>
          <Text style={styles.sectionTitle}>{cat.title}</Text>

          {isDesktop ? (
            <View style={styles.gridWrapper}>
              {cat.items.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </View>
          ) : (
            <FlatList
              data={cat.items}
              horizontal
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <ProductCard product={item} horizontal />}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },

  // 4 Ô CATEGORY
  boxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  boxItem: {
    width: "48%",
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
  },
  boxTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  boxSub: { fontSize: 13, color: "#fff", marginTop: 3 },
  boxIconWrap: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "rgba(255,255,255,0.5)",
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  boxIcon: { width: 30, height: 30, borderRadius: 8 },

  gridWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
