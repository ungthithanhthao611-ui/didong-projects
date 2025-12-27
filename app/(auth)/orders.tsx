import { AntDesign, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    Image,
} from "react-native";
import httpAxios from "../../services/httpAxios";
import { getStoredUser } from "../../services/auth.service";

export default function OrderHistoryScreen() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Chi tiết đơn hàng
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [orderItems, setOrderItems] = useState<any[]>([]);
    const [itemsLoading, setItemsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Huỷ đơn hàng
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const reasons = [
        "Đặt nhầm sản phẩm",
        "Thay đổi nhu cầu",
        "Thời gian giao hàng lâu",
        "Lý do khác"
    ];

    const fetchOrders = async () => {
        try {
            const user = await getStoredUser();
            if (!user) {
                router.replace("/(auth)/login");
                return;
            }
            const res = await httpAxios.get(`/orders/user/${user.id}`);
            setOrders(res.data || []);
        } catch (error) {
            console.error("Lỗi lấy lịch sử đơn hàng:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleOrderDetails = async (order: any) => {
        setSelectedOrder(order);
        setShowModal(true);
        setItemsLoading(true);
        try {
            const res = await httpAxios.get(`/orders/${order.orderId}/items`);
            setOrderItems(res.data || []);
        } catch (error) {
            console.error("Lỗi lấy chi tiết sản phẩm:", error);
        } finally {
            setItemsLoading(false);
        }
    };

    const handleCancelOrder = () => {
        setShowReasonModal(true);
    };

    const confirmCancel = async () => {
        if (!cancelReason) {
            Alert.alert("Thông báo", "Vui lòng chọn lý do huỷ đơn hàng");
            return;
        }

        try {
            setItemsLoading(true);
            await httpAxios.post(`/orders/${selectedOrder.orderId}/cancel`, {
                reason: cancelReason
            });
            Alert.alert("Thành công ✅", "Đơn hàng của bạn đã được huỷ.");
            setShowReasonModal(false);
            setShowModal(false);
            fetchOrders();
            // Điều hướng chuẩn expo-router
            router.replace("/(auth)/orders");
        } catch (error: any) {
            Alert.alert("Lỗi", error.response?.data || "Không thể huỷ đơn hàng.");
        } finally {
            setItemsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case "PENDING": return "#FF9800";
            case "CONFIRMED": return "#2196F3";
            case "SHIPPED": return "#4CAF50";
            case "CANCELLED": return "#F44336";
            default: return "#9E9E9E";
        }
    };

    const renderOrderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.orderCard}
            onPress={() => handleOrderDetails(item)}
            activeOpacity={0.7}
        >
            <View style={styles.orderHeader}>
                <View style={styles.idGroup}>
                    <Feather name="hash" size={14} color="#666" />
                    <Text style={styles.orderIdText}>{item.orderId}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.orderStatus) + "15" }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.orderStatus) }]}>
                        {item.orderStatus}
                    </Text>
                </View>
            </View>

            <View style={styles.orderBody}>
                <View style={styles.infoRow}>
                    <AntDesign name="calendar" size={16} color="#888" />
                    <Text style={styles.infoValue}>{item.orderDate}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="wallet-outline" size={16} color="#888" />
                    <Text style={styles.priceValue}>{item.totalAmount.toLocaleString()}đ</Text>
                </View>
            </View>

            <View style={styles.orderFooter}>
                <Text style={styles.viewDetailText}>Xem chi tiết</Text>
                <AntDesign name="right" size={14} color="#00BFA5" />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <AntDesign name="left" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lịch sử đơn hàng</Text>
                <View style={{ width: 40 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#00BFA5" />
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.orderId.toString()}
                    renderItem={renderOrderItem}
                    contentContainerStyle={styles.listContent}
                    onRefresh={() => { setRefreshing(true); fetchOrders(); }}
                    refreshing={refreshing}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <MaterialCommunityIcons name="clipboard-text-outline" size={80} color="#DDD" />
                            <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
                            <TouchableOpacity style={styles.shopNowBtn} onPress={() => router.push("/home")}>
                                <Text style={styles.shopNowText}>Mua sắm ngay</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}

            {/* Modal chi tiết đơn hàng */}
            <Modal visible={showModal} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chi tiết đơn hàng #{selectedOrder?.orderId}</Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <AntDesign name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        {itemsLoading ? (
                            <ActivityIndicator style={{ padding: 40 }} color="#00BFA5" />
                        ) : (
                            <FlatList
                                data={orderItems}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <View style={styles.itemRow}>
                                        <Image
                                            source={{ uri: `${httpAxios.defaults.baseURL?.replace('/api', '')}/images/${item.productPhoto}` }}
                                            style={styles.itemImage}
                                        />
                                        <View style={styles.itemInfo}>
                                            <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
                                            <Text style={styles.itemQty}>Số lượng: {item.quantity}</Text>
                                        </View>
                                        <Text style={styles.itemPrice}>
                                            {((item.price - item.discount) * item.quantity).toLocaleString()}đ
                                        </Text>
                                    </View>
                                )}
                                ListFooterComponent={
                                    <View style={styles.footerInfo}>
                                        <View style={styles.dashLine} />
                                        <View style={styles.totalRow}>
                                            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                                            <Text style={styles.totalValue}>{selectedOrder?.totalAmount?.toLocaleString()}đ</Text>
                                        </View>
                                        <View style={styles.shippingInfo}>
                                            <Ionicons name="location-outline" size={16} color="#666" />
                                            <Text style={styles.addressText}>{selectedOrder?.address}</Text>
                                        </View>

                                        {/* Nút Huỷ đơn hàng */}
                                        {selectedOrder && ["PENDING", "CREATED", "CONFIRMED"].includes(selectedOrder.orderStatus?.toUpperCase()) && (
                                            <TouchableOpacity
                                                style={styles.cancelOrderBtn}
                                                onPress={handleCancelOrder}
                                            >
                                                <Feather name="trash-2" size={18} color="#FF3B30" />
                                                <Text style={styles.cancelOrderText}>Huỷ đơn hàng này</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                }
                            />
                        )}
                    </View>
                </View>
            </Modal>
            {/* Modal Chọn lý do huỷ */}
            <Modal visible={showReasonModal} animationType="fade" transparent={true}>
                <View style={styles.reasonOverlay}>
                    <View style={styles.reasonContainer}>
                        <Text style={styles.reasonTitle}>Chọn lý do huỷ đơn</Text>
                        {reasons.map((r) => (
                            <TouchableOpacity
                                key={r}
                                style={[styles.reasonItem, cancelReason === r && styles.reasonItemActive]}
                                onPress={() => setCancelReason(r)}
                            >
                                <View style={[styles.radio, cancelReason === r && styles.radioActive]} />
                                <Text style={styles.reasonText}>{r}</Text>
                            </TouchableOpacity>
                        ))}

                        <View style={styles.reasonFooter}>
                            <TouchableOpacity style={styles.btnBack} onPress={() => setShowReasonModal(false)}>
                                <Text style={styles.btnBackText}>Quay lại</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnConfirmCancel} onPress={confirmCancel}>
                                <Text style={styles.btnConfirmText}>Xác nhận huỷ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F9FA" },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContent: { padding: 15 },
    orderCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    idGroup: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    orderIdText: { fontSize: 14, fontWeight: '700', color: '#333' },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 11, fontWeight: '800' },
    orderBody: { gap: 8, marginBottom: 12 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    infoValue: { fontSize: 14, color: '#666' },
    priceValue: { fontSize: 16, fontWeight: '800', color: '#00BFA5' },
    orderFooter: { borderTopWidth: 1, borderTopColor: '#F5F5F5', paddingTop: 12, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 5 },
    viewDetailText: { fontSize: 13, color: '#00BFA5', fontWeight: '600' },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { fontSize: 16, color: '#999', marginTop: 15, marginBottom: 25 },
    shopNowBtn: { backgroundColor: '#00BFA5', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
    shopNowText: { color: '#fff', fontWeight: '700' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    modalTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' },
    itemInfo: { flex: 1, marginRight: 20 },
    itemName: { fontSize: 14, color: '#333', fontWeight: '600' },
    itemQty: { fontSize: 12, color: '#888', marginTop: 2 },
    itemPrice: { fontSize: 14, fontWeight: '700', color: '#333' },
    footerInfo: { marginTop: 10 },
    dashLine: { height: 1, backgroundColor: '#EEE', marginVertical: 15 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    totalLabel: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
    totalValue: { fontSize: 20, fontWeight: '800', color: '#00BFA5' },
    shippingInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#F9F9F9', padding: 12, borderRadius: 12 },
    addressText: { flex: 1, fontSize: 13, color: '#666', lineHeight: 20 },
    cancelOrderBtn: {
        marginTop: 25,
        backgroundColor: '#FFF5F5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: '#FFEBEB'
    },
    cancelOrderText: {
        color: '#FF3B30',
        fontWeight: '700',
        fontSize: 14
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#f9f9f9'
    },
    reasonOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    reasonContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25
    },
    reasonTitle: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 20,
        textAlign: 'center'
    },
    reasonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12
    },
    reasonItemActive: {
        backgroundColor: '#FFF9FA',
        borderRadius: 10
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#DDD'
    },
    radioActive: {
        borderColor: '#FF6F91',
        borderWidth: 6
    },
    reasonText: {
        fontSize: 15,
        color: '#444'
    },
    reasonFooter: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 25
    },
    btnBack: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEE'
    },
    btnBackText: {
        fontWeight: '700',
        color: '#666'
    },
    btnConfirmCancel: {
        flex: 1,
        backgroundColor: '#FF3B30',
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12
    },
    btnConfirmText: {
        color: '#fff',
        fontWeight: '700'
    }
});
