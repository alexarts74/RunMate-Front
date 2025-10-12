import { Stack } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { MatchesProvider } from "@/context/MatchesContext";
import AuthenticationGuard from "@/components/auth/AuthenticationGuard";
import { UnreadMessagesProvider } from "@/context/UnreadMessagesContext";
import { NotificationsProvider } from "@/context/NotificationContext";
import { StripeContextProvider } from "@/context/StripeContext";
import * as Notifications from "expo-notifications";
import { loadFonts } from "../utils/fonts";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";

// Empêcher le splash screen de se cacher automatiquement
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore l'erreur */
});

// Configuration globale des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Charger les polices et autres ressources
        await loadFonts();
      } catch (e) {
        console.warn("Erreur lors du chargement des ressources:", e);
      } finally {
        // Marquer l'app comme prête
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Cacher le splash screen natif avec un délai
      setTimeout(async () => {
        await SplashScreen.hideAsync().catch(() => {
          /* ignore l'erreur */
        });
      }, 500);
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AuthProvider>
        <AuthenticationGuard>
          <NotificationsProvider>
            <UnreadMessagesProvider>
              <MatchesProvider>
                <StripeContextProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen
                      name="index"
                      options={{ headerShown: false }}
                    />
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
                </StripeContextProvider>
              </MatchesProvider>
            </UnreadMessagesProvider>
          </NotificationsProvider>
        </AuthenticationGuard>
      </AuthProvider>
    </View>
  );
}
