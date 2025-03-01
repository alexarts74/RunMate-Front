import React from "react";
import { View, Text, Image, Pressable, ImageBackground } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MatchUser } from "@/interface/Matches";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

type MatchCardProps = {
  match: MatchUser;
};

export function MatchCard({ match }: MatchCardProps) {
  return (
    <Pressable
      onPress={() => router.push(`/runner/${match.user.id}`)}
      className="h-[500px] rounded-3xl overflow-hidden shadow-xl mb-4"
    >
      <ImageBackground
        source={
          match.user.profile_image
            ? { uri: match.user.profile_image }
            : require("@/assets/images/react-logo.png")
        }
        className="w-full h-full"
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          className="flex-1 justify-end p-6"
        >
          {/* Informations principales */}
          <View className="mb-4">
            <View className="flex-row items-center">
              <Text className="text-white text-3xl font-bold mr-2">
                {match.user.first_name}
              </Text>
              <Text className="text-white text-2xl">{match.user.age} ans</Text>
            </View>

            <View className="flex-row items-center mt-1">
              <Ionicons name="location" size={16} color="#b9f144" />
              <Text className="text-white ml-1">
                {match.user.city} • {match.distance_km} km
              </Text>
            </View>
          </View>

          {/* Stats de running */}
          <View className="flex-row justify-between bg-black/30 p-4 rounded-xl">
            <View className="items-center flex-1 border-r border-white/20">
              <Text className="text-green text-lg font-bold">
                {match.user.runner_profile.actual_pace}
              </Text>
              <Text className="text-white text-sm">min/km</Text>
            </View>

            <View className="items-center flex-1 border-r border-white/20">
              <Text className="text-green text-lg font-bold">
                {match.user.runner_profile.usual_distance}
              </Text>
              <Text className="text-white text-sm">km</Text>
            </View>

            <View className="items-center flex-1">
              <Text className="text-green text-lg font-bold">
                {match.user.runner_profile.running_type === "chill"
                  ? "Chill"
                  : "Perf"}
              </Text>
              <Text className="text-white text-sm">Style</Text>
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row justify-center mt-4">
            <Pressable
              onPress={() => router.push(`/chat/${match.user.id}`)}
              className="bg-green w-14 h-14 rounded-full items-center justify-center mx-2"
            >
              <Ionicons name="chatbubble-outline" size={24} color="#12171b" />
            </Pressable>

            <Pressable
              onPress={() => router.push(`/runner/${match.user.id}`)}
              className="bg-white w-14 h-14 rounded-full items-center justify-center mx-2"
            >
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#12171b"
              />
            </Pressable>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  );
}
