import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { apiClient } from "../api/client";
import { useRouter } from "expo-router";

const router = useRouter();

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const pushNotificationService = {
  async registerForPushNotifications() {
    try {
      if (!Device.isDevice) {
        console.log("Les notifications nécessitent un appareil physique");
        return null;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Permission refusée pour les notifications");
        return null;
      }

      const expoPushToken = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PROJECT_ID,
      });

      // Envoyer le token au backend
      await apiClient.put("/users/update_push_token", {
        expo_push_token: expoPushToken.data,
      });

      return expoPushToken.data;
    } catch (error) {
      console.error("Erreur dans registerForPushNotifications:", error);
      return null;
    }
  },

  // Pour gérer le clic sur une notification
  // Fix le any !

  handleNotificationResponse(response: Notifications.NotificationResponse) {
    const data = response.notification.request.content.data;
    switch (data.type) {
      case "message":
        router.push(`/messages/${data.sender_id}` as any);
        break;
      case "match":
        router.push(`/matches/${data.matched_user_id}` as any);
        break;
      case "run_invitation":
        router.push(`/run/${data.run_id}` as any);
        break;
    }
  },
};
