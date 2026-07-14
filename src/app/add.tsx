import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
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
};

const systemFont = Platform.select({
  web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  ios: "System",
  android: "Roboto",
});

export default function AddScreen() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const saveProduct = () => {
    if (!name || !brand || !price) {
      Alert.alert("แจ้งเตือน", "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }
    Alert.alert(
      "สำเร็จ",
      "เพิ่มแก้วเก็บความเย็นเข้าสู่คลังจำลองเรียบร้อยแล้ว!"
    );
    setName("");
    setBrand("");
    setPrice("");
    setImage("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Product</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="เช่น Stanley Quencher H2.0"
          placeholderTextColor={COLORS.textSecondary}
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Brand *</Text>
        <TextInput
          style={styles.input}
          placeholder="เช่น Stanley หรือ Yeti"
          placeholderTextColor={COLORS.textSecondary}
          value={brand}
          onChangeText={setBrand}
        />

        <Text style={styles.label}>Price (฿) *</Text>
        <TextInput
          style={styles.input}
          placeholder="เช่น 1890"
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://example.com/image.png"
          placeholderTextColor={COLORS.textSecondary}
          value={image}
          onChangeText={setImage}
        />

        <TouchableOpacity style={styles.button} onPress={saveProduct} activeOpacity={0.9}>
          <Text style={styles.buttonText}>บันทึกรายการสินค้า</Text>
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
  form: {
    padding: 24,
  },
  label: {
    fontFamily: systemFont,
    fontSize: 14,
    marginBottom: 8,
    marginTop: 14,
    color: COLORS.text,
    fontWeight: "700",
  },
  input: {
    fontFamily: systemFont,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    fontSize: 15,
  },
  button: {
    backgroundColor: COLORS.accent,
    marginTop: 35,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonText: {
    fontFamily: systemFont,
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});