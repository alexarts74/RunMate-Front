import { View, Text, ScrollView, Image, Pressable } from "react-native";
import React from "react";
import { useMatches } from "@/context/MatchesContext";
import Ionicons from "@expo/vector-icons/Ionicons";

const HomepageScreen = () => {
  const { matches } = useMatches();

  return (
    <ScrollView className="flex-1 bg-[#12171b] pt-12">
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
              <View
                key={match.user.id}
                className="bg-gray rounded-2xl p-6 shadow-lg"
              >
                {/* En-tête avec photo et infos principales */}
                <View className="flex-row justify-between items-start">
                  <View className="flex-row items-center flex-1">
                    <Image
                      source={
                        match.user.profile_image
                          ? { uri: match.user.profile_image }
                          : require("@/assets/images/react-logo.png")
                      }
                      className="w-20 h-20 rounded-full border-2 border-green"
                    />

                    <View className="ml-4 flex-1">
                      <Text className="text-white text-xl font-bold mb-1">
                        {match.user.name}
                      </Text>

                      <View className="flex-row items-center mb-2">
                        <Ionicons name="location" size={16} color="#9CA3AF" />
                        <Text className="text-gray-400 ml-1">
                          {match.user.location}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Bouton Message avec nouvelle icône */}
                  <Pressable
                    onPress={() => {
                      /* Gérer l'envoi de message */
                    }}
                    className="bg-green p-3 rounded-full"
                  >
                    <Ionicons name="mail-outline" size={24} color="white" />
                  </Pressable>
                </View>

                {/* Section Profil Runner */}
                <View className="mt-4 bg-[#12171b] p-4 rounded-xl">
                  <Text className="text-white font-medium mb-3">
                    Profil Runner
                  </Text>

                  <View className="flex-row justify-between">
                    <View className="items-center bg-[#12171b] p-3 rounded-xl flex-1 mx-1">
                      <Ionicons name="walk-outline" size={24} color="#b9f144" />
                      <Text className="text-white text-center mt-2">
                        {match.user.runner_profile.actual_pace} min/km
                      </Text>
                    </View>

                    <View className="items-center bg-[#12171b] p-3 rounded-xl flex-1 mx-1">
                      <Ionicons
                        name="resize-outline"
                        size={24}
                        color="#b9f144"
                      />
                      <Text className="text-white text-center mt-2">
                        {match.user.runner_profile.usual_distance} km
                      </Text>
                    </View>

                    <View className="items-center bg-[#12171b] p-3 rounded-xl flex-1 mx-1">
                      <Ionicons
                        name="trophy-outline"
                        size={24}
                        color="#b9f144"
                      />
                      <Text className="text-white text-center mt-2">
                        {match.user.runner_profile.objective}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
        </View>
      )}
    </ScrollView>
  );
};

export default HomepageScreen;
