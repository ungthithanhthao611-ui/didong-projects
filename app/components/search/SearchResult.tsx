import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const SearchResult = ({ item }) => {
  const router = useRouter(); //

  if (!item) return null;

  const BASE_URL = "http://localhost:8080"; 
  const name = item.title || "Sản phẩm không tên"; 
  const price = item.price || 0; 
  const image = item.photo; 

  const getImageUrl = (imgName) => {
    if (!imgName) return 'https://via.placeholder.com/150';
    if (imgName.startsWith('http')) return imgName;
    return `${BASE_URL}/images/${imgName}`; 
  };

  // Hàm xử lý khi bấm vào sản phẩm
  const handlePress = () => {
    // Chuyển hướng tới trang chi tiết kèm theo ID sản phẩm
    // Bạn hãy kiểm tra route chi tiết của mình là gì (VD: /product/1 hoặc /details/1)
    router.push({
        pathname: "/productDetail", // Thay bằng route thực tế của bạn
        params: { id: item.id }
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      <Image 
        source={{ uri: getImageUrl(image) }} 
        style={styles.image} 
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <Text style={styles.price}>{Number(price).toLocaleString()}đ</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: 15,
    color: '#FF4D67',
    marginTop: 4,
    fontWeight: '600',
  },
});

export default SearchResult;