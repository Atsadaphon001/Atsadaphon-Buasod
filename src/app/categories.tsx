import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Platform,
  SafeAreaView,
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
};

const systemFont = Platform.select({
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  ios: "System",
  android: "Roboto",
});

const categories = [
  "แก้วเก็บความเย็น 40oz",
  "แก้วเก็บความเย็น 30oz",
  "ขวดน้ำพรีเมียม",
  "อุปกรณ์เสริม & หลอด",
  "กระเป๋าใส่แก้ว",
  "รุ่น Limited Edition",
];

export default function CategoriesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Categories</Text>
        <View style={{ width: 26 }} />
      </View>

      {categories.map((item, index) => (
        <TouchableOpacity key={index} style={styles.card} activeOpacity={0.8}>
          <Ionicons name="folder-open-outline" size={24} color={COLORS.accent} />
          <Text style={styles.name}>{item}</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.border} />
        </TouchableOpacity>
      ))}
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
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.primary,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
  },
  name: {
    fontFamily: systemFont,
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
});