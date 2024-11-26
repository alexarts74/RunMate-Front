import React from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";

type ProfileViewProps = {
  formData: {
    profile_image: string;
    first_name: string;
    last_name: string;
    email: string;
    age: string;
    gender: string;
    location: string;
    bio: string;
  };
  setIsEditing: (value: boolean) => void;
};


export function ProfileView({ formData, setIsEditing }: ProfileViewProps) {
  console.log("formData", formData);
  return (
    <ScrollView className="flex-1 bg-dark px-5 py-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-white">Mon Profil</Text>
        <Pressable
          onPress={() => setIsEditing(true)}
          className="bg-orange-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white">Modifier</Text>
        </Pressable>
      </View>

      <View className="items-center mb-6">
        <Image
          source={
            formData.profile_image
              ? { uri: formData.profile_image }
              : require("@/assets/images/react-logo.png")
          }
          className="w-32 h-32 rounded-full"
        />
      </View>

      <View className="space-y-4">
        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400">Nom complet</Text>
          <Text className="text-white text-lg">
            {formData.first_name} {formData.last_name}
          </Text>
        </View>

        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400">Email</Text>
          <Text className="text-white text-lg">{formData.email}</Text>
        </View>

        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400">Âge</Text>
          <Text className="text-white text-lg">{formData.age} ans</Text>
        </View>

        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400">Genre</Text>
          <Text className="text-white text-lg">{formData.gender}</Text>
        </View>

        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400">Localisation</Text>
          <Text className="text-white text-lg">{formData.location}</Text>
        </View>

        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400">Bio</Text>
          <Text className="text-white text-lg">{formData.bio}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
