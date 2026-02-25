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
import WarmBackground from "@/components/ui/WarmBackground";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeColors } from "@/constants/theme";

type TabType = "profile" | "runner" | "settings";
type SettingsType = "main" | "notifications" | "privacy";

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [activeSettings, setActiveSettings] = useState<SettingsType>("main");
  const { logout, deleteAccount, user } = useAuth();
  const { colors, shadows } = useThemeColors();

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer le compte",
      "Etes-vous sur de vouloir supprimer votre compte ? Cette action est irreversible.",
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
              <View className="flex-1">
                <View
                  className="flex-row items-center px-6 py-4"
                  style={{ borderBottomWidth: 1, borderBottomColor: colors.glass.border }}
                >
                  <Pressable
                    onPress={() => setActiveSettings("main")}
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: colors.glass.light }}
                  >
                    <Ionicons name="arrow-back" size={20} color={colors.text.secondary} />
                  </Pressable>
                  <Text
                    className="text-xl font-nunito-bold"
                    style={{ color: colors.text.primary }}
                  >
                    Notifications
                  </Text>
                </View>
                <NotificationSettings />
              </View>
            );
          case "privacy":
            return (
              <View className="flex-1">
                <View
                  className="flex-row items-center px-6 py-4"
                  style={{ borderBottomWidth: 1, borderBottomColor: colors.glass.border }}
                >
                  <Pressable
                    onPress={() => setActiveSettings("main")}
                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: colors.glass.light }}
                  >
                    <Ionicons name="arrow-back" size={20} color={colors.text.secondary} />
                  </Pressable>
                  <Text
                    className="text-xl font-nunito-bold"
                    style={{ color: colors.text.primary }}
                  >
                    Confidentialite
                  </Text>
                </View>
                <PrivacySettings />
              </View>
            );
          default:
            return (
              <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-6 py-6">
                  <Text
                    className="text-2xl font-nunito-bold mb-6"
                    style={{ color: colors.text.primary }}
                  >
                    Parametres
                  </Text>

                  <View style={{ gap: 12 }}>
                    <Pressable
                      className="flex-row items-center justify-between p-4 rounded-2xl"
                      style={{ backgroundColor: colors.glass.light }}
                      onPress={() => setActiveSettings("notifications")}
                    >
                      <View className="flex-row items-center">
                        <View
                          className="w-11 h-11 rounded-xl items-center justify-center mr-3"
                          style={{ backgroundColor: colors.primary.subtle }}
                        >
                          <Ionicons name="notifications-outline" size={22} color={colors.primary.DEFAULT} />
                        </View>
                        <Text
                          className="font-nunito-bold text-base"
                          style={{ color: colors.text.primary }}
                        >
                          Notifications
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
                    </Pressable>

                    <Pressable
                      className="flex-row items-center justify-between p-4 rounded-2xl"
                      style={{ backgroundColor: colors.glass.light }}
                      onPress={() => setActiveSettings("privacy")}
                    >
                      <View className="flex-row items-center">
                        <View
                          className="w-11 h-11 rounded-xl items-center justify-center mr-3"
                          style={{ backgroundColor: colors.primary.subtle }}
                        >
                          <Ionicons name="lock-closed-outline" size={22} color={colors.primary.DEFAULT} />
                        </View>
                        <Text
                          className="font-nunito-bold text-base"
                          style={{ color: colors.text.primary }}
                        >
                          Confidentialite
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
                    </Pressable>

                    <Pressable
                      className="flex-row items-center justify-between p-4 rounded-2xl"
                      style={{ backgroundColor: colors.glass.light }}
                    >
                      <View className="flex-row items-center">
                        <View
                          className="w-11 h-11 rounded-xl items-center justify-center mr-3"
                          style={{ backgroundColor: colors.primary.subtle }}
                        >
                          <Ionicons name="help-circle-outline" size={22} color={colors.primary.DEFAULT} />
                        </View>
                        <Text
                          className="font-nunito-bold text-base"
                          style={{ color: colors.text.primary }}
                        >
                          Aide
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
                    </Pressable>
                  </View>

                  <View className="mt-8" style={{ gap: 12 }}>
                    <GlassButton
                      title="Se deconnecter"
                      onPress={logout}
                      variant="primary"
                    />

                    <Pressable
                      className="py-4 rounded-2xl items-center"
                      style={{
                        backgroundColor: colors.elevated,
                        borderWidth: 2,
                        borderColor: colors.error,
                      }}
                      onPress={handleDeleteAccount}
                    >
                      <Text
                        className="font-nunito-bold text-base"
                        style={{ color: colors.error }}
                      >
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
    <WarmBackground>
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Tabs */}
        <View
          className="flex-row px-6 py-4"
          style={{ gap: 8, borderBottomWidth: 1, borderBottomColor: colors.glass.border }}
        >
          <Pressable
            onPress={() => {
              setActiveTab("profile");
              setIsEditing(false);
              setActiveSettings("main");
            }}
            className="px-5 py-2.5 rounded-full"
            style={{
              backgroundColor:
                activeTab === "profile" ? colors.primary.DEFAULT : colors.glass.light,
            }}
          >
            <Text
              className="font-nunito-bold text-sm"
              style={{
                color:
                  activeTab === "profile" ? colors.text.inverse : colors.text.secondary,
              }}
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
              style={{
                backgroundColor:
                  activeTab === "runner" ? colors.primary.DEFAULT : colors.glass.light,
              }}
            >
              <Text
                className="font-nunito-bold text-sm"
                style={{
                  color:
                    activeTab === "runner" ? colors.text.inverse : colors.text.secondary,
                }}
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
            style={{
              backgroundColor:
                activeTab === "settings" ? colors.primary.DEFAULT : colors.glass.light,
            }}
          >
            <Text
              className="font-nunito-bold text-sm"
              style={{
                color:
                  activeTab === "settings" ? colors.text.inverse : colors.text.secondary,
              }}
            >
              Reglages
            </Text>
          </Pressable>
        </View>

        <View className="flex-1">{renderContent()}</View>
      </SafeAreaView>
    </WarmBackground>
  );
}
