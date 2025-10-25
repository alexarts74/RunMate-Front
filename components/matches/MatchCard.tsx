import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MatchUser } from "@/interface/Matches";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

type MatchCardProps = {
  match: MatchUser;
};

// Fonction utilitaire pour traiter en toute sécurité les tableaux et les chaînes JSON
const safelyFormatArray = (value: any, separator: string = ", "): string => {
  try {
    if (Array.isArray(value)) {
      return value
        .filter((item) => item !== null && item !== undefined)
        .map((item) => String(item))
        .join(separator);
    } else if (typeof value === "string") {
      const valueStr = value as string;
      if (valueStr.startsWith("[") || valueStr.startsWith("{")) {
        try {
          const parsed = JSON.parse(valueStr);
          if (Array.isArray(parsed)) {
            return parsed.map((item) => String(item)).join(separator);
          }
          return String(parsed);
        } catch (e) {
          return valueStr;
        }
      }
      return valueStr;
    }
    return value !== null && value !== undefined ? String(value) : "";
  } catch (error) {
    console.error(`Erreur de formatage: ${error}`);
    return "";
  }
};

export function MatchCard({ match }: MatchCardProps) {
  const isChillRunner = match.user.runner_profile.running_type === "chill";
  const actualPace = match.user.runner_profile.actual_pace;
  const runningFrequency = match.user.runner_profile.running_frequency;
  const weeklyDistance = match.user.runner_profile.weekly_mileage;
  const distanceKm = match.distance_km;

  // Formater runningFrequency si c'est un tableau
  const formatRunningFrequency = () => {
    return safelyFormatArray(runningFrequency);
  };

  return (
    <Pressable
      onPress={() => router.push(`/runner/${match.user.id}`)}
      className="relative overflow-hidden"
      style={{
        height: 520,
        borderRadius: 32,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
        elevation: 12,
      }}
    >
      {/* Image de fond */}
      <Image
        source={
          match.user.profile_image
            ? { uri: match.user.profile_image }
            : require("@/assets/images/react-logo.png")
        }
        className="absolute w-full h-full"
        style={{ resizeMode: "cover" }}
      />

      {/* Gradient léger pour le texte en bas */}
      <LinearGradient
        colors={["transparent", "transparent", "rgba(0,0,0,0.3)"]}
        className="absolute bottom-0 left-0 right-0 h-1/4"
      />

      {/* Contenu de la carte */}
      <View className="flex-1 justify-between p-6">
        {/* Header - en haut */}
        <View className="flex-row justify-between items-start">
          {/* Nom et âge - en haut à gauche */}
          <View>
            <Text className="text-white text-3xl font-kanit-bold mb-1 drop-shadow-lg">
              {match.user.first_name}
            </Text>
            <Text className="text-white/90 text-xl font-kanit drop-shadow-lg">
              {match.user.age} ans
            </Text>
          </View>

          {/* Distance - en haut à droite */}
          {distanceKm && (
            <BlurView
              intensity={30}
              tint="dark"
              className="px-5 py-3 overflow-hidden"
              style={{ borderRadius: 20 }}
            >
              <Text className="text-white text-sm font-kanit-semibold">
                {distanceKm} km
              </Text>
            </BlurView>
          )}
        </View>

        {/* Infos en bas - toutes dans un seul conteneur avec flou */}
        <BlurView
          intensity={70}
          tint="dark"
          className="px-5 py-4 overflow-hidden"
          style={{ borderRadius: 24 }}
        >
          <View className="space-y-3">
            {/* Ville */}
            <View className="flex-row items-center">
              <Ionicons name="location" size={18} color="#126C52" />
              <Text className="text-white text-base font-kanit ml-3">
                {match.user.city}
              </Text>
            </View>

            {/* Type de runner avec emoji */}
            <View className="flex-row items-center">
              <Text className="text-base font-kanit-semibold text-white">
                {isChillRunner ? "🌿 Runner détente" : "⚡ Runner performance"}
              </Text>
            </View>

            {/* Infos clés - plus détaillées pour la version grande */}
            {isChillRunner ? (
              runningFrequency && (
                <View className="flex-row items-center">
                  <Ionicons name="time" size={18} color="#126C52" />
                  <Text className="text-white text-base font-kanit ml-3">
                    {formatRunningFrequency()}
                  </Text>
                </View>
              )
            ) : (
              <View className="space-y-2">
                {actualPace && (
                  <View className="flex-row items-center">
                    <Ionicons name="speedometer" size={18} color="#126C52" />
                    <Text className="text-white text-base font-kanit ml-3">
                      {actualPace} min/km
                    </Text>
                  </View>
                )}
                {weeklyDistance && (
                  <View className="flex-row items-center">
                    <Ionicons name="footsteps" size={18} color="#126C52" />
                    <Text className="text-white text-base font-kanit ml-3">
                      {weeklyDistance} km/semaine
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </BlurView>
      </View>
    </Pressable>
  );
}
