import React, { useState } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { ProfileView } from "@/components/profile/ProfileView";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { RunnerProfileView } from "@/components/profile/RunnerProfileView";
import { RunnerProfileEditForm } from "@/components/profile/RunnerProfileEditForm";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

type TabType = "profile" | "runner" | "settings";

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isEditing, setIsEditing] = useState(false);
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
        return (
          <View className="px-5 space-y-4">
            <Text className="text-2xl font-bold text-white mb-6 mt-6">
              Paramètres
            </Text>

            <Pressable className="flex-row items-center justify-between bg-[#1e2429] p-4 rounded-2xl">
              <View className="flex-row items-center space-x-3">
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="#b9f144"
                />
                <Text className="text-white font-semibold">Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </Pressable>

            <Pressable className="flex-row items-center justify-between bg-[#1e2429] p-4 rounded-2xl">
              <View className="flex-row items-center space-x-3">
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color="#b9f144"
                />
                <Text className="text-white font-semibold">
                  Confidentialité
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </Pressable>

            <Pressable className="flex-row items-center justify-between bg-[#1e2429] p-4 rounded-2xl">
              <View className="flex-row items-center space-x-3">
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color="#b9f144"
                />
                <Text className="text-white font-semibold">Aide</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </Pressable>

            <View className="space-y-4 mt-6">
              <Pressable
                className="bg-transparent border border-green py-4 rounded-full items-center mt-6"
                onPress={logout}
              >
                <Text className="text-green font-semibold">Se déconnecter</Text>
              </Pressable>
              <Pressable
                className="bg-transparent border border-red-500 py-4 rounded-full items-center"
                onPress={handleDeleteAccount}
              >
                <Text className="text-red-500 font-semibold">
                  Supprimer le compte
                </Text>
              </Pressable>
            </View>
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-[#12171b]">
      <View className="flex-row justify-around py-4 px-5 border-b border-[#2a3238] mt-12">
        <Pressable
          onPress={() => {
            setActiveTab("profile");
            setIsEditing(false);
          }}
          className={`px-4 py-2 rounded-full ${
            activeTab === "profile" ? "bg-[#2a3238]" : ""
          }`}
        >
          <Text className="text-white font-semibold">Profil</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setActiveTab("runner");
            setIsEditing(false);
          }}
          className={`px-4 py-2 rounded-full ${
            activeTab === "runner" ? "bg-[#2a3238]" : ""
          }`}
        >
          <Text className="text-white font-semibold">Runner</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setActiveTab("settings");
            setIsEditing(false);
          }}
          className={`px-4 py-2 rounded-full ${
            activeTab === "settings" ? "bg-[#2a3238]" : ""
          }`}
        >
          <Text className="text-white font-semibold">Réglages</Text>
        </Pressable>
      </View>

      <View className="flex-1">{renderContent()}</View>
    </View>
  );
}
