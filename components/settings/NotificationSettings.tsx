import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { styled } from "nativewind";
import SettingsSection from "./SettingsSection";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { pushNotificationService } from "@/service/api/pushNotification";

const StyledView = styled(View);

export default function NotificationSettings() {
  const [settings, setSettings] = useState({
    matchNotifications: true,
    messageNotifications: true,
  });

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      // Charger depuis le stockage local d'abord
      const savedSettings = await AsyncStorage.getItem("notificationSettings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }

      // Puis mettre à jour avec les données du serveur
      const serverSettings =
        await pushNotificationService.loadNotificationPreferences();
      setSettings(serverSettings);
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error);
    }
  };

  const toggleNotifications = async (key: string, value: boolean) => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
          return;
        }
      }

      const newSettings = {
        ...settings,
        [key]: !value,
      };

      // Mettre à jour localement
      setSettings(newSettings);
      await AsyncStorage.setItem(
        "notificationSettings",
        JSON.stringify(newSettings)
      );

      // Mettre à jour sur le serveur
      await pushNotificationService.updateNotificationPreference(key, !value);
    } catch (error) {
      console.error("Erreur lors de la modification des paramètres:", error);
      // Restaurer l'ancien état en cas d'erreur
      loadNotificationSettings();
    }
  };

  return (
    <StyledView className="space-y-6 px-5 flex-1">
      <SettingsSection
        description="Gérez vos préférences de notifications"
        items={[
          {
            icon: "people-outline",
            title: "Nouveaux matchs",
            description: "Soyez notifié quand vous avez un nouveau match",
            value: settings.matchNotifications,
            onToggle: () =>
              toggleNotifications(
                "matchNotifications",
                settings.matchNotifications
              ),
          },
          {
            icon: "chatbubble-outline",
            title: "Nouveaux messages",
            description: "Recevez une notification pour chaque nouveau message",
            value: settings.messageNotifications,
            onToggle: () =>
              toggleNotifications(
                "messageNotifications",
                settings.messageNotifications
              ),
          },
        ]}
      />
    </StyledView>
  );
}
