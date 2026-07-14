import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ดึงข้อมูลจากไฟล์ products.json โดยตรง ไม่ต้องผ่าน Service ไฟล์อื่น
import productsData from "../../products.json";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 44) / 2; 

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
  background: "#F8FAFC",
  surface: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  textSecondary: "#64748B",
  tagBg: "#EFF6FF",
  tagText: "#1E40AF",
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
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.tagContainer}>
        <Text style={styles.tagText}>Premium</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.brandText}>{item.brand.toUpperCase()}</Text>
        <Text style={styles.nameText} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>฿{item.price.toLocaleString()}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color={COLORS.surface} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.logoText}>ICE CRAFT</Text>
          <View style={styles.headerRightIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/finances")}>
              <MaterialIcons name="analytics" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/settings")}>
              <Ionicons name="person-outline" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="ค้นหาแก้วเก็บความเย็น..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Product Grid List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<Text style={styles.sectionTitle}>แก้วยอดนิยม</Text>}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace("/")}>
          <Ionicons name="compass" size={24} color={COLORS.accent} />
          <Text style={[styles.navText, { color: COLORS.accent, fontWeight: "600" }]}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/product")}>
          <Ionicons name="add-circle-outline" size={24} color={COLORS.textSecondary} />
          <Text style={styles.navText}>Add Product</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/finances")}>
          <MaterialIcons name="analytics" size={24} color={COLORS.textSecondary} />
          <Text style={styles.navText}>Finances</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/settings")}>
          <Ionicons name="person-outline" size={24} color={COLORS.textSecondary} />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoText: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  headerRightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 15,
  },
  searchSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  filterButton: {
    width: 52,
    height: 52,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
    marginLeft: 8,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    width: COLUMN_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  tagContainer: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: COLORS.tagBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.tagText,
  },
  cardContent: {
    padding: 12,
  },
  brandText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  nameText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    height: 40,
    lineHeight: 20,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.accent,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 15,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});