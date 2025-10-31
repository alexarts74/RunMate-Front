import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { RunnerProfileView } from "@/components/profile/RunnerProfileView";
import { RunnerProfileEditForm } from "@/components/profile/RunnerProfileEditForm";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PrivacySettings from "@/components/settings/PrivacySettings";

type TabType = "profile" | "runner" | "settings";
type SettingsType = "main" | "notifications" | "privacy";

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [activeSettings, setActiveSettings] = useState<SettingsType>("main");
  const { logout, deleteAccount } = useAuth();

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

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return isEditing ? (
          <ProfileEditForm setIsEditing={setIsEditing} />
        ) : (
          <ProfileView setIsEditing={setIsEditing} />
        );
      case "runner":
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
                <View className="flex-row items-center px-5 py-4 bg-white border-b border-gray-200">
                  <Pressable
                    onPress={() => setActiveSettings("main")}
                    className="p-2"
                  >
                    <Ionicons name="arrow-back" size={24} color="#FF6B4A" />
                  </Pressable>
                  <Text className="text-xl font-kanit-bold text-gray-900 ml-2">
                    Notifications
                  </Text>
                </View>
                <NotificationSettings />
              </View>
            );
          case "privacy":
            return (
              <View className="flex-1">
                <View className="flex-row items-center px-5 py-4 bg-white border-b border-gray-200">
                  <Pressable
                    onPress={() => setActiveSettings("main")}
                    className="p-2"
                  >
                    <Ionicons name="arrow-back" size={24} color="#FF6B4A" />
                  </Pressable>
                  <Text className="text-xl font-kanit-bold text-gray-900 ml-2">
                    Confidentialité
                  </Text>
                </View>
                <PrivacySettings />
              </View>
            );
          default:
            return (
              <View className="px-5 space-y-4 pt-6">
                <Text className="text-2xl font-kanit-bold text-gray-900 mb-6">
                  Paramètres
                </Text>

                <Pressable
                  className="flex-row items-center justify-between bg-white p-4 rounded-2xl"
                  style={{
                    shadowColor: "#FF6B4A",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                  onPress={() => setActiveSettings("notifications")}
                >
                  <View className="flex-row items-center space-x-3">
                    <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center">
                    <Ionicons
                      name="notifications-outline"
                        size={20}
                        color="#FF6B4A"
                    />
                    </View>
                    <Text className="text-gray-900 font-kanit-bold">
                      Notifications
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#A78BFA" />
                </Pressable>

                <Pressable
                  className="flex-row items-center justify-between bg-white p-4 rounded-2xl"
                  style={{
                    shadowColor: "#A78BFA",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                  onPress={() => setActiveSettings("privacy")}
                >
                  <View className="flex-row items-center space-x-3">
                    <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center">
                    <Ionicons
                      name="lock-closed-outline"
                        size={20}
                        color="#A78BFA"
                    />
                    </View>
                    <Text className="text-gray-900 font-kanit-bold">
                      Confidentialité
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#A78BFA" />
                </Pressable>

                <Pressable 
                  className="flex-row items-center justify-between bg-white p-4 rounded-2xl"
                  style={{
                    shadowColor: "#FF6B4A",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <View className="flex-row items-center space-x-3">
                    <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center">
                    <Ionicons
                      name="help-circle-outline"
                        size={20}
                        color="#FF6B4A"
                    />
                    </View>
                    <Text className="text-gray-900 font-kanit-bold">Aide</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#A78BFA" />
                </Pressable>

                <View className="space-y-4 mt-6">
                  <Pressable
                    className="bg-primary py-4 rounded-full items-center"
                    style={{
                      shadowColor: "#FF6B4A",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                    onPress={logout}
                  >
                    <Text className="text-white font-kanit-bold">
                      Se déconnecter
                    </Text>
                  </Pressable>
                  <Pressable
                    className="bg-white border-2 border-red-500 py-4 rounded-full items-center"
                    onPress={handleDeleteAccount}
                  >
                    <Text className="text-red-500 font-kanit-bold">
                      Supprimer le compte
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
        }
    }
  };

  return (
    <View className="flex-1 bg-fond">
      <View className="flex-row justify-around py-4 px-5 border-b border-gray-200 mt-12">
        <Pressable
          onPress={() => {
            setActiveTab("profile");
            setIsEditing(false);
            setActiveSettings("main");
          }}
          className={`px-4 py-2 rounded-full ${
            activeTab === "profile" ? "bg-primary" : "bg-tertiary"
          }`}
        >
          <Text className={`font-kanit-bold ${activeTab === "profile" ? "text-white" : "text-gray-700"}`}>Profil</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setActiveTab("runner");
            setIsEditing(false);
            setActiveSettings("main");
          }}
          className={`px-4 py-2 rounded-full ${
            activeTab === "runner" ? "bg-primary" : "bg-tertiary"
          }`}
        >
          <Text className={`font-kanit-bold ${activeTab === "runner" ? "text-white" : "text-gray-700"}`}>Runner</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setActiveTab("settings");
            setIsEditing(false);
            setActiveSettings("main");
          }}
          className={`px-4 py-2 rounded-full ${
            activeTab === "settings" ? "bg-primary" : "bg-tertiary"
          }`}
        >
          <Text className={`font-kanit-bold ${activeTab === "settings" ? "text-white" : "text-gray-700"}`}>Réglages</Text>
        </Pressable>
      </View>

      <View className="flex-1">{renderContent()}</View>
    </View>
  );
}
