import { View, Text, ScrollView, Image, Pressable } from "react-native";
import React from "react";
import { useMatches } from "@/context/MatchesContext";

const HomepageScreen = () => {
  const { matches } = useMatches();
  console.log(matches, "matches");


  return (
    <ScrollView className="flex-1 bg-dark pt-12">
      <Text className="text-2xl font-bold text-white px-5 mb-6">
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
          {matches &&
            matches.map((match) => (
              <Pressable
                key={match.user.id}
                className="bg-gray-900 rounded-lg p-4 flex-row items-center"
              >
                <Image
                  source={
                    match.user.profile_image
                      ? { uri: match.user.profile_image }
                      : require("@/assets/images/react-logo.png")
                  }
                  className="w-16 h-16 rounded-full"
                />

                <View className="ml-4 flex-1">
                  <Text className="text-white text-lg font-semibold">
                    {match.user.name}
                  </Text>

                  <Text className="text-gray-400">{match.user.location}</Text>

                  <View className="flex-row mt-2">
                    <Text className="text-orange-500">
                      Compatibilité: {match.percentage}%
                    </Text>
                  </View>

                  <View className="mt-2">
                    <Text className="text-gray-400">
                      🏃 {match.user.runner_profile.actual_pace} min/km
                    </Text>
                    <Text className="text-gray-400">
                      📏 {match.user.runner_profile.usual_distance} km
                    </Text>
                    <Text className="text-gray-400">
                      🎯 {match.user.runner_profile.objective}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
        </View>
      )}
    </ScrollView>
  );
};

export default HomepageScreen;
