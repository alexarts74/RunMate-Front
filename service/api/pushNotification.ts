import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { apiClient } from "../api/client";

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
    let token;

    if (!Device.isDevice) {
      console.log("Les notifications nécessitent un appareil physique");
      return;
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
      return;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PROJECT_ID,
      })
    ).data;

    // Envoyer le token au backend
    try {
      await apiClient.put("/users/update_push_token", {
        expo_push_token: token,
      });
      console.log("Token enregistré avec succès:", token);
    } catch (error) {
      console.error("Erreur mise à jour token:", error);
    }

    return token;
  },

  // Pour gérer le clic sur une notification
  async handleNotificationResponse(
    response: Notifications.NotificationResponse
  ) {
    const data = response.notification.request.content.data;

    if (data.message_id) {
      // Navigation vers la conversation
      // Tu devras implémenter cette fonction
      // navigateToConversation(data.sender_id);
      console.log("data.sender_id", data.sender_id);
    }
  },
};
