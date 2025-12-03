import React from "react";
import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { OrganizerProfileView } from "./OrganizerProfileView";

type ProfileViewProps = {
  setIsEditing: (value: boolean) => void;
};

export function ProfileView({ setIsEditing }: ProfileViewProps) {
  const { user } = useAuth();

  // Si l'utilisateur est un organisateur, afficher le profil organisateur
  if (user?.user_type === "organizer") {
    return <OrganizerProfileView setIsEditing={setIsEditing} />;
  }

  // Sinon, afficher le profil runner classique
  return (
    <ScrollView
      className="flex-1 bg-fond px-6 py-6 pt-6 pb-24"
      contentContainerStyle={{ paddingBottom: 150 }}
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-nunito-extrabold text-gray-900">Mon Profil</Text>
        <Pressable
          onPress={() => setIsEditing(true)}
          className="flex-row items-center px-3 py-3 rounded-full bg-tertiary"
          style={{
            shadowColor: "#FF6B4A",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons name="pencil" size={20} color="#FF6B4A" />
        </Pressable>
      </View>

      <View className="items-center mb-8">
        <Image
          source={
            user?.profile_image
              ? { uri: user?.profile_image }
              : require("@/assets/images/react-logo.png")
          }
          className="w-32 h-32 rounded-full border-4 border-primary"
        />
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
            Nom complet
          </Text>
          <View className="w-full border border-gray-200 rounded-full p-4 bg-white"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <Text className="text-gray-900 font-nunito-medium">
              {user?.first_name} {user?.last_name}
            </Text>
          </View>
        </View>

        <View>
          <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
            Email
          </Text>
          <View className="w-full border border-gray-200 rounded-full p-4 bg-white"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <Text className="text-gray-900 font-nunito-medium">{user?.email}</Text>
          </View>
        </View>

        <View>
          <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
            Âge
          </Text>
          <View className="w-full border border-gray-200 rounded-full p-4 bg-white"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <Text className="text-gray-900 font-nunito-medium">{user?.age} ans</Text>
          </View>
        </View>

        <View>
          <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
            Genre
          </Text>
          <View className="w-full border border-gray-200 rounded-full p-4 bg-white"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}
          >
            <Text className="text-gray-900 font-nunito-medium">{user?.gender}</Text>
          </View>
        </View>

        <View>
          <Text className="text-gray-700 text-sm font-nunito-bold pl-2 mb-2">
            Bio
          </Text>
          <View className="w-full border border-gray-200 rounded-2xl p-4 bg-white"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text className="text-gray-900 font-nunito-medium">{user?.bio || "Aucune bio"}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
