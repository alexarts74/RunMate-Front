import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useMatches } from "@/context/MatchesContext";
import { MatchCard } from "@/components/matches/MatchCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

const HomepageScreen = () => {
  const { matches } = useMatches();

  return (
    <ScrollView className="flex-1 bg-[#12171b] pt-12">
      <Text className="text-2xl font-bold text-white px-5 my-6">
        Vos matches
      </Text>

      {matches?.length === 0 ? (
        <View className="px-5">
          <Text className="text-white text-center">
            Aucun match trouvé pour le moment
          </Text>
        </View>
      ) : (
        <View className="px-5 space-y-4">
          {matches?.map((match) => (
            <MatchCard key={match.user.id} match={match} />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default HomepageScreen;
