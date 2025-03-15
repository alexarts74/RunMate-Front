import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { apiClient } from "../api/client";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authStorage } from "../auth/storage";

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NOTIFICATION_SETTINGS_KEY = "@notification_settings";

export const pushNotificationService = {
  async registerForPushNotifications() {
    try {
      if (!Device.isDevice) {
        console.log("❌ Pas un appareil physique");
        return null;
      }

      // Vérifier si on a déjà la permission
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Sinon, demander la permission
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("❌ Permission refusée");
        return null;
      }

      // Obtenir le token
      const expoPushToken = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PROJECT_ID,
      });

      console.log("✅ Token Expo obtenu:", expoPushToken.data);

      // Vérifier le token d'authentification
      const authToken = await authStorage.getToken();
      console.log(
        "🔑 Token d'authentification:",
        authToken ? "Présent" : "Absent"
      );

      // Envoyer le token au backend
      const response = await apiClient.put("/users/update_push_token", {
        user: {
          expo_push_token: expoPushToken.data,
        },
      });

      console.log("📡 Réponse du backend:", response);
      console.log("✅ Token enregistré sur le backend");
      return expoPushToken.data;
    } catch (error) {
      console.error("❌ Erreur dans registerForPushNotifications:", error);
      return null;
    }
  },

  async loadNotificationPreferences() {
    try {
      // D'abord, essayer de charger depuis le stockage local
      const savedSettings = await AsyncStorage.getItem(
        NOTIFICATION_SETTINGS_KEY
      );
      let settings = savedSettings ? JSON.parse(savedSettings) : null;

      // Si pas de paramètres locaux ou forcer le rechargement, charger depuis le serveur
      if (!settings) {
        const response = await apiClient.get("/notifications/preferences");

        if (response?.notification_preferences) {
          settings = {
            matchNotifications:
              response.notification_preferences.match_notifications ?? true,
            messageNotifications:
              response.notification_preferences.message_notifications ?? true,
          };

          // Sauvegarder les nouveaux paramètres localement
          await AsyncStorage.setItem(
            NOTIFICATION_SETTINGS_KEY,
            JSON.stringify(settings)
          );
        } else {
          settings = {
            matchNotifications: true,
            messageNotifications: true,
          };
        }
      }

      return settings;
    } catch (error) {
      console.error("❌ Erreur lors du chargement des préférences:", error);
      return {
        matchNotifications: true,
        messageNotifications: true,
      };
    }
  },

  async updateNotificationPreference(key: string, value: boolean) {
    try {
      const keyMapping: { [key: string]: string } = {
        matchNotifications: "match_notifications",
        messageNotifications: "message_notifications",
      };

      // Mettre à jour sur le serveur
      await apiClient.put("/notifications/preferences", {
        notification_preferences: {
          [keyMapping[key]]: value,
        },
      });

      // Mettre à jour le stockage local
      const currentSettings = await this.loadNotificationPreferences();
      const newSettings = {
        ...currentSettings,
        [key]: value,
      };
      await AsyncStorage.setItem(
        NOTIFICATION_SETTINGS_KEY,
        JSON.stringify(newSettings)
      );

      return newSettings;
    } catch (error) {
      console.error("❌ Erreur mise à jour préférence:", error);
      throw error;
    }
  },

  handleNotificationResponse(response: Notifications.NotificationResponse) {
    const data = response.notification.request.content.data;
    switch (data.type) {
      case "message":
        router.push(`/chat/${data.sender_id}`);
        break;
      case "match":
        router.push(`/matches/${data.matched_user_id}`);
        break;
      case "run_invitation":
        router.push(`/run/${data.run_id}`);
        break;
      default:
        console.log("Type de notification non géré:", data.type);
    }
  },
};
