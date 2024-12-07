import React from "react";
import { View, ScrollView, TouchableOpacity, Text } from "react-native";
import { FiltersContent } from "@/components/filters/FiltersContent";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function FilterScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-[#12171b]">
      <View className="flex-row items-center justify-start px-5 pt-14">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white ml-2">Filtres</Text>
      </View>
      <View className="px-5 py-12">
        <FiltersContent />
      </View>
    </ScrollView>
  );
}
