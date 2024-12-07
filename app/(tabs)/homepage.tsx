import { View, Text, ScrollView, TouchableOpacity, Pressable } from "react-native";
import React from "react";
import { useMatches } from "@/context/MatchesContext";
import { MatchCard } from "@/components/matches/MatchCard";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";


const HomepageScreen = () => {
  const { matches } = useMatches();

  return (
    <ScrollView className="flex-1 bg-[#12171b] pt-12">
      <View className="flex-row justify-between items-center px-5 my-6">
        <Text className="text-2xl font-bold text-white">Vos matches</Text>
        <Pressable onPress={() => router.push("/runner/filters")}>
          <Ionicons name="filter" size={24} color="white" />
        </Pressable>
      </View>

      {matches?.length === 0 ? (
        <View className="px-5">
          <Text className="text-white text-center">
            Aucun match trouvé pour le moment
          </Text>
        </View>
      ) : (
        <View className="px-5 space-y-4 pb-36">
          {matches?.map((match) => (
            <View key={match.user.id} className="p-2">
              <MatchCard match={match} />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default HomepageScreen;
