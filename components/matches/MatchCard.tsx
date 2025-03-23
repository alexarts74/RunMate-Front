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
  const isFlexible = match.user.runner_profile.flexible;

  // Convertir availability qui est une chaîne JSON en tableau si nécessaire
  const availability =
    typeof match.user.runner_profile.availability === "string"
      ? JSON.parse(match.user.runner_profile.availability)
      : match.user.runner_profile.availability;

  // Données spécifiques au type de runner
  const socialPreferences = match.user.runner_profile.social_preferences;
  const postRunActivities = match.user.runner_profile.post_run_activities;
  const targetPace = match.user.runner_profile.target_pace;
  const competitionGoals = match.user.runner_profile.competition_goals;

  // Formatage des jours de disponibilité
  const formatDay = (day: string) => {
    const days: { [key: string]: string } = {
      monday: "Lun",
      tuesday: "Mar",
      wednesday: "Mer",
      thursday: "Jeu",
      friday: "Ven",
      saturday: "Sam",
      sunday: "Dim",
    };
    return days[day.toLowerCase()] || day;
  };

  return (
    <View className="shadow-xl">
      <Pressable
        onPress={() => router.push(`/runner/${match.user.id}`)}
        className="relative overflow-hidden rounded-3xl"
        style={{ height: 500 }}
      >
        {/* Image fullscreen */}
        <Image
          source={
            match.user.profile_image
              ? { uri: match.user.profile_image }
              : require("@/assets/images/react-logo.png")
          }
          className="absolute w-full h-full"
          style={{ resizeMode: "cover" }}
        />

        {/* Gradient overlay - plus court pour laisser plus d'espace à l'image */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.95)"]}
          className="absolute bottom-0 left-0 right-0 h-2/5"
        />

        {/* Info Section at bottom */}
        <View className="absolute bottom-0 left-0 right-0">
          {/* Profile Info avec minimum de padding */}
          <View className="px-5 pt-0 pb-0">
            {/* Name, age, et badges en ligne avec espacements réduits */}
            <View className="flex-row items-center flex-wrap mb-1">
              <Text className="text-2xl font-bold text-white mr-2 drop-shadow-md">
                {match.user.first_name} {match.user.last_name}
              </Text>
              <Text className="text-xl text-white drop-shadow-md">
                {match.user.age} ans
              </Text>

              {/* Badge du type de coureur directement à côté de l'âge */}
              <View
                className={`ml-2 px-2 py-0.5 rounded-full ${
                  isChillRunner ? "bg-blue-500/40" : "bg-red-500/40"
                }`}
              >
                <Text
                  className={`font-medium text-white text-sm drop-shadow-md ${
                    isChillRunner ? "text-blue-200" : "text-red-200"
                  }`}
                >
                  {isChillRunner ? "Chill" : "Performer"}
                </Text>
              </View>

              {/* Badge flexible à côté du type si présent */}
              {isFlexible && (
                <View className="bg-green-500/40 ml-1 px-2 py-0.5 rounded-full flex-row items-center">
                  <Ionicons name="leaf-outline" size={12} color="#4ade80" />
                  <Text className="text-green-200 ml-1 text-xs font-medium drop-shadow-md">
                    Flexible
                  </Text>
                </View>
              )}
            </View>

            {/* Location et distance en une ligne compacte */}
            <View className="flex-row mb-1">
              <View className="bg-purple/30 px-2 py-0.5 rounded-full mr-2 flex-row items-center">
                <Ionicons name="location-outline" size={12} color="#fff" />
                <Text className="text-white ml-1 text-xs drop-shadow-md">
                  {match.user.city}
                </Text>
              </View>

              <View className="bg-indigo-500/30 px-2 py-0.5 rounded-full flex-row items-center">
                <Ionicons name="navigate-outline" size={12} color="#a5b4fc" />
                <Text className="text-indigo-200 ml-1 text-xs drop-shadow-md">
                  {match.distance_km?.toFixed(1) || "?"} km
                </Text>
              </View>

              {/* Distance habituelle sur la même ligne */}
              <View className="bg-purple/30 ml-2 px-2 py-0.5 rounded-full flex-row items-center">
                <Ionicons name="footsteps-outline" size={12} color="#8101f7" />
                <Text className="text-white ml-1 text-xs font-medium drop-shadow-md">
                  {match.user.runner_profile.usual_distance || "?"} km
                </Text>
              </View>
            </View>
          </View>

          {/* Fond semi-transparent pour les informations détaillées - réduit en hauteur */}
          <View className="bg-black/50 pt-2 pb-2 px-5">
            {/* Sections d'information en disposition plus compacte */}
            <View className="mb-0">
              {/* Availability - plus compact */}
              <View className="flex-row items-center mb-1">
                <Ionicons name="calendar-outline" size={16} color="#8101f7" />
                <Text className="text-white ml-2 text-xs font-medium drop-shadow-md">
                  Dispo :{" "}
                  {availability
                    ? availability.map(formatDay).join(", ")
                    : "Non précisé"}
                </Text>
              </View>

              {/* Runner-specific info - plus compact */}
              {isChillRunner ? (
                <>
                  {/* Social Preferences for Chill Runners */}
                  {socialPreferences && socialPreferences.length > 0 && (
                    <View className="flex-row items-start mb-1">
                      <Ionicons
                        name="people-outline"
                        size={16}
                        color="#8101f7"
                      />
                      <Text
                        className="text-white ml-2 text-xs font-medium drop-shadow-md flex-1"
                        numberOfLines={1}
                      >
                        Social :{" "}
                        {Array.isArray(socialPreferences)
                          ? socialPreferences.join(", ")
                          : socialPreferences}
                      </Text>
                    </View>
                  )}

                  {/* Post-Run Activities for Chill Runners */}
                  {postRunActivities && postRunActivities.length > 0 && (
                    <View className="flex-row items-start">
                      <Ionicons name="cafe-outline" size={16} color="#8101f7" />
                      <Text
                        className="text-white ml-2 text-xs font-medium drop-shadow-md flex-1"
                        numberOfLines={1}
                      >
                        Après course :{" "}
                        {Array.isArray(postRunActivities)
                          ? postRunActivities.join(", ")
                          : postRunActivities}
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <>
                  {/* Target Pace for Perf Runners */}
                  {targetPace && (
                    <View className="flex-row items-center mb-1">
                      <Ionicons
                        name="speedometer-outline"
                        size={16}
                        color="#8101f7"
                      />
                      <Text className="text-white ml-2 text-xs font-medium drop-shadow-md">
                        Allure cible : {targetPace} min/km
                      </Text>
                    </View>
                  )}

                  {/* Competition Goals for Perf Runners */}
                  {competitionGoals && (
                    <View className="flex-row items-start">
                      <Ionicons
                        name="trophy-outline"
                        size={16}
                        color="#8101f7"
                      />
                      <Text
                        className="text-white ml-2 text-xs font-medium drop-shadow-md flex-1"
                        numberOfLines={1}
                      >
                        Objectifs : {competitionGoals}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </View>

          {/* Action Buttons - avec padding réduit */}
          <View className="bg-[#12171b] border-t border-gray-800 px-5 py-2 rounded-b-3xl">
            <View className="flex-row justify-between">
              <Pressable
                className="bg-white/15 w-11 h-11 rounded-full items-center justify-center"
                onPress={() => router.push(`/runner/${match.user.id}`)}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color="#fff"
                />
              </Pressable>

              <Pressable
                className="bg-white/15 w-11 h-11 rounded-full items-center justify-center"
                onPress={() => router.push(`/chat/${match.user.id}`)}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color="#8101f7"
                />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}
