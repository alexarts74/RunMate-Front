import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { apiClient } from "../api/client";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

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
    console.log("🚀 Début registerForPushNotifications dans le Service");
    try {
      if (!Device.isDevice) {
        console.log("❌ Appareil non physique détecté");
        return null;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      console.log("📱 Status des permissions:", existingStatus);

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log("🔔 Nouvelles permissions:", status);
      }

      if (finalStatus !== "granted") {
        console.log("⛔ Permissions refusées");
        return null;
      }

      const expoPushToken = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PROJECT_ID,
      });
      console.log("🎟️ Token Expo généré:", expoPushToken.data);

      // Envoyer le token au backend
      await apiClient.put("/users/update_push_token", {
        expo_push_token: expoPushToken.data,
      });
      console.log("💾 Token sauvegardé dans le backend");

      return expoPushToken.data;
    } catch (error) {
      console.error("❌ Erreur dans registerForPushNotifications:", error);
      return null;
    }
  },

  // Pour gérer le clic sur une notification
  // Fix le any !

  handleNotificationResponse(response: Notifications.NotificationResponse) {
    const data = response.notification.request.content.data;
    console.log("🎯 Gestion du clic sur notification:", data);
    switch (data.type) {
      case "message":
        console.log("💬 Navigation vers le message");
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
