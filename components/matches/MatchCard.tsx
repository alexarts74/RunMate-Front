import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MatchUser } from "@/interface/Matches";
import { router } from "expo-router";

type MatchCardProps = {
  match: MatchUser;
};

export function MatchCard({ match }: MatchCardProps) {
  const isChillRunner = match.user.runner_profile.running_type === "chill";

  return (
    <View className="bg-[#1e2429] rounded-2xl overflow-hidden shadow-xl mb-4 border border-gray-700">
      {/* Image Section */}
      <View className="h-[200px] w-full">
        <Image
          source={
            match.user.profile_image
              ? { uri: match.user.profile_image }
              : require("@/assets/images/react-logo.png")
          }
          className="w-full h-full"
          style={{ resizeMode: "cover" }}
        />
      </View>

      {/* Info Section */}
      <View className="p-3">
        {/* Informations principales */}
        <View className="mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Text className="text-white text-xl font-bold mr-2">
                {match.user.first_name}
              </Text>
              <Text className="text-gray-400">{match.user.age} ans</Text>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="location" size={14} color="#8101f7" />
              <Text className="text-gray-400 ml-1 text-sm">
                {match.distance_km} km
              </Text>
            </View>
          </View>

          <Text className="text-gray-400 text-sm">{match.user.city}</Text>
        </View>

        {/* Infos spécifiques selon le type de runner */}
        <View className="bg-background p-2 rounded-xl mb-3">
          {isChillRunner ? (
            // Runner Chill
            <View className="flex-row justify-between">
              <View className="flex-1 mr-2">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="people-outline" size={14} color="#8101f7" />
                  <Text className="text-white text-sm ml-1">
                    {match.user.runner_profile.social_preferences?.[0]}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="flag-outline" size={14} color="#8101f7" />
                  <Text className="text-white text-sm ml-1">
                    {match.user.runner_profile.objective}
                  </Text>
                </View>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={14} color="#8101f7" />
                  <Text className="text-white text-sm ml-1">
                    {match.user.runner_profile.running_frequency}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            // Runner Perf
            <View className="flex-row justify-between">
              <View className="flex-1 mr-2">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="trophy-outline" size={14} color="#8101f7" />
                  <Text className="text-white text-sm ml-1">
                    {match.user.runner_profile.objective}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons
                    name="speedometer-outline"
                    size={14}
                    color="#8101f7"
                  />
                  <Text className="text-white text-sm ml-1">
                    {match.user.runner_profile.actual_pace} min/km
                  </Text>
                </View>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={14} color="#8101f7" />
                  <Text className="text-white text-sm ml-1">
                    {match.user.runner_profile.running_frequency}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Boutons d'action */}
        <View className="flex-row">
          <Pressable
            onPress={() => router.push(`/runner/${match.user.id}`)}
            className="flex-1 bg-[#14141b] py-2 rounded-xl mr-2 flex-row justify-center items-center"
          >
            <Ionicons name="person-outline" size={16} color="#8101f7" />
            <Text className="text-white ml-2 font-semibold text-sm">
              Profil
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push(`/chat/${match.user.id}`)}
            className="flex-1 bg-purple py-2 rounded-xl ml-2 flex-row justify-center items-center"
          >
            <Ionicons name="chatbubble-outline" size={16} color="white" />
            <Text className="text-white ml-2 font-semibold text-sm">
              Message
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
