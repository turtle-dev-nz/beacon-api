import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const routes = [
  { href: "/contacts", label: "Contacts Page" },
  { href: "/scan", label: "Scan Page" },
  { href: "/settings", label: "Settings Page" },
  { href: "/api-test", label: "API / SQL Test Page" },
] as const;

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Business Card App Skeleton</Text>
      <Text style={styles.subtitle}>Use these starter pages to begin building features.</Text>

      <View style={styles.buttonGroup}>
        {routes.map((route) => (
          <Link key={route.href} href={route.href} asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>{route.label}</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 16,
    color: "#4b5563",
  },
  buttonGroup: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
