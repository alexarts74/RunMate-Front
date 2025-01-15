import RunningGroup from "@/components/group/RunningGroup";
import { MatchesCarousel } from "@/components/matches/MatchesCarousel";
import React from "react";
import { View, ScrollView, Text } from "react-native";

const HomepageScreen = () => {
  return (
    <ScrollView className="flex-1 bg-[#12171b]">
      <View className="pb-6">
        <MatchesCarousel />
      </View>
      <View className="pt-6">
        <View className="px-5 mb-4">
          <Text className="text-2xl font-bold text-white">
            Groupes de Running
          </Text>
          <Text className="text-white text-sm mt-1">
            Trouvez votre communauté de coureurs
          </Text>
        </View>
        <RunningGroup />
      </View>
      <View className="h-6" />
    </ScrollView>
  );
};

export default HomepageScreen;
