import { Stack } from "expo-router";
import React, { useEffect, useRef } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { MatchesProvider } from "@/context/MatchesContext";
import AuthenticationGuard from "@/components/auth/AuthenticationGuard";
import { UnreadMessagesProvider } from "@/context/UnreadMessagesContext";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { NotificationsProvider } from "@/context/NotificationContext";
import { pushNotificationService } from "@/service/api/pushNotification";

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const router = useRouter();

  useEffect(() => {
    // Enregistrer pour les notifications
    pushNotificationService.registerForPushNotifications();

    // Écouteur pour les notifications reçues quand l'app est ouverte
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const data = notification.request.content.data;
        console.log("Notification reçue:", data);
      });

    // Écouteur pour les clics sur les notifications
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        // Navigation vers la conversation si c'est une notification de message
        if (data.message_id) {
          router.push(`/(app)/messages/${data.sender_id}`);
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
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
