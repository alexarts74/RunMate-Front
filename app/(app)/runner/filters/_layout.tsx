import React from "react";
import { View, ScrollView } from "react-native";
import { FiltersContent } from "@/components/filters/FiltersContent";

export default function FilterScreen() {
  return (
    <ScrollView className="flex-1 bg-[#12171b] pt-12">
      <View className="px-5 py-6">
        <FiltersContent />
      </View>
    </ScrollView>
  );
}
