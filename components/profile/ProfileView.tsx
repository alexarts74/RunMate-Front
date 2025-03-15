import React from "react";
import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text, Image, Pressable, ScrollView } from "react-native";

type ProfileViewProps = {
  setIsEditing: (value: boolean) => void;
};

export function ProfileView({ setIsEditing }: ProfileViewProps) {
  const { user } = useAuth();

  return (
    <ScrollView
      className="flex-1 bg-background px-5 py-6 pt-6 pb-24"
      contentContainerStyle={{ paddingBottom: 150 }}
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-white">Mon Profil</Text>
        <Pressable
          onPress={() => setIsEditing(true)}
          className="flex-row items-center px-3 py-3 rounded-full"
        >
          <Ionicons name="pencil" size={20} color="#8101f7" />
        </Pressable>
      </View>

      <View className="items-center mb-8">
        <Image
          source={
            user?.profile_image
              ? { uri: user?.profile_image }
              : require("@/assets/images/react-logo.png")
          }
          className="w-32 h-32 rounded-full border-2 border-green"
        />
      </View>

      <View className="space-y-4">
        <View>
          <Text className="text-white text-sm font-semibold pl-2 mb-1">
            Nom complet
          </Text>
          <View className="w-full border border-[#2a3238] rounded-full p-4 bg-[#1e2429]">
            <Text className="text-white">
              {user?.first_name} {user?.last_name}
            </Text>
          </View>
        </View>

        <View>
          <Text className="text-white text-sm font-semibold pl-2 mb-1">
            Email
          </Text>
          <View className="w-full border border-[#2a3238] rounded-full p-4 bg-[#1e2429]">
            <Text className="text-white">{user?.email}</Text>
          </View>
        </View>

        <View>
          <Text className="text-white text-sm font-semibold pl-2 mb-1">
            Âge
          </Text>
          <View className="w-full border border-[#2a3238] rounded-full p-4 bg-[#1e2429]">
            <Text className="text-white">{user?.age} ans</Text>
          </View>
        </View>

        <View>
          <Text className="text-white text-sm font-semibold pl-2 mb-1">
            Genre
          </Text>
          <View className="w-full border border-[#2a3238] rounded-full p-4 bg-[#1e2429]">
            <Text className="text-white">{user?.gender}</Text>
          </View>
        </View>

        <View>
          <Text className="text-white text-sm font-semibold pl-2 mb-1">
            Bio
          </Text>
          <View className="w-full border border-[#2a3238] rounded-2xl p-4 bg-[#1e2429]">
            <Text className="text-white">{user?.bio}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
