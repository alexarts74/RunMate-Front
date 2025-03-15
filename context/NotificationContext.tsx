import React, { createContext, useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { pushNotificationService } from "@/service/api/pushNotification";
import { useRouter } from "expo-router";
import { useAuth } from "./AuthContext";

type NotificationsContextType = {
  hasPermission: boolean;
  registerForPushNotifications: () => Promise<void>;
  notificationSettings: {
    matchNotifications: boolean;
    messageNotifications: boolean;
  };
  updateNotificationSetting: (key: string, value: boolean) => Promise<void>;
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
  const [notificationSettings, setNotificationSettings] = useState({
    matchNotifications: true,
    messageNotifications: true,
  });
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const router = useRouter();
  const { user } = useAuth();

  const registerForPushNotifications = async () => {
    try {
      const token =
        await pushNotificationService.registerForPushNotifications();
      if (token) {
        setHasPermission(true);
        // Charger les préférences de notification après l'enregistrement
        const settings =
          await pushNotificationService.loadNotificationPreferences();
        setNotificationSettings(settings);
      }
    } catch (error) {
      console.error(
        "❌ Erreur lors de l'enregistrement des notifications:",
        error
      );
      setHasPermission(false);
    }
  };

  const updateNotificationSetting = async (key: string, value: boolean) => {
    try {
      await pushNotificationService.updateNotificationPreference(key, value);
      setNotificationSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour des préférences:", error);
    }
  };

  useEffect(() => {
    // Enregistrer les notifications quand l'utilisateur est connecté
    if (user) {
      registerForPushNotifications();
    }

    // Écouteur pour les notifications reçues quand l'app est ouverte
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const data = notification.request.content.data;
        console.log("📬 Notification reçue:", data);
      });

    // Écouteur pour les clics sur les notifications
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        pushNotificationService.handleNotificationResponse(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user]);

  return (
    <NotificationsContext.Provider
      value={{
        hasPermission,
        registerForPushNotifications,
        notificationSettings,
        updateNotificationSetting,
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
