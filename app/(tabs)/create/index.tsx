import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
export default function CreateModal() {
  return (
    <View className="flex-1 bg-black/50 justify-end">
      <View className="bg-[#1e2429] rounded-t-3xl p-6">
        <Text className="text-white text-xl font-bold mb-6 text-center">
          Créer
        </Text>

        <Pressable
          onPress={() => {
            router.push("/events/create");
            router.back();
          }}
          className="flex-row items-center p-4 bg-[#12171b] rounded-xl mb-3"
        >
          <Ionicons name="calendar" size={24} color="#b9f144" />
          <Text className="text-white text-lg ml-4">Créer un événement</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            router.push("/groups/create");
            router.back();
          }}
          className="flex-row items-center p-4 bg-[#12171b] rounded-xl mb-6"
        >
          <Ionicons name="people" size={24} color="#b9f144" />
          <Text className="text-white text-lg ml-4">Créer un groupe</Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          className="bg-[#12171b] p-4 rounded-xl"
        >
          <Text className="text-white text-center">Annuler</Text>
        </Pressable>
      </View>
    </View>
  );
}
