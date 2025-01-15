import React from "react";
import { View, ScrollView, Pressable, Text } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CreateGroupForm } from "@/components/group/CreateGroupForm";

export default function CreateGroupScreen() {
  return (
    <View className="flex-1 bg-[#12171b] pt-14">
      <ScrollView>
        <View className="p-5">
          {/* Header avec bouton retour */}
          <View className="flex-row items-center mb-6">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="#b9f144" />
            </Pressable>
            <Text className="text-2xl font-bold text-white ml-2">
              Créer un groupe
            </Text>
          </View>

          {/* Description */}
          <Text className="text-white mb-6 ml-1">
            Créez votre groupe de running et commencez à courir ensemble !
          </Text>

          {/* Formulaire */}
          <CreateGroupForm />
        </View>
      </ScrollView>
    </View>
  );
}
