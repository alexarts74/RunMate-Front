import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MatchUser } from "@/interface/Matches";
import { router } from "expo-router";

type MatchCardProps = {
  match: MatchUser;
};

export function MatchCard({ match }: MatchCardProps) {
  const handleSendMessage = () => {
    router.push(`/chat/${match.user.id}`);
  };

  return (
    <Pressable
      onPress={() => router.push(`/runner/${match.user.id}`)}
      className="bg-[#12171b] border border-green rounded-2xl px-6 py-3 shadow-lg"
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
            className="w-20 h-20 rounded-full"
          />

          <View className="ml-4 flex-1">
            <Text className="text-white text-xl font-bold mb-1">
              {match.user.first_name} {match.user.last_name}
            </Text>

            <View className="flex-row items-center mb-2">
              <Ionicons name="location" size={16} color="#9CA3AF" />
              <Text className="text-green ml-1">{match.user.location}</Text>
            </View>
          </View>
        </View>

        <Pressable
          onPress={handleSendMessage}
          className="p-3 mt-3 rounded-full"
        >
          <Ionicons name="mail-outline" size={24} color="white" />
        </Pressable>

        {/* TODO: Ajouter la note de compatibilité mais pas pour le moment revoir avec le filtrage des matchs dans le backend */}
        {/* <View className="items-center bg-[#12171b] p-3 rounded-xl mx-1">
          <Ionicons name="heart-outline" size={24} color="#b9f144" />
          <Text className="text-white text-center mt-2">{match.score} %</Text>
        </View> */}
      </View>

      {/* Section Profil Runner */}
      <View className="mt-4 p-4 rounded-xl">
        <Text className="text-white font-bold mb-1">Profil Runner</Text>

        <View className="flex-row justify-between">
          <View className="items-center bg-[#12171b] p-3 rounded-xl flex-1 mx-1">
            <Ionicons name="walk-outline" size={24} color="#b9f144" />
            <Text className="text-white text-center mt-2">
              {match.user.runner_profile.actual_pace} min/km
            </Text>
          </View>

          <View className="items-center bg-[#12171b] p-3 rounded-xl flex-1 mx-1">
            <Ionicons name="resize-outline" size={24} color="#b9f144" />
            <Text className="text-white text-center mt-2">
              {match.user.runner_profile.usual_distance} km
            </Text>
          </View>

          <View className="items-center bg-[#12171b] p-3 rounded-xl flex-1 mx-1">
            <Ionicons name="trophy-outline" size={24} color="#b9f144" />
            <Text className="text-white text-center mt-2">
              {/* Probleme affichage pour l'objectif */}
              {match.user.runner_profile.objective}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
