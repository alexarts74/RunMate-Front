import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { MatchesProvider } from "@/context/MatchesContext";
import AuthenticationGuard from "@/components/auth/AuthenticationGuard";
import { UnreadMessagesProvider } from "@/context/UnreadMessagesContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <UnreadMessagesProvider>
        <MatchesProvider>
          <AuthenticationGuard>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
            </Stack>
          </AuthenticationGuard>
        </MatchesProvider>
      </UnreadMessagesProvider>
    </AuthProvider>
  );
}
