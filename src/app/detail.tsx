import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  primary: "#0F172A",
  accent: "#2563EB",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  textSecondary: "#64748B",
  price: "#1E3A8A"
};

const systemFont = Platform.select({
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  ios: "System",
  android: "Roboto",
});

export default function DetailScreen() {
  const { name, brand, price, image } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Product Detail</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: image as string }} style={styles.image} />
        </View>

        <View style={styles.content}>
          <Text style={styles.brand}>{brand?.toString().toUpperCase()}</Text>
          <Text style={styles.name}>{name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>ราคาพิเศษ</Text>
            <Text style={styles.priceText}>฿{Number(price).toLocaleString()}</Text>
          </View>

          <Text style={styles.description}>
            แก้วเก็บความเย็นระดับพิกเซลพรีเมียม ออกแบบมาเพื่อการเก็บอุณหภูมิที่ยาวนานตลอดวัน 
            ฝาปิดแน่นหนาและพื้นผิวสัมผัสเรียบหรูทนทาน เหมาะสำหรับทุกการเดินทางของคุณ
          </Text>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.9}>
            <Ionicons name="basket-outline" size={22} color={COLORS.surface} style={{ marginRight: 8 }} />
            <Text style={styles.actionButtonText}>เพิ่มลงตะกร้าสินค้า</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontFamily: systemFont,
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
  },
  imageWrapper: {
    width: "100%",
    backgroundColor: COLORS.surface,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  image: {
    width: "100%",
    height: 340,
    resizeMode: "contain",
  },
  content: {
    padding: 24,
  },
  brand: {
    fontFamily: systemFont,
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.accent,
    letterSpacing: 1,
    marginBottom: 6,
  },
  name: {
    fontFamily: systemFont,
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    lineHeight: 30,
  },
  priceContainer: {
    marginTop: 20,
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  priceLabel: {
    fontFamily: systemFont,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  priceText: {
    fontFamily: systemFont,
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.price,
    marginTop: 4,
  },
  description: {
    fontFamily: systemFont,
    marginTop: 20,
    lineHeight: 24,
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    marginTop: 30,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    flexDirection: "row",
  },
  actionButtonText: {
    fontFamily: systemFont,
    color: COLORS.surface,
    fontWeight: "700",
    fontSize: 16,
  },
});