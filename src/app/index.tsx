import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
 
// 1. Define the TypeScript interface based on our JSON structure
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

// กำหนด System Font เพื่อช่วยให้ตัวอักษรแสดงผลได้คมชัดและสวยงามในทุกแพลตฟอร์ม
const systemFont = Platform.select({
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  ios: "System",
  android: "Roboto",
});
 
export default function ProductListScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
 
  // 2. Using your specific GitHub Raw URL
  const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/Nindam-KU/nindam_product/main/sn_product.json';
 
  useEffect(() => {
    fetchProducts();
  }, []);
 
  const fetchProducts = async () => {
    try {
      // ดึงข้อมูลสดใหม่ทุกครั้ง ป้องกันปัญหาระบบ Cache ข้อมูลเก่าจาก GitHub
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
 
  // 3. Render individual product cards
  const renderItem = ({ item }: { item: Product }) => {
    // ปรับการเปรียบเทียบข้อความให้ยืดหยุ่นด้วยการทำเป็นตัวพิมพ์เล็ก (Lowercase)
    const badgeTextLower = (item.badge_status || '').toLowerCase();
    const isLowStock = badgeTextLower === 'low in stock';
    
    return (
      <View style={styles.cardContainer}>
        {/* คอนเทนเนอร์รูปภาพ (ฝั่งซ้าย): ล็อกการย่อขยายภาพแบบ contain เพื่อความพอดีของกรอบสินค้า */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image_url }}
            style={styles.productImage}
            resizeMode="contain" 
          />
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
 
        {/* รายละเอียดสินค้า (ฝั่งขวา) */}
        <View style={styles.detailsContainer}>
          <View style={styles.infoBlock}>
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
          
          {/* แถวแสดงป้ายสถานะและปุ่มกด */}
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.badge,
                isLowStock ? styles.badgeLowStock : styles.badgeActive,
              ]}
            >
              <Text style={styles.badgeText} numberOfLines={1}>
                {item.badge_status}
              </Text>
            </View>
            <TouchableOpacity style={styles.arrowButton} activeOpacity={0.7}>
              <Text style={styles.arrowText}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
 
  // 4. Handle Loading and Error States
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
 
  // 5. Main UI Render
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>T-Shirts</Text>
      </View>
      
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
 
// --- STYLES (ปรับปรุงเพื่อรองรับการแสดงผลที่สมมาตร 100%) ---
const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  header: { 
    paddingVertical: Platform.OS === 'ios' ? 12 : 18, 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEEEEE' 
  },
  headerTitle: { 
    fontFamily: systemFont,
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#000000' 
  },
  listContainer: { 
    padding: 16,
    paddingBottom: 40
  },
  cardContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    borderRadius: 14, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  imageContainer: { 
    width: 100, // กำหนดความกว้างฝั่งรูปภาพและชื่อสินค้าให้คงที่
    alignItems: 'center', 
    marginRight: 16 
  },
  productImage: { 
    width: 90, 
    height: 90, 
    borderRadius: 10, 
    backgroundColor: '#F3F4F6', 
    marginBottom: 8 
  },
  productTitle: { 
    fontFamily: systemFont,
    fontSize: 13, 
    fontWeight: '600', 
    textAlign: 'center', 
    color: '#1F2937',
    lineHeight: 17
  },
  detailsContainer: { 
    flex: 1, 
    justifyContent: 'space-between',
    paddingVertical: 2
  },
  infoBlock: {
    justifyContent: 'flex-start'
  },
  detailText: { 
    fontFamily: systemFont,
    fontSize: 13, 
    color: '#4B5563', 
    marginBottom: 4 
  },
  boldText: { 
    fontWeight: '700', 
    color: '#111827' 
  },
  badgeRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginTop: 8 
  },
  badge: { 
    flex: 1, // ปรับให้ป้ายสถานะยืดหยุ่นตามความยาวของข้อความอัตโนมัติ ไม่บีบกรอบ
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 20, 
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeActive: { 
    backgroundColor: '#A855F7' 
  },
  badgeLowStock: { 
    backgroundColor: '#EF4444' // สลับป้ายเตือนเป็นสีแดง (สีสากล) เพื่อเพิ่มความชัดเจนในการตรวจสอบ
  },
  badgeText: { 
    fontFamily: systemFont,
    color: '#FFFFFF', 
    fontSize: 11, 
    fontWeight: 'bold' 
  },
  arrowButton: { 
    width: 26, 
    height: 26, 
    borderRadius: 13, 
    backgroundColor: '#F3E8FF', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  arrowText: { 
    color: '#A855F7', 
    fontWeight: 'bold', 
    fontSize: 16, 
    lineHeight: 18,
    textAlign: 'center'
  },
  separator: { 
    height: 14 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F8F9FA' 
  },
  loadingText: { 
    fontFamily: systemFont,
    marginTop: 10, 
    color: '#6B7280' 
  },
  errorText: { 
    fontFamily: systemFont,
    color: '#EF4444', 
    fontSize: 16 
  },
});