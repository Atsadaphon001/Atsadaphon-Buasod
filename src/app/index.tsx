import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// กำหนดประเภทข้อมูล Product ให้ยืดหยุ่น ป้องกัน Type Error แดงค้างหน้าจอ
interface Product {
  _id?: string;
  id?: string;
  name?: string;
  brand?: string;
  price?: string | number;
  image?: string;
}

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 44) / 2;

const safeString = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
};

const COLORS = {
  primary: "#20efcc",      
  accent: "#0064C8",      
  background: "#F0F8FF",    
  surface: "#FFFFFF",     
  border: "#D0E7FF",        
  text: "#0F172A",          
  textSecondary: "#64748B", 
  tagBg: "#E6F4FE",        
};

const systemFont = Platform.select({
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  ios: "System",
  android: "Roboto",
});

export default function HomeScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");

  const navigateTo = (path: string, params?: Record<string, string>) => {
    if (params) {
      return router.push({ pathname: path as any, params } as any);
    }
    return router.push(path as any);
  };

  // 🌐 ดึงข้อมูลสดจาก Link GitHub JSON ของคุณโดยตรง
  const GITHUB_JSON_URL =
    "https://raw.githubusercontent.com/Atsadaphon001/Atsadaphon-Buasod/refs/heads/master/src/app/data/products.json";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = `${GITHUB_JSON_URL}?t=${Date.now()}`;
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = (await response.json()) as unknown;
      const normalizedProducts: Product[] = Array.isArray(data)
        ? data.map((item, index) => {
            const product = (item ?? {}) as Product;
            const fallbackId = String(index);
            return {
              _id: safeString(product._id, fallbackId),
              id: safeString(product.id, fallbackId),
              name: safeString(product.name, "Unnamed Product"),
              brand: safeString(product.brand, "Unknown Brand"),
              price: product.price ?? 0,
              image: safeString(product.image, "https://via.placeholder.com/300x300?text=No+Image"),
            };
          })
        : [];

      setProducts(normalizedProducts);
    } catch (err) {
      setProducts([]);
      console.log("Error fetching from GitHub:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const name = safeString(product.name).toLowerCase();
    const brand = safeString(product.brand).toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || brand.includes(query);
  });
const renderProductItem = ({ item }: { item: Product }) => (
  <TouchableOpacity
    style={styles(COLORS).card}
    activeOpacity={0.9}
    onPress={() =>
      router.push({
        pathname: "/detail",
        params: {
          id: item.id,
          name: item.name,
          brand: item.brand,
          price: String(item.price),
          image: item.image,
        },
      })
    }
  >
    {/* imageContainer ปรับปรุงใหม่ให้ล็อกรูปอยู่ตรงกลาง */}
    <View style={styles(COLORS).imageContainer}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles(COLORS).productImage} />
      ) : (
        <Ionicons name="image-outline" size={40} color={COLORS.textSecondary} />
      )}
      <View style={styles(COLORS).tagContainer}>
        <Text style={styles(COLORS).tagText}>Best Seller</Text>
      </View>
    </View>

    <View style={styles(COLORS).cardContent}>
      <Text style={styles(COLORS).brandText}>{item.brand.toUpperCase()}</Text>
      <Text style={styles(COLORS).nameText} numberOfLines={2}>
        {item.name}
      </Text>

      <View style={styles(COLORS).priceRow}>
        <Text style={styles(COLORS).priceText}>
          ฿{Number(item.price).toLocaleString()}
        </Text>
        <View style={styles(COLORS).cartButton}>
          <Ionicons name="cart-outline" size={15} color="#fff" />
        </View>
      </View>
    </View>
  </TouchableOpacity>
);
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View>
            <Text style={styles.welcomeText}>Welcome to</Text>
            <Text style={styles.logoText}>ICE CRAFT</Text>
          </View>
          <View style={styles.headerRightIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/categories" as any)}>
              <MaterialIcons name="grid-view" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Bar & Add Button */}
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
        </View>
        <TouchableOpacity style={styles.topAddButton} onPress={() => router.push("/add" as any)}>
          <Text style={styles.topAddButtonText}>+ เพิ่ม</Text>
        </TouchableOpacity>
      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => String(item.id ?? item._id ?? item.name ?? '')}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.sectionTitle}>แก้วยอดนิยมยอดฮิต ✨</Text>}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/")}>
          <Ionicons name="home" size={22} color={COLORS.primary} />
          <Text style={[styles.navText, { color: COLORS.primary, fontWeight: "700" }]}>หน้าหลัก</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/add" as any)}>
          <Ionicons name="add-circle-outline" size={22} color={COLORS.textSecondary} />
          <Text style={styles.navText}>เพิ่มสินค้า</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/categories" as any)}>
          <Ionicons name="folder-open-outline" size={22} color={COLORS.textSecondary} />
          <Text style={styles.navText}>หมวดหมู่</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
    paddingTop: Platform.OS === "ios" ? 10 : 20,
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
    fontSize: 11,
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
    padding: 4,
  },
  searchSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    fontFamily: systemFont,
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  topAddButton: {
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: "center",
  },
  topAddButtonText: {
    fontFamily: systemFont,
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  sectionTitle: {
    fontFamily: systemFont,
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginTop: 10,
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
  },
  imageContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "#F8FAFC",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "85%",
    height: "85%",
    resizeMode: "contain",
  },
  tagContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: COLORS.tagBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontFamily: systemFont,
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.primary,
  },
  cardContent: {
    padding: 12,
  },
  brandText: {
    fontFamily: systemFont,
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 4,
  },
  nameText: {
    fontFamily: systemFont,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    height: 38,
    lineHeight: 19,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  priceText: {
    fontFamily: systemFont,
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.accent,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === "ios" ? 15 : 0,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  navText: {
    fontFamily: systemFont,
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginTop: 4,
  },
});