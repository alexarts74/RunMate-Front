import React, { createContext, useEffect, useState } from "react";
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
  const router = useRouter();

  const registerForPushNotifications = async () => {
    const token = await pushNotificationService.registerForPushNotifications();
    setHasPermission(!!token);
  };

  useEffect(() => {
    registerForPushNotifications();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data.message_id) {
          router.push(`/(app)/messages/${data.sender_id}`);
        }
      }
    );

    return () => {
      subscription.remove();
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
