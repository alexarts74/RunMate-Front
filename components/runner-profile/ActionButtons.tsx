import React from "react";
import { View, Pressable, Text, ActivityIndicator } from "react-native";
import { router } from "expo-router";

type Props = {
  loading: boolean;
  handleSubmit: () => Promise<void>;
};

export function ActionButtons({ loading, handleSubmit }: Props) {
  return (
    <View className="space-y-3 px-8 mb-4">
      <Pressable
        className={`bg-purple py-3 rounded-full items-center ${
          loading ? "opacity-70" : ""
        }`}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-sm font-semibold text-white">
            Sauvegarder mon profil
          </Text>
        )}
      </Pressable>

      <Pressable
        className="py-3 rounded-full items-center border border-purple"
        onPress={() => router.replace("/(tabs)/matches")}
      >
        <Text className="text-sm font-semibold text-purple">
          Passer cette étape
        </Text>
      </Pressable>
    </View>
  );
}
