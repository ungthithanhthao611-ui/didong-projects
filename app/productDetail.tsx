import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView
} from "react-native";

import httpAxios from "../services/httpAxios";
import { getStoredUser, UserInfo } from "../services/auth.service";
import HeaderBar from "./components/home/HeaderBar";

const { width } = Dimensions.get("window");

export default function ProductDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const productId = Number(id);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("info");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getStoredUser();
      if (user) setUserId(user.id);
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        if (!productId) return;
        const res = await httpAxios.get(`/products/${productId}`);
        const data = res.data;
        setProduct(data);

        const baseUrl = httpAxios.defaults.baseURL ? httpAxios.defaults.baseURL.replace('/api', '') : 'http://localhost:8080';
        setSelectedImage(`${baseUrl}/images/${data.photo}`);
      } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [productId]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        if (!productId || !product?.categoryId) return;
        const res = await httpAxios.get(`/products/${productId}/related`, {
          params: { categoryId: product.categoryId }
        });
        setRelatedProducts(res.data);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm liên quan:", error);
      }
    };
    if (product) fetchRelatedProducts();
  }, [productId, product]);

  const addToCart = async () => {
    if (!product || !userId) {
      if (!userId) Alert.alert("Yêu cầu", "Vui lòng đăng nhập để mua hàng");
      return;
    }
    try {
      const payload = {
        userId: userId,
        productId: product.id,
        quantity: qty,
        productPrice: product.price,
        discount: 0,
      };
      await httpAxios.post("/carts/add", payload);
      Alert.alert("Thành công ✅", `Đã thêm ${qty} ${product.title} vào giỏ hàng!`, [
        { text: "Mua tiếp", style: "cancel" },
        { text: "Xem giỏ hàng", onPress: () => router.push("/cart") },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thêm vào giỏ hàng.");
    }
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#D4A056" /></View>;
  if (!product) return <View style={styles.center}><Text>Sản phẩm không tồn tại</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar />


      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 📸 IMAGE SECTION */}
        <View style={styles.cardMain}>
          <View style={styles.imageWrapper}>
            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.productImg} resizeMode="contain" />}
          </View>

          <View style={styles.infoWrapper}>
            <Text style={styles.title}>{product.title}</Text>
            <View style={styles.subInfoRow}>
              <Text style={styles.subText}>Thương hiệu: <Text style={styles.highlightText}>An Thái</Text></Text>
              <Text style={styles.subText}> | Tình trạng: <Text style={styles.statusText}>Còn hàng</Text></Text>
            </View>

            <Text style={styles.price}>{Number(product.price).toLocaleString('vi-VN')}đ</Text>

            <View style={styles.actionRow}>
              <View style={styles.qtyBox}>
                <TouchableOpacity onPress={() => qty > 1 && setQty(qty - 1)} style={styles.qtyBtn}>
                  <AntDesign name="minus" size={18} color="#666" />
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{qty}</Text>
                <TouchableOpacity onPress={() => setQty(qty + 1)} style={styles.qtyBtn}>
                  <AntDesign name="plus" size={18} color="#666" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.btnOrder} onPress={addToCart}>
                <Text style={styles.btnOrderText}>THÊM VÀO GIỎ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.btnBackProducts} onPress={() => router.push("/(home)/product")}>
          <Text style={styles.btnBackProductsText}>← QUAY VỀ TRANG CHỦ</Text>
        </TouchableOpacity>

        {/* 📑 TABS SECTION */}
        <View style={styles.tabContainer}>
          <View style={styles.tabHeader}>
            {['info', 'policy', 'review'].map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}>
                <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
                  {tab === 'info' ? 'THÔNG TIN' : tab === 'policy' ? 'CHÍNH SÁCH' : 'ĐÁNH GIÁ'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tabContent}>
            {/* TAB: THÔNG TIN */}
            {activeTab === "info" && (
              <View>
                <Text style={styles.contentTitle}>Mô tả sản phẩm</Text>
                <Text style={styles.contentText}>
                  {product.description || "Sản phẩm được tuyển chọn từ những nguyên liệu tươi ngon nhất, đảm bảo giữ trọn hương vị tự nhiên và giá trị dinh dưỡng cao."}
                  {"\n\n"}Đây là dòng sản phẩm cao cấp được sản xuất theo quy trình khép kín, đảm bảo an toàn vệ sinh thực phẩm và giữ lại hàm lượng dinh dưỡng tối đa. Với công nghệ sấy lạnh hiện đại, từng hạt cà phê giữ được mùi thơm nồng nàn đặc trưng. Đặc biệt, sản phẩm không sử dụng chất bảo quản hay hương liệu tổng hợp, mang đến trải nghiệm thưởng thức tinh tế và thuần khiết nhất cho người sử dụng.
                </Text>

                <Text style={[styles.contentTitle, { marginTop: 20 }]}>Thông số kỹ thuật</Text>
                <View style={styles.specTable}>
                  <View style={styles.specRow}><Text style={styles.specLabel}>Thương hiệu</Text><Text style={styles.specValue}>An Thái Cafe</Text></View>
                  <View style={styles.specRow}><Text style={styles.specLabel}>Khối lượng</Text><Text style={styles.specValue}>500g</Text></View>
                  <View style={styles.specRow}><Text style={styles.specLabel}>Xuất xứ</Text><Text style={styles.specValue}>Việt Nam</Text></View>
                  <View style={[styles.specRow, { borderBottomWidth: 0 }]}><Text style={styles.specLabel}>Hạn dùng</Text><Text style={styles.specValue}>12 tháng</Text></View>
                </View>
              </View>
            )}

            {/* TAB: CHÍNH SÁCH */}
            {activeTab === "policy" && (
              <View>
                {[
                  { icon: "shield-checkmark-outline", text: "Cam kết sản phẩm chính hãng 100%." },
                  { icon: "refresh-outline", text: "Đổi trả trong 24h nếu có lỗi từ nhà sản xuất." },
                  { icon: "airplane-outline", text: "Giao hàng hỏa tốc trong nội thành 30-60p." },
                  { icon: "card-outline", text: "Thanh toán an toàn qua MoMo, ZaloPay, Tiền mặt." }
                ].map((item, index) => (
                  <View key={index} style={styles.policyItem}>
                    <Ionicons name={item.icon as any} size={20} color="#D4A056" />
                    <Text style={styles.policyText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* TAB: ĐÁNH GIÁ */}
            {activeTab === "review" && (
              <View>
                <View style={styles.ratingOverview}>
                  <Text style={styles.ratingBig}>4.9</Text>
                  <View>
                    <View style={styles.starRow}>
                      {[1, 2, 3, 4, 5].map((s) => <AntDesign key={s} name="star" size={14} color="#FFC107" />)}
                    </View>
                    <Text style={styles.totalReviews}>Dựa trên 150 đánh giá</Text>
                  </View>
                </View>
                <View style={styles.reviewComment}>
                  <Text style={styles.reviewerName}>Khách hàng hài lòng</Text>
                  <Text style={styles.reviewText}>Hương vị rất đặc biệt, đóng gói chắc chắn. Sẽ mua lại lần sau!</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* 📦 RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <View style={styles.relatedSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>CÓ THỂ BẠN SẼ THÍCH</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedList}>
              {relatedProducts.map((item) => {
                const baseUrl = httpAxios.defaults.baseURL ? httpAxios.defaults.baseURL.replace('/api', '') : 'http://localhost:8080';
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.relatedItem}
                    onPress={() => router.push({ pathname: "/productDetail", params: { id: item.id } })}
                  >
                    <Image source={{ uri: `${baseUrl}/images/${item.photo}` }} style={styles.relatedImg} />
                    <View style={styles.relatedInfo}>
                      <Text style={styles.relatedTitle} numberOfLines={2}>{item.title}</Text>
                      <Text style={styles.relatedPrice}>{Number(item.price).toLocaleString('vi-VN')}đ</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, height: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  headerBtn: { padding: 5 },
  scrollContent: { padding: 15 },
  cardMain: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 15 },
  imageWrapper: { width: '100%', height: 300, marginBottom: 15, justifyContent: 'center', alignItems: 'center' },
  productImg: { width: '100%', height: '100%' },
  infoWrapper: { width: '100%' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subInfoRow: { flexDirection: 'row', marginBottom: 12 },
  subText: { fontSize: 12, color: '#888' },
  highlightText: { color: '#D4A056', fontWeight: 'bold' },
  statusText: { color: '#4CAF50', fontWeight: 'bold' },
  price: { fontSize: 26, fontWeight: 'bold', color: '#D4A056', marginBottom: 20 },
  actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qtyBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#DDD', borderRadius: 25, height: 45 },
  qtyBtn: { width: 40, alignItems: 'center' },
  qtyValue: { width: 40, textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
  btnOrder: { backgroundColor: '#D4A056', flex: 1, marginLeft: 15, height: 45, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  btnOrderText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  tabContainer: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', marginBottom: 30, elevation: 2 },
  tabHeader: { flexDirection: 'row', backgroundColor: '#F9F9F9' },
  tabBtn: { flex: 1, paddingVertical: 15, alignItems: 'center' },
  tabBtnActive: { borderBottomWidth: 3, borderBottomColor: '#D4A056' },
  tabBtnText: { fontSize: 13, fontWeight: 'bold', color: '#888' },
  tabBtnTextActive: { color: '#D4A056' },
  tabContent: { padding: 20 },
  contentTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  contentText: { fontSize: 14, color: '#666', lineHeight: 22 },
  specTable: { borderWidth: 1, borderColor: '#EEE', borderRadius: 8 },
  specRow: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  specLabel: { flex: 1, color: '#888' },
  specValue: { flex: 2, color: '#333', fontWeight: '500' },
  policyItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 12 },
  policyText: { fontSize: 14, color: '#555', flex: 1 },
  ratingOverview: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9F1', padding: 15, borderRadius: 10, marginBottom: 20, gap: 15 },
  ratingBig: { fontSize: 36, fontWeight: 'bold', color: '#D4A056' },
  starRow: { flexDirection: 'row', marginBottom: 4 },
  totalReviews: { fontSize: 12, color: '#888' },
  reviewComment: { padding: 10, backgroundColor: '#FDFDFD', borderRadius: 8 },
  reviewerName: { fontWeight: 'bold', color: '#444', marginBottom: 5 },
  reviewText: { fontSize: 14, color: '#777' },
  btnBackProducts: { marginBottom: 15, padding: 10, alignItems: 'center' },
  btnBackProductsText: { color: '#D4A056', fontWeight: 'bold', fontSize: 14 },
  relatedSection: { marginVertical: 20, paddingBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 5 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  seeAllText: { fontSize: 12, color: '#D4A056' },
  relatedList: { paddingRight: 20 },
  relatedItem: { width: 140, backgroundColor: '#fff', borderRadius: 10, marginRight: 15, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  relatedImg: { width: '100%', height: 140, backgroundColor: '#f0f0f0' },
  relatedInfo: { padding: 8 },
  relatedTitle: { fontSize: 13, color: '#333', marginBottom: 4, height: 34 },
  relatedPrice: { fontSize: 14, fontWeight: 'bold', color: '#D4A056' },
});