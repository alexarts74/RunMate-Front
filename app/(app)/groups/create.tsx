import React from "react";
import { View, ScrollView, Pressable, Text, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CreateGroupForm } from "@/components/group/CreateGroupForm";

export default function CreateGroupScreen() {
  return (
    <View className="flex-1 bg-fond">
      <SafeAreaView className="bg-white" edges={['top']}>
        <View
          className="flex-row items-center px-6 py-4 bg-white border-b border-gray-200"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Pressable onPress={() => router.back()} className="mr-4">
            <Ionicons name="close" size={24} color="#FF6B4A" />
          </Pressable>
          <Text className="text-gray-900 text-xl font-kanit-bold flex-1">
            Créer un groupe
          </Text>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-6 bg-fond">
            {/* Description */}
            <Text className="text-gray-600 font-kanit-medium text-base mb-6">
              Créez votre groupe de running et commencez à courir ensemble !
            </Text>

            {/* Formulaire */}
            <CreateGroupForm />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
