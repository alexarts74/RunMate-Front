import { useAuth } from "@/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";

type ProfileViewProps = {
  setIsEditing: (value: boolean) => void;
};

export function ProfileView({ setIsEditing }: ProfileViewProps) {

  const { user } = useAuth();

  if (!user) {
    console.log("Pas de données utilisateur");
    return (
      <View className="flex-1 bg-dark px-5 py-6 justify-center items-center">
        <Text className="text-white">Chargement...</Text>
      </View>
    );
  }
  console.log("DANS LA PROFILE VIEW", user);


  return (

    <ScrollView className="flex-1 bg-dark px-5 py-6 pt-12">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-white">Mon Profil</Text>
        <Pressable
          onPress={() => setIsEditing(true)}
          className="flex-row items-center bg-orange-500 px-6 py-3 rounded-full shadow-lg"
        >
          <Ionicons name="pencil" size={20} color="white" className="mr-2" />
        </Pressable>
      </View>

      <View className="items-center mb-6">
        <Image
          source={
            user?.profile_image
              ? { uri: user.profile_image }
              : require("@/assets/images/react-logo.png")
          }
          className="w-32 h-32 rounded-full"
        />
      </View>

      <View className="space-y-4">
        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400">Nom complet</Text>
          <Text className="text-white text-lg">
            {user?.name} {user?.last_name}
          </Text>
        </View>

        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400">Email</Text>
          <Text className="text-white text-lg">{user?.email}</Text>
        </View>

        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400">Âge</Text>
          <Text className="text-white text-lg">{user?.age} ans</Text>
        </View>

        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400">Genre</Text>
          <Text className="text-white text-lg">{user?.gender}</Text>
        </View>

        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400">Localisation</Text>
          <Text className="text-white text-lg">{user?.location}</Text>
        </View>

        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400">Bio</Text>
          <Text className="text-white text-lg">{user?.bio}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
