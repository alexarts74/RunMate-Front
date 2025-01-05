import RunningGroup from "@/components/group/RunningGroup";
import { MatchesCarousel } from "@/components/matches/MatchesCarousel";
import React from "react";
import { View } from "react-native";

const HomepageScreen = () => {
  return (
    <View className="flex-1 bg-[#12171b]">
      <MatchesCarousel />
      <RunningGroup />
    </View>
  );
};

export default HomepageScreen;
