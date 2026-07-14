import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
 
interface Product {
  id: string;
  name: string;
  stock: number;
  stock_text: string;
  category: string;
  location_count: number;
  location_text: string;
  badge_status: string;
  image_url: string;
}

const systemFont = Platform.select({
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  ios: "System",
  android: "Roboto",
});
 
export default function ProductListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
 
  const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/Nindam-KU/nindam_product/main/sn_product.json';
 
  useEffect(() => {
    fetchProducts();
  }, []);
 
  const fetchProducts = async () => {
    try {
      // 1. เพิ่ม Timestamp ป้องกัน GitHub Cache ไม่อัปเดต
      const url = `${GITHUB_JSON_URL}?t=${Date.now()}`;
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };
 
  const renderItem = ({ item }: { item: Product }) => {
    const isLowStock = item.badge_status === 'Low in stock';
    
    return (
      <View style={styles.cardContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image_url }}
            style={styles.productImage}
            resizeMode="contain" // 2. เปลี่ยนเป็น contain เพื่อให้รูปฟิตเข้ากรอบพอดี ไม่ล้นไม่ตัดแหว่ง
          />
          <Text style={styles.productTitle} numberOfLines={2}>{item.name}</Text>
        </View>
 
        <View style={styles.detailsContainer}>
          {/* 3. ครอบ View ป้องกันข้อความยาวเกินไปดันปุ่มหลุด */}
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.detailText} numberOfLines={1}>
              <Text style={styles.boldText}>Stock: </Text> {item.stock_text}
            </Text>
            <Text style={styles.detailText} numberOfLines={1}>
              <Text style={styles.boldText}>Category: </Text> {item.category}
            </Text>
            <Text style={styles.detailText} numberOfLines={1}>
              <Text style={styles.boldText}>Location: </Text> {item.location_text}
            </Text>
          </View>
          
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                isLowStock ? styles.badgeLowStock : styles.badgeActive,
              ]}
            >
              <Text style={styles.badgeText} numberOfLines={1}>{item.badge_status}</Text>
            </View>
            <TouchableOpacity style={styles.arrowButton}>
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
 
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7B42F6" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }
 
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }
 
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>T-Shirts</Text>
      </View>
      
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, alignItems: 'center', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EEEEEE' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000', fontFamily: systemFont },
  listContainer: { padding: 16 },
  cardContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, justifyContent: 'space-between' },
  // 4. บังคับความกว้างฝั่งซ้าย (รูปและชื่อ) ให้คงที่ที่ 100 เพื่อไม่ให้ดันโครงสร้างฝั่งขวาหลุดจอ
  imageContainer: { width: 100, alignItems: 'center', marginRight: 16 },
  productImage: { width: 90, height: 90, borderRadius: 12, backgroundColor: '#EEEEEE', marginBottom: 8 },
  productTitle: { fontSize: 13, fontWeight: '600', textAlign: 'center', color: '#333', fontFamily: systemFont, lineHeight: 17 },
  // 5. ให้ฝั่งรายละเอียดใช้ flex: 1 เพื่อกระจายพื้นที่อัตโนมัติ ไม่เบียดกันเอง
  detailsContainer: { flex: 1, justifyContent: 'space-between' },
  detailText: { fontSize: 13, color: '#666', marginBottom: 4, fontFamily: systemFont },
  boldText: { fontWeight: 'bold', color: '#333', fontFamily: systemFont },
  badgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  badge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginRight: 10, flex: 1, alignItems: 'center' },
  badgeActive: { backgroundColor: '#A855F7' },
  badgeLowStock: { backgroundColor: '#7E22CE' },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold', fontFamily: systemFont },
  arrowButton: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center' },
  arrowText: { color: '#A855F7', fontWeight: 'bold', fontSize: 16, lineHeight: 18 },
  separator: { height: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  loadingText: { marginTop: 10, color: '#666', fontFamily: systemFont },
  errorText: { color: 'red', fontSize: 16, fontFamily: systemFont },
});