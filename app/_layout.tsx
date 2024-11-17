import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext";
import React from "react";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="(tabs)"
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="(modals)"
          options={{
            presentation: "modal",
            headerShown: true,
            headerBackTitle: "Retour",
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
