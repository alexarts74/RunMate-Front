import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { MatchesProvider } from "@/context/MatchesContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <MatchesProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(app)"
            options={{ headerShown: false }}
          />
        </Stack>
      </MatchesProvider>
    </AuthProvider>
  );
}
