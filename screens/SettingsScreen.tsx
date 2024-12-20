import { View, Button } from "react-native";
import React from "react";
import { pushNotificationService } from "@/service/api/pushNotification";

export default function SettingsScreen() {
  const handleTestNotification = async () => {
    try {
      await pushNotificationService.testNotificationSystem();
    } catch (error) {
      console.error("Erreur test notification:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* ... autres éléments ... */}
      <Button
        title="Tester les notifications"
        onPress={handleTestNotification}
      />
    </View>
  );
}
