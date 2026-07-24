import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="contacts" options={{ title: "Contacts" }} />
      <Stack.Screen name="scan" options={{ title: "Scan Card" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="api-test" options={{ title: "API Test" }} />
    </Stack>
  );
}
