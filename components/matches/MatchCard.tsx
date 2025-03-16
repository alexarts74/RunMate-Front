import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MatchUser } from "@/interface/Matches";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

type MatchCardProps = {
  match: MatchUser;
};

export function MatchCard({ match }: MatchCardProps) {
  const isChillRunner = match.user.runner_profile.running_type === "chill";

  return (
    <Pressable onPress={() => router.push(`/runner/${match.user.id}`)}>
      <View className="h-[500px] bg-[#1e2429] rounded-2xl overflow-hidden shadow-xl border border-gray-700">
        {/* Image Section with Gradient Overlay */}
        <View className="h-[300px] w-full relative">
          <Image
            source={
              match.user.profile_image
                ? { uri: match.user.profile_image }
                : require("@/assets/images/react-logo.png")
            }
            className="w-full h-full"
            style={{ resizeMode: "cover" }}
          />
          <LinearGradient
            colors={["transparent", "rgba(30, 36, 41, 0.8)"]}
            className="absolute bottom-0 left-0 right-0 h-24"
          />
        </View>

        {/* Info Section */}
        <View className="p-4 flex-1">
          <View className="flex-row justify-between items-start mb-3">
            <View>
              <Text className="text-xl font-bold text-white mb-1">
                {match.user.first_name} {match.user.last_name}
              </Text>
              <View className="flex-row items-center space-x-2">
                <View
                  className={`px-2 py-1 rounded-full ${
                    isChillRunner ? "bg-blue-500/20" : "bg-red-500/20"
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      isChillRunner ? "text-blue-400" : "text-red-400"
                    }`}
                  >
                    {isChillRunner ? "Chill" : "Performer"}
                  </Text>
                </View>
                <Text className="text-gray-400">•</Text>
                <Text className="text-gray-400">{match.user.age} ans</Text>
              </View>
            </View>
            <View className="bg-purple/10 px-3 py-1 rounded-full">
              <Ionicons name="location-outline" size={16} color="#8101f7" />
              <Text className="text-gray-300">{match.user.city}</Text>
            </View>
          </View>

          <View className="bg-gray-800/50 rounded-xl p-3 mb-3">
            <Text className="text-gray-300 text-sm">
              {match.user.runner_profile.objective}
            </Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <Ionicons name="time-outline" size={14} color="#8101f7" />
            <Text className="text-purple font-medium">
              {match.user.runner_profile.running_frequency}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
