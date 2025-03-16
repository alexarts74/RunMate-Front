import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { MatchesProvider } from "@/context/MatchesContext";
import AuthenticationGuard from "@/components/auth/AuthenticationGuard";
import { UnreadMessagesProvider } from "@/context/UnreadMessagesContext";
import { NotificationsProvider } from "@/context/NotificationContext";
import * as Notifications from "expo-notifications";
import { loadFonts } from "../utils/fonts";

// Configuration globale des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <AuthProvider>
      <NotificationsProvider>
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
      </NotificationsProvider>
    </AuthProvider>
  );
}
