import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MatchUser } from "@/interface/Matches";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

type MatchCardCompactProps = {
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

export function MatchCardCompact({ match }: MatchCardCompactProps) {
  const isChillRunner = match.user.runner_profile.running_type === "chill";
  const actualPace = match.user.runner_profile.actual_pace;
  const runningFrequency = match.user.runner_profile.running_frequency;
  const weeklyDistance = match.user.runner_profile.weekly_mileage;
  const distanceKm = match.distance_km;

  // Formater runningFrequency si c'est un tableau
  const formatRunningFrequency = () => {
    const formatted = safelyFormatArray(runningFrequency, ", ");
    return formatted || "Flexible";
  };

  return (
    <Pressable
      onPress={() => router.push(`/runner/${match.user.id}`)}
      className="relative overflow-hidden"
      style={{
        height: 280,
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
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
      <View className="flex-1 justify-between p-4">
        {/* Header - en haut */}
        <View className="flex-row justify-between items-start">
          {/* Nom et âge - en haut à gauche */}
          <View>
            <Text className="text-white text-2xl font-kanit-bold mb-1 drop-shadow-lg">
              {match.user.first_name}
            </Text>
            <Text className="text-white/90 text-lg font-kanit drop-shadow-lg">
              {match.user.age} ans
            </Text>
          </View>

          {/* Distance - en haut à droite */}
          {distanceKm && (
            <BlurView
              intensity={30}
              tint="dark"
              className="px-3 py-2 overflow-hidden"
              style={{ borderRadius: 16 }}
            >
              <Text className="text-white text-xs font-kanit-semibold">
                {distanceKm} km
              </Text>
            </BlurView>
          )}
        </View>

        {/* Infos en bas - toutes dans un seul conteneur avec flou */}
        {/* <BlurView
          intensity={70}
          tint="dark"
          className="px-4 py-3 overflow-hidden"
          style={{ borderRadius: 20 }}
        >
          <View style={{ gap: 8 }}>
            {/* Ville */}
        {/* <View className="flex-row items-center">
              <Ionicons name="location" size={14} color="#f0c2fe" />
              <Text className="text-white text-sm font-kanit ml-2">
                {match.user.city}
              </Text>
            </View> */}

        {/* Type de runner avec emoji */}
        {/* <View className="flex-row items-center">
              <Text className="text-sm font-kanit-semibold text-white">
                {isChillRunner ? "🌿 Runner détente" : "⚡ Runner performance"}
              </Text>
            </View> */}

        {/* Infos clés - max 1 pour la compacité */}
        {/* {isChillRunner
              ? runningFrequency && (
                  <View className="flex-row items-center">
                    <Ionicons name="time" size={14} color="#f0c2fe" />
                    <Text className="text-white text-sm font-kanit ml-2">
                      {formatRunningFrequency()}
                    </Text>
                  </View>
                )
              : actualPace && (
                  <View className="flex-row items-center">
                    <Ionicons name="speedometer" size={14} color="#f0c2fe" />
                    <Text className="text-white text-sm font-kanit ml-2">
                      {actualPace} min/km
                    </Text>
                  </View>
                )} */}
        {/* </View>
        </BlurView> */}
      </View>
    </Pressable>
  );
}
