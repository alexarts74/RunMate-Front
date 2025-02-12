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
    const token = await pushNotificationService.registerForPushNotifications();
    setHasPermission(!!token);
  };

  useEffect(() => {
    registerForPushNotifications();
    // Écouteur pour les notifications reçues quand l'app est ouverte
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        notification.request.content.data;
      });

    // Écouteur pour les clics sur les notifications
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        if (data.message_id) {
          router.push(`/(app)/chat/${data.sender_id}`);
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
