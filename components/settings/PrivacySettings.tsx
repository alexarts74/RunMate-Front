import React, { useState } from "react";
import { View } from "react-native";
import { styled } from "nativewind";
import SettingsSection from "./SettingsSection";

const StyledView = styled(View);

export default function PrivacySettings() {
  const [settings, setSettings] = useState({
    profileVisibility: true,
    locationSharing: true,
    activitySharing: true,
    showDistance: true,
    showPace: true,
    showStats: true,
  });

  return (
    <StyledView className="space-y-6 px-5 flex-1">
      <SettingsSection
        description="Contrôlez ce que les autres runners peuvent voir de votre profil."
        items={[
          {
            icon: "eye-outline",
            title: "Visibilité du profil",
            description: "Rendre votre profil visible pour les autres runners",
            value: settings.profileVisibility,
            onToggle: () =>
              setSettings((prev) => ({
                ...prev,
                profileVisibility: !prev.profileVisibility,
              })),
          },
          {
            icon: "location-outline",
            title: "Partage de localisation",
            description: "Permettre aux autres de voir votre zone de course",
            value: settings.locationSharing,
            onToggle: () =>
              setSettings((prev) => ({
                ...prev,
                locationSharing: !prev.locationSharing,
              })),
          },
          {
            icon: "share-social-outline",
            title: "Partage d'activité",
            description: "Permettre aux autres de voir vos courses",
            value: settings.activitySharing,
            onToggle: () =>
              setSettings((prev) => ({
                ...prev,
                activitySharing: !prev.activitySharing,
              })),
          },
          {
            icon: "resize-outline",
            title: "Afficher la distance",
            description: "Montrer votre distance habituelle",
            value: settings.showDistance,
            onToggle: () =>
              setSettings((prev) => ({
                ...prev,
                showDistance: !prev.showDistance,
              })),
          },
          {
            icon: "speedometer-outline",
            title: "Afficher le pace",
            description: "Montrer votre rythme de course",
            value: settings.showPace,
            onToggle: () =>
              setSettings((prev) => ({
                ...prev,
                showPace: !prev.showPace,
              })),
          },
          {
            icon: "stats-chart-outline",
            title: "Afficher les statistiques",
            description: "Montrer vos statistiques de course",
            value: settings.showStats,
            onToggle: () =>
              setSettings((prev) => ({
                ...prev,
                showStats: !prev.showStats,
              })),
          },
        ]}
      />
    </StyledView>
  );
}
