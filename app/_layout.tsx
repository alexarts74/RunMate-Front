import { Stack } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { MatchesProvider } from "@/context/MatchesContext";
import AuthenticationGuard from "@/components/auth/AuthenticationGuard";
import { UnreadMessagesProvider } from "@/context/UnreadMessagesContext";
import { NotificationsProvider } from "@/context/NotificationContext";
import * as Notifications from "expo-notifications";
import { loadFonts } from "../utils/fonts";
import { IntroScreen } from "@/components/IntroScreen";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";

// Empêcher le splash screen de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

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
  const [showIntro, setShowIntro] = useState(true);

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
      // Cacher le splash screen natif
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {showIntro ? (
        <IntroScreen onFinish={() => setShowIntro(false)} />
      ) : (
        <AuthProvider>
          <NotificationsProvider>
            <UnreadMessagesProvider>
              <MatchesProvider>
                <AuthenticationGuard>
                  <Stack screenOptions={{ headerShown: false }}>
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
                </AuthenticationGuard>
              </MatchesProvider>
            </UnreadMessagesProvider>
          </NotificationsProvider>
        </AuthProvider>
      )}
    </View>
  );
}
