import React from "react";
import { View, ScrollView, Pressable, Text } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CreateGroupForm } from "@/components/group/CreateGroupForm";

export default function CreateGroupScreen() {
  return (
    <View className="flex-1 bg-white pt-14">
      <ScrollView>
        <View className="p-5">
          <View className="flex-row items-center mb-6 relative">
            <Pressable
              onPress={() => router.back()}
              className="absolute left-0 z-10 w-10 h-10 items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="#0a7ea4" />
            </Pressable>
            <Text className="text-2xl font-bold text-gray-900 flex-1 text-center">
              Créer un groupe
            </Text>
          </View>

          {/* Description */}
          <Text className="text-gray-700 text-lg mb-6 ml-1">
            Créez votre groupe de running et commencez à courir ensemble !
          </Text>

          {/* Formulaire */}
          <CreateGroupForm />
        </View>
      </ScrollView>
    </View>
  );
}
