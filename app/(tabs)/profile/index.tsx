import React, { useState } from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { RunnerProfileView } from "@/components/profile/RunnerProfileView";
import { RunnerProfileEditForm } from "@/components/profile/RunnerProfileEditForm";
import { OrganizerProfileView } from "@/components/profile/OrganizerProfileView";
import { OrganizerProfileEditForm } from "@/components/profile/OrganizerProfileEditForm";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";

type TabType = "profile" | "runner" | "settings";
type SettingsType = "main" | "notifications" | "privacy";

const ACCENT = "#F97316";

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [activeSettings, setActiveSettings] = useState<SettingsType>("main");
  const { logout, deleteAccount, user } = useAuth();

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer le compte",
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: deleteAccount,
        },
      ]
    );
  };

  const isOrganizer = user?.user_type === "organizer";

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        if (isOrganizer) {
          return isEditing ? (
            <OrganizerProfileEditForm setIsEditing={setIsEditing} />
          ) : (
            <OrganizerProfileView setIsEditing={setIsEditing} />
          );
        }
        return isEditing ? (
          <ProfileEditForm setIsEditing={setIsEditing} />
        ) : (
          <ProfileView setIsEditing={setIsEditing} />
        );
      case "runner":
        if (isOrganizer) {
          return <ProfileView setIsEditing={setIsEditing} />;
        }
        return isEditing ? (
          <RunnerProfileEditForm setIsEditing={setIsEditing} />
        ) : (
          <RunnerProfileView setIsEditing={setIsEditing} />
        );
      case "settings":
        switch (activeSettings) {
          case "notifications":
            return (
              <View className="flex-1 bg-white">
                <View className="flex-row items-center px-6 py-4 border-b border-neutral-100">
                  <Pressable
                    onPress={() => setActiveSettings("main")}
                    className="w-10 h-10 rounded-full bg-neutral-100 items-center justify-center mr-3"
                  >
                    <Ionicons name="arrow-back" size={20} color="#525252" />
                  </Pressable>
                  <Text className="text-xl font-nunito-bold text-neutral-900">
                    Notifications
                  </Text>
                </View>
                <NotificationSettings />
              </View>
            );
          case "privacy":
            return (
              <View className="flex-1 bg-white">
                <View className="flex-row items-center px-6 py-4 border-b border-neutral-100">
                  <Pressable
                    onPress={() => setActiveSettings("main")}
                    className="w-10 h-10 rounded-full bg-neutral-100 items-center justify-center mr-3"
                  >
                    <Ionicons name="arrow-back" size={20} color="#525252" />
                  </Pressable>
                  <Text className="text-xl font-nunito-bold text-neutral-900">
                    Confidentialité
                  </Text>
                </View>
                <PrivacySettings />
              </View>
            );
          default:
            return (
              <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
                <View className="px-6 py-6">
                  <Text className="text-2xl font-nunito-bold text-neutral-900 mb-6">
                    Paramètres
                  </Text>

                  <View style={{ gap: 12 }}>
                    <Pressable
                      className="flex-row items-center justify-between bg-neutral-100 p-4 rounded-2xl"
                      onPress={() => setActiveSettings("notifications")}
                    >
                      <View className="flex-row items-center">
                        <View
                          className="w-11 h-11 rounded-xl items-center justify-center mr-3"
                          style={{ backgroundColor: `${ACCENT}15` }}
                        >
                          <Ionicons name="notifications-outline" size={22} color={ACCENT} />
                        </View>
                        <Text className="text-neutral-800 font-nunito-bold text-base">
                          Notifications
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#A3A3A3" />
                    </Pressable>

                    <Pressable
                      className="flex-row items-center justify-between bg-neutral-100 p-4 rounded-2xl"
                      onPress={() => setActiveSettings("privacy")}
                    >
                      <View className="flex-row items-center">
                        <View
                          className="w-11 h-11 rounded-xl items-center justify-center mr-3"
                          style={{ backgroundColor: `${ACCENT}15` }}
                        >
                          <Ionicons name="lock-closed-outline" size={22} color={ACCENT} />
                        </View>
                        <Text className="text-neutral-800 font-nunito-bold text-base">
                          Confidentialité
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#A3A3A3" />
                    </Pressable>

                    <Pressable className="flex-row items-center justify-between bg-neutral-100 p-4 rounded-2xl">
                      <View className="flex-row items-center">
                        <View
                          className="w-11 h-11 rounded-xl items-center justify-center mr-3"
                          style={{ backgroundColor: `${ACCENT}15` }}
                        >
                          <Ionicons name="help-circle-outline" size={22} color={ACCENT} />
                        </View>
                        <Text className="text-neutral-800 font-nunito-bold text-base">
                          Aide
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#A3A3A3" />
                    </Pressable>
                  </View>

                  <View className="mt-8" style={{ gap: 12 }}>
                    <Pressable
                      className="py-4 rounded-2xl items-center"
                      style={{ backgroundColor: ACCENT }}
                      onPress={logout}
                    >
                      <Text className="text-white font-nunito-bold text-base">
                        Se déconnecter
                      </Text>
                    </Pressable>

                    <Pressable
                      className="bg-white border-2 border-red-500 py-4 rounded-2xl items-center"
                      onPress={handleDeleteAccount}
                    >
                      <Text className="text-red-500 font-nunito-bold text-base">
                        Supprimer le compte
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>
            );
        }
    }
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Tabs */}
        <View className="flex-row px-6 py-4 border-b border-neutral-100" style={{ gap: 8 }}>
          <Pressable
            onPress={() => {
              setActiveTab("profile");
              setIsEditing(false);
              setActiveSettings("main");
            }}
            className="px-5 py-2.5 rounded-full"
            style={{ backgroundColor: activeTab === "profile" ? ACCENT : "#F5F5F5" }}
          >
            <Text
              className={`font-nunito-bold text-sm ${
                activeTab === "profile" ? "text-white" : "text-neutral-600"
              }`}
            >
              {isOrganizer ? "Organisation" : "Profil"}
            </Text>
          </Pressable>

          {!isOrganizer && (
            <Pressable
              onPress={() => {
                setActiveTab("runner");
                setIsEditing(false);
                setActiveSettings("main");
              }}
              className="px-5 py-2.5 rounded-full"
              style={{ backgroundColor: activeTab === "runner" ? ACCENT : "#F5F5F5" }}
            >
              <Text
                className={`font-nunito-bold text-sm ${
                  activeTab === "runner" ? "text-white" : "text-neutral-600"
                }`}
              >
                Runner
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => {
              setActiveTab("settings");
              setIsEditing(false);
              setActiveSettings("main");
            }}
            className="px-5 py-2.5 rounded-full"
            style={{ backgroundColor: activeTab === "settings" ? ACCENT : "#F5F5F5" }}
          >
            <Text
              className={`font-nunito-bold text-sm ${
                activeTab === "settings" ? "text-white" : "text-neutral-600"
              }`}
            >
              Réglages
            </Text>
          </Pressable>
        </View>

        <View className="flex-1">{renderContent()}</View>
      </SafeAreaView>
    </View>
  );
}
