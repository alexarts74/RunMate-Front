import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const GetPremiumVersion = () => {
  return (
    <View className="mx-4 my-3">
      <Pressable
        className="bg-[#1e2429] p-4 rounded-xl border border-purple/20 overflow-hidden"
        style={{
          shadowColor: "#8101f7",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
        onPress={() => router.push("/")}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <Ionicons name="diamond-outline" size={24} color="#8101f7" />
              <Text className="text-purple font-bold text-lg ml-2">
                Version Premium
              </Text>
            </View>
            <Text className="text-white text-sm mb-3">
              Accédez à toutes les courses à proximité de chez vous !
            </Text>
            <View className="flex-row items-center">
              <Text className="text-white/80 text-sm">À partir de </Text>
              <Text className="text-purple font-bold text-lg mx-1">4.99€</Text>
              <Text className="text-white/80 text-sm">/mois</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#8101f7" />
        </View>
      </Pressable>
    </View>
  );
};

export default GetPremiumVersion;
