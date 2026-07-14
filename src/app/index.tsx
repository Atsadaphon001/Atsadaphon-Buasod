import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ดึงข้อมูลจากไฟล์ products.json โดยตรง
import productsData from "../../products.json";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 48) / 2; 

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

const COLORS = {
  primary: "#0F172A",
  accent: "#2563EB",
  accentLight: "#DBEAFE",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  textSecondary: "#64748B",
  saleTag: "#EF4444",
  price: "#1E3A8A"
};

export default function HomeScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setProducts(productsData as Product[]);
    setLoading(false);
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>Best Seller</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.brandText}>{item.brand.toUpperCase()}</Text>
        <Text style={styles.nameText} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.currencyText}>฿<Text style={styles.priceText}>{item.price.toLocaleString()}</Text></Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push("/product")}
          >
            <Ionicons name="cart-outline" size={18} color={COLORS.surface} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ส่วนหัวของแอป (Header) */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.logoText}>ICE CRAFT</Text>
          </View>
          <View style={styles.headerRightIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/finances")}>
              <MaterialIcons name="analytics" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/settings")}>
              <Ionicons name="person-circle-outline" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ช่องค้นหาดีไซน์เรียบหรู (Search Bar) */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="ค้นหาแก้วเก็บความเย็นพรีเมียม..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textSecondary}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* รายการแสดงผลสินค้า Grid แบบ 2 คอลัมน์ */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.sectionTitle}>แก้วยอดนิยมยอดฮิต ✨</Text>}
      />

      {/* แถบเมนูด้านล่างสุด (Bottom Navigation) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace("/")}>
          <Ionicons name="compass" size={22} color={COLORS.accent} />
          <Text style={[styles.navText, { color: COLORS.accent, fontWeight: "700" }]}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/product")}>
          <Ionicons name="add-circle-outline" size={22} color={COLORS.textSecondary} />
          <Text style={styles.navText}>Add Product</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/finances")}>
          <MaterialIcons name="analytics" size={22} color={COLORS.textSecondary} />
          <Text style={styles.navText}>Finances</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/settings")}>
          <Ionicons name="person-outline" size={22} color={COLORS.textSecondary} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// 🏢 ฟอนต์ครอบจักรวาลสากล ป้องกันฟอนต์ระบบระเบิดบนเบราว์เซอร์
const systemFont = Platform.select({
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  ios: "System",
  android: "Roboto",
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontFamily: systemFont,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  logoText: {
    fontFamily: systemFont,
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  headerRightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 18,
    padding: 4,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    fontFamily: systemFont,
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120, // ขยายระยะล่างสุดไม่ให้ทับกับเมนู
  },
  sectionTitle: {
    fontFamily: systemFont,
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 15,
    marginBottom: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    width: COLUMN_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  imageContainer: {
    width: "100%",
    height: 170,
    backgroundColor: "#F1F5F9",
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  tagContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontFamily: systemFont,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.surface,
    textTransform: "uppercase",
  },
  cardContent: {
    padding: 14,
  },
  brandText: {
    fontFamily: systemFont,
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.accent,
    marginBottom: 4,
    letterSpacing: 0.8,
  },
  nameText: {
    fontFamily: systemFont,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    height: 38,
    lineHeight: 19,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  currencyText: {
    fontFamily: systemFont,
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.price,
  },
  priceText: {
    fontFamily: systemFont,
    fontSize: 17,
    fontWeight: "900",
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 90, // ขยายเพิ่มความสูงให้ดูโปร่ง สบายตา กดง่ายขึ้น
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 28, // ดันไอคอนและข้อความขึ้นเพื่อไม่ให้ติดขอบล่าง
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  navText: {
    fontFamily: systemFont,
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "600",
    marginTop: 4,
  },
});