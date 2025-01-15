import React from "react";
import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { CreateEventForm } from "@/components/group/CreateEventForm";
import { Ionicons } from "@expo/vector-icons";

export default function CreateEventScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-[#12171b] p-5">
      {/* Header avec bouton retour */}
      <Pressable
        onPress={() => router.back()}
        className="flex-row items-center mb-6"
      >
        <Ionicons name="arrow-back" size={24} color="#b9f144" />
        <Text className="text-white text-lg ml-2">Retour</Text>
      </Pressable>

      <CreateEventForm
        groupId={id as string}
        onEventCreated={() => {
          router.back(); // Retour à la page du groupe
        }}
        onClose={() => router.back()}
      />
    </View>
  );
}
