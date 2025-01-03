import { MatchesCarousel } from "@/components/matches/MatchesCarousel";
import React from "react";
import { View } from "react-native";

const HomepageScreen = () => {
  return (
    <View className="flex-1">
      <MatchesCarousel />
      {/* Ajoutez ici vos nouvelles fonctionnalités */}
    </View>
  );
};

export default HomepageScreen;
