import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const GetPremiumVersion = () => {
  return (
    <View className="mx-4 my-3">
      <Pressable
        className="bg-[#1e2429]/80 p-4 rounded-xl border border-green/20 overflow-hidden"
        style={{
          shadowColor: "#b9f144",
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
              <Ionicons name="star" size={20} color="#b9f144" />
              <Text className="text-green font-bold text-base ml-2">
                Premium
              </Text>
            </View>
            <Text className="text-white text-sm mb-2">
              Comming soon... Accédez à toutes les courses à proximité de chez
              vous !
            </Text>
            <View className="flex-row items-center">
              <Text className="text-white/80 text-xs">À partir de </Text>
              <Text className="text-green font-bold text-base mx-1">4.99€</Text>
              <Text className="text-white/80 text-xs">/mois</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default GetPremiumVersion;
