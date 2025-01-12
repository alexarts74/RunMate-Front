import RunningGroup from "@/components/group/RunningGroup";
import { MatchesCarousel } from "@/components/matches/MatchesCarousel";
import React from "react";
import { View, ScrollView } from "react-native";

const HomepageScreen = () => {
  return (
    <ScrollView className="flex-1 bg-[#12171b]">
      <View>
        <MatchesCarousel />
      </View>
      <View>
        <RunningGroup />
      </View>
    </ScrollView>
  );
};

export default HomepageScreen;
