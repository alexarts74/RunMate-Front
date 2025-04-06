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
  let availability: string[] = [];
  try {
    // Si c'est déjà un tableau, on l'utilise directement
    if (Array.isArray(match.user.runner_profile.availability)) {
      availability = match.user.runner_profile.availability;
    }
    // Si c'est une chaîne JSON valide, on la parse
    else if (typeof match.user.runner_profile.availability === "string") {
      const availabilityStr = match.user.runner_profile.availability as string;
      if (availabilityStr.startsWith("[") || availabilityStr.startsWith("{")) {
        availability = JSON.parse(availabilityStr);
      } else {
        // Si c'est une chaîne simple, on la met dans un tableau
        availability = [availabilityStr];
      }
    }
  } catch (error) {
    return null;
  }

  // Données spécifiques au type de runner
  const socialPreferences = match.user.runner_profile.social_preferences;
  const postRunActivities = match.user.runner_profile.post_run_activities;
  const targetPace = match.user.runner_profile.target_pace;
  const actualPace = match.user.runner_profile.actual_pace;
  const runningFrequency = match.user.runner_profile.running_frequency;
  const weeklyDistance = match.user.runner_profile.weekly_mileage;
  const distanceKm = match.distance_km;

  let competitionGoals: string[] = [];
  try {
    // Si c'est déjà un tableau, on l'utilise directement
    if (Array.isArray(match.user.runner_profile.competition_goals)) {
      competitionGoals = match.user.runner_profile.competition_goals;
    }
    // Si c'est une chaîne JSON valide, on la parse
    else if (typeof match.user.runner_profile.competition_goals === "string") {
      const goalsStr = match.user.runner_profile.competition_goals as string;
      if (goalsStr.startsWith("[") || goalsStr.startsWith("{")) {
        competitionGoals = JSON.parse(goalsStr);
      } else {
        // Si c'est une chaîne simple, on la met dans un tableau
        competitionGoals = [goalsStr];
      }
    }
  } catch (error) {
    return null;
  }

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

  // Formatage des objectifs de compétition
  const formatCompetitionGoal = (goal: string) => {
    // Remplacer les underscores par des espaces
    let formattedGoal = goal.replace(/_/g, " ");

    // Traduire et formater certains objectifs communs
    switch (goal) {
      case "semi_marathon":
        return "Semi-marathon";
      case "marathon":
        return "Marathon";
      case "10km_sous_50min":
        return "10km sous 50min";
      case "5km_sous_25min":
        return "5km sous 25min";
      default:
        // Mettre une majuscule à la première lettre
        return formattedGoal.charAt(0).toUpperCase() + formattedGoal.slice(1);
    }
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

        {/* Distance mise en valeur - en haut à droite */}
        {distanceKm && (
          <View className="absolute top-4 right-4 bg-purple px-4 py-2 rounded-full flex-row items-center z-10">
            <Ionicons name="location-outline" size={16} color="#fff" />
            <Text className="text-white ml-1.5 text-base font-kanit font-bold">
              {distanceKm} km
            </Text>
          </View>
        )}

        {/* Gradient overlay - plus court pour laisser plus d'espace à l'image */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.95)"]}
          className="absolute bottom-0 left-0 right-0 h-1/4"
        />

        {/* Info Section at bottom */}
        <View className="absolute bottom-0 left-0 right-0">
          {/* Profile Info avec minimum de padding */}
          <View className="px-5 pt-2 pb-4">
            {/* Name, age en ligne */}
            <View className="flex-row items-center mb-5">
              <Text className="text-2xl font-bold font-kanit text-white mr-2 drop-shadow-md">
                {match.user.first_name} {match.user.last_name}
              </Text>
              <Text className="text-xl text-white font-kanit drop-shadow-md">
                {match.user.age} ans
              </Text>
            </View>

            {/* Les 3 infos clés selon le type de runner en bulles */}
            <View className="flex-row flex-wrap justify-left gap-x-2 items-center mb-1 px-1">
              {isChillRunner ? (
                // Bulles pour runner CHILL
                <>
                  {/* 1. Préférences sociales */}
                  {socialPreferences && socialPreferences.length > 0 && (
                    <View className="bg-background border border-purple px-4 py-2 rounded-full flex-row items-center mb-3 w-[47%]">
                      <Ionicons name="people-outline" size={14} color="#fff" />
                      <Text
                        className="text-white ml-1.5 text-xs font-kanit font-medium"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {Array.isArray(socialPreferences)
                          ? socialPreferences.join(", ")
                          : socialPreferences}
                      </Text>
                    </View>
                  )}

                  {/* 2. Disponibilités */}
                  {availability && availability.length > 0 && (
                    <View className="bg-background border border-purple  px-4 py-2 rounded-full flex-row items-center mb-3 w-[47%]">
                      <Ionicons
                        name="calendar-outline"
                        size={14}
                        color="#fff"
                      />
                      <Text
                        className="text-white ml-1.5 text-xs font-kanit font-medium"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {availability.map(formatDay).join(", ")}
                      </Text>
                    </View>
                  )}

                  {/* 3. Fréquence */}
                  {runningFrequency && (
                    <View className="bg-background border border-purple px-4 py-2 rounded-full flex-row items-center mb-3 w-[47%]">
                      <Ionicons name="time-outline" size={14} color="#fff" />
                      <Text
                        className="text-white ml-1.5 text-xs font-kanit font-medium"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {runningFrequency}
                      </Text>
                    </View>
                  )}

                  {/* 4. Activités après course */}
                  {postRunActivities && postRunActivities.length > 0 && (
                    <View className="bg-background border border-purple px-4 py-2 rounded-full flex-row items-center mb-3 w-[47%]">
                      <Ionicons name="cafe-outline" size={14} color="#fff" />
                      <Text
                        className="text-white ml-1.5 text-xs font-kanit font-medium"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {Array.isArray(postRunActivities)
                          ? postRunActivities.join(", ")
                          : postRunActivities}
                      </Text>
                    </View>
                  )}

                  {/* Flexible badge pour les chill runners */}
                  {isFlexible && (
                    <View className="bg-background border border-purple px-4 py-2 rounded-full flex-row items-center mb-3 w-fit">
                      <Ionicons name="leaf-outline" size={14} color="#fff" />
                      <Text
                        className="text-white ml-1.5 text-xs font-kanit font-medium"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        Flexible
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                // Bulles pour runner PERF
                <>
                  {/* 1. Allure actuelle */}
                  {actualPace && (
                    <View className="bg-background border border-purple px-4 py-2 rounded-full flex-row items-center mb-3 w-fit">
                      <Ionicons
                        name="speedometer-outline"
                        size={14}
                        color="#fff"
                      />
                      <Text
                        className="text-white ml-1.5 text-xs font-kanit font-medium"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {actualPace} min/km
                      </Text>
                    </View>
                  )}

                  {/* 2. Allure cible si différente */}
                  {targetPace && targetPace !== actualPace && (
                    <View className="bg-background border border-purple px-4 py-2 rounded-full flex-row items-center mb-3 w-fit">
                      <Ionicons
                        name="trending-down-outline"
                        size={14}
                        color="#fff"
                      />
                      <Text
                        className="text-white ml-1.5 text-xs font-kanit font-medium"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {targetPace} min/km
                      </Text>
                    </View>
                  )}

                  {/* 3. Distance habituelle */}
                  {weeklyDistance && (
                    <View className="bg-background border border-purple px-4 py-2 rounded-full flex-row items-center mb-3 w-fit">
                      <Ionicons
                        name="footsteps-outline"
                        size={14}
                        color="#fff"
                      />
                      <Text
                        className="text-white ml-1.5 text-xs font-kanit font-medium"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {weeklyDistance} km
                      </Text>
                    </View>
                  )}

                  {/* 4. Objectifs de compétition */}
                  {competitionGoals && competitionGoals.length > 0 && (
                    <View className="bg-background border border-purple px-4 py-2 rounded-full flex-row items-center mb-3 w-[47%]">
                      <Ionicons name="trophy-outline" size={14} color="#fff" />
                      <Text
                        className="text-white ml-1.5 text-xs font-kanit font-medium"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {Array.isArray(competitionGoals)
                          ? competitionGoals
                              .map(formatCompetitionGoal)
                              .join(", ")
                          : formatCompetitionGoal(competitionGoals)}
                      </Text>
                    </View>
                  )}

                  {/* Flexible badge pour les perf runners */}
                  {isFlexible && (
                    <View className="bg-background border border-purple px-4 py-2 rounded-full flex-row items-center mb-3 w-fit">
                      <Ionicons name="leaf-outline" size={14} color="#fff" />
                      <Text
                        className="text-white ml-1.5 text-xs font-kanit font-medium"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        Flexible
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
