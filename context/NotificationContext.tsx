import React, { createContext, useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { pushNotificationService } from "@/service/api/pushNotification";
import { useRouter } from "expo-router";

type NotificationsContextType = {
  hasPermission: boolean;
  registerForPushNotifications: () => Promise<void>;
};

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasPermission, setHasPermission] = useState(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const router = useRouter();

  const registerForPushNotifications = async () => {
    console.log("🚀 Démarrage enregistrement notifications dans le Context");
    const token = await pushNotificationService.registerForPushNotifications();
    console.log("✅ Token reçu dans le Context:", token);
    setHasPermission(!!token);
  };

  useEffect(() => {
    registerForPushNotifications();
    console.log("👂 Mise en place des écouteurs de notifications");

    // Écouteur pour les notifications reçues quand l'app est ouverte
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const data = notification.request.content.data;
        console.log("📬 Notification reçue (app ouverte):", data);
      });

    // Écouteur pour les clics sur les notifications
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("👆 Clic sur notification:", data);

        if (data.message_id) {
          router.push(`/(app)/chat/${data.sender_id}`);
        }
      });

    return () => {
      console.log("🧹 Nettoyage des écouteurs de notifications");
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        hasPermission,
        registerForPushNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = React.useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications doit être utilisé dans un NotificationsProvider"
    );
  }
  return context;
}
