import { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

type ApiResult = {
  ok: boolean;
  message: string;
  server?: string;
  database?: string;
  queryOk?: boolean;
  error?: string;
};

type CardsResult = {
  ok: boolean;
  message: string;
  count?: number;
  sample?: string;
  error?: string;
};

export default function ApiTestScreen() {
  const [isSqlLoading, setIsSqlLoading] = useState(false);
  const [sqlResult, setSqlResult] = useState<ApiResult | null>(null);
  const [isCardsLoading, setIsCardsLoading] = useState(false);
  const [cardsResult, setCardsResult] = useState<CardsResult | null>(null);

  const getBaseUrl = () => process.env.EXPO_PUBLIC_API_BASE_URL ?? (Platform.OS === "web" ? "http://localhost:4000" : "");

  const runSqlTest = async () => {
    const baseUrl = getBaseUrl();
    const endpoint = `${baseUrl}/api/sql-test`;

    if (Platform.OS !== "web" && !baseUrl) {
      setSqlResult({
        ok: false,
        message: "Missing EXPO_PUBLIC_API_BASE_URL for native API calls.",
        error: "Set EXPO_PUBLIC_API_BASE_URL in your env, then restart Expo.",
      });
      return;
    }

    setIsSqlLoading(true);
    setSqlResult(null);

    try {
      const response = await fetch(endpoint);
      const data = (await response.json()) as ApiResult;
      setSqlResult(data);
    } catch (error) {
      setSqlResult({
        ok: false,
        message: "Request failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSqlLoading(false);
    }
  };

  const runCardsTest = async () => {
    const baseUrl = getBaseUrl();
    const endpoint = `${baseUrl}/api/cards`;

    if (Platform.OS !== "web" && !baseUrl) {
      setCardsResult({
        ok: false,
        message: "Missing EXPO_PUBLIC_API_BASE_URL for native API calls.",
        error: "Set EXPO_PUBLIC_API_BASE_URL in your env, then restart Expo.",
      });
      return;
    }

    setIsCardsLoading(true);
    setCardsResult(null);

    try {
      const response = await fetch(endpoint);
      const payload = (await response.json()) as unknown;

      if (!response.ok) {
        const errorMessage =
          typeof payload === "object" && payload !== null && "error" in payload
            ? String((payload as { error?: string }).error ?? "Request failed")
            : "Request failed";

        setCardsResult({
          ok: false,
          message: "Cards route returned an error",
          error: errorMessage,
        });
        return;
      }

      if (!Array.isArray(payload)) {
        setCardsResult({
          ok: false,
          message: "Cards route did not return an array",
          error: "Expected an array response from /api/cards",
        });
        return;
      }

      setCardsResult({
        ok: true,
        message: "Cards route returned data",
        count: payload.length,
        sample: payload.length > 0 ? JSON.stringify(payload[0], null, 2) : undefined,
      });
    } catch (error) {
      setCardsResult({
        ok: false,
        message: "Request failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsCardsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Test</Text>
      <Text style={styles.body}>Use this button to call your monorepo API server.</Text>

      <Pressable style={styles.button} onPress={runSqlTest} disabled={isSqlLoading}>
        <Text style={styles.buttonText}>{isSqlLoading ? "Testing..." : "Test SQL Connection"}</Text>
      </Pressable>

      <Pressable style={styles.buttonSecondary} onPress={runCardsTest} disabled={isCardsLoading}>
        <Text style={styles.buttonText}>{isCardsLoading ? "Testing..." : "Test Cards Route"}</Text>
      </Pressable>

      <View style={styles.resultBox}>
        <Text style={styles.resultTitle}>SQL Result</Text>
        {sqlResult ? (
          <>
            <Text style={styles.resultText}>Status: {sqlResult.ok ? "OK" : "FAILED"}</Text>
            <Text style={styles.resultText}>Message: {sqlResult.message}</Text>
            {sqlResult.server ? <Text style={styles.resultText}>Server: {sqlResult.server}</Text> : null}
            {sqlResult.database ? <Text style={styles.resultText}>Database: {sqlResult.database}</Text> : null}
            {typeof sqlResult.queryOk === "boolean" ? (
              <Text style={styles.resultText}>Query Test: {sqlResult.queryOk ? "OK" : "FAILED"}</Text>
            ) : null}
            {sqlResult.error ? <Text style={styles.errorText}>Error: {sqlResult.error}</Text> : null}
          </>
        ) : (
          <Text style={styles.resultText}>No SQL result yet.</Text>
        )}
      </View>

      <View style={styles.resultBox}>
        <Text style={styles.resultTitle}>Cards Route Result</Text>
        {cardsResult ? (
          <>
            <Text style={styles.resultText}>Status: {cardsResult.ok ? "OK" : "FAILED"}</Text>
            <Text style={styles.resultText}>Message: {cardsResult.message}</Text>
            {typeof cardsResult.count === "number" ? (
              <Text style={styles.resultText}>Count: {cardsResult.count}</Text>
            ) : null}
            {cardsResult.sample ? <Text style={styles.resultCode}>Sample: {cardsResult.sample}</Text> : null}
            {cardsResult.error ? <Text style={styles.errorText}>Error: {cardsResult.error}</Text> : null}
          </>
        ) : (
          <Text style={styles.resultText}>No cards result yet.</Text>
        )}
      </View>

      <Text style={styles.small}>Add API routes in apps/api/src/routes.</Text>
      <Text style={styles.small}>Native requires EXPO_PUBLIC_API_BASE_URL (example: http://YOUR_IP:4000).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  body: {
    fontSize: 16,
    color: "#4b5563",
  },
  button: {
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
  },
  buttonSecondary: {
    backgroundColor: "#374151",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultBox: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    gap: 4,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  resultText: {
    fontSize: 14,
    color: "#1f2937",
  },
  errorText: {
    fontSize: 14,
    color: "#b91c1c",
  },
  resultCode: {
    fontSize: 12,
    color: "#1f2937",
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }),
  },
  small: {
    marginTop: 4,
    fontSize: 13,
    color: "#6b7280",
  },
});
