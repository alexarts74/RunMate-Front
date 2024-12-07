import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
type ProfileViewProps = {
  setIsEditing: (value: boolean) => void;
};

export function ProfileView({ setIsEditing }: ProfileViewProps) {
  const { user, logout} = useAuth();
  const router = useRouter();
  console.log("User dans ProfileView:", user?.name);

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  if (!user?.id) {
    return (
      <View className="flex-1 bg-[#12171b] px-5 py-6 justify-center items-center">
        <Text className="text-white">Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-[#12171b] px-5 py-6 pt-12 pb-24"
      contentContainerStyle={{ paddingBottom: 150 }}
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-white">Mon Profil</Text>
        <Pressable
          onPress={() => setIsEditing(true)}
          className="flex-row items-center px-6 py-3 rounded-full shadow-lg"
        >
          <Ionicons name="pencil" size={20} color="white" className="mr-2" />
        </Pressable>
      </View>

      <View className="items-center mb-6">
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
        <View className="bg-gray p-2 rounded-lg">
          <Text className="text-gray-400">Nom complet</Text>
          <Text className="text-white text-lg">
            {user?.name} {user?.last_name}
          </Text>
        </View>

        <View className="bg-gray p-2 rounded-lg">
          <Text className="text-gray-400">Email</Text>
          <Text className="text-white text-lg">{user?.email}</Text>
        </View>

        <View className="bg-gray p-2 rounded-lg">
          <Text className="text-gray-400">Âge</Text>
          <Text className="text-white text-lg">{user?.age} ans</Text>
        </View>

        <View className="bg-gray p-2 rounded-lg">
          <Text className="text-gray-400">Genre</Text>
          <Text className="text-white text-lg">{user?.gender}</Text>
        </View>

        <View className="bg-gray p-2 rounded-lg">
          <Text className="text-gray-400">Localisation</Text>
          <Text className="text-white text-lg">{user?.location}</Text>
        </View>

        <View className="bg-gray p-2 mb-4 rounded-lg">
          <Text className="text-gray-400">Bio</Text>
          <Text className="text-white text-lg">{user?.bio}</Text>
        </View>

        <Pressable className="bg-transparent border border-green py-3 rounded-full w-4/5 mx-auto items-center" onPress={handleLogout}>
          <Text className="text-green font-semibold">Se déconnecter</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
