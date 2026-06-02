import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { QueryProvider } from "../providers/query-provider";

export default function RootLayout() {
  return (
    <QueryProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </QueryProvider>
  );
}
