import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MatchUser } from "@/interface/Matches";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useThemeColors, radii, typography, isAndroid } from "@/constants/theme";

type MatchCardCompactProps = {
  match: MatchUser;
};

// Fonction utilitaire pour traiter en toute securite les tableaux et les chaines JSON
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
  const { colors, shadows, isDark } = useThemeColors();

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
      style={{
        height: 280,
        borderRadius: radii.xl,
        overflow: "hidden",
        ...shadows.lg,
      }}
    >
      {/* Image de fond */}
      <Image
        source={
          match.user.profile_image
            ? { uri: match.user.profile_image }
            : require("@/assets/images/react-logo.png")
        }
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          resizeMode: "cover",
        }}
      />

      {/* Gradient pour le texte en bas */}
      <LinearGradient
        colors={["transparent", "transparent", "rgba(0,0,0,0.3)"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "25%",
        }}
      />

      {/* Contenu de la carte */}
      <View style={{ flex: 1, justifyContent: "space-between", padding: 16 }}>
        {/* Header - en haut */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* Nom et age - en haut a gauche */}
          <View>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 24,
                fontFamily: "Nunito-ExtraBold",
                marginBottom: 4,
                textShadowColor: "rgba(0,0,0,0.3)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 4,
              }}
            >
              {match.user.first_name}
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 18,
                fontFamily: "Nunito-Regular",
                textShadowColor: "rgba(0,0,0,0.3)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 4,
              }}
            >
              {match.user.age} ans
            </Text>
          </View>

          {/* Distance - en haut a droite */}
          {distanceKm && (
            isAndroid ? (
              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: radii.md,
                  backgroundColor: colors.primary.muted,
                  overflow: "hidden",
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontFamily: "Nunito-SemiBold",
                  }}
                >
                  {distanceKm} km
                </Text>
              </View>
            ) : (
              <BlurView
                intensity={30}
                tint={isDark ? "dark" : "light"}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  overflow: "hidden",
                  borderRadius: radii.md,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontFamily: "Nunito-SemiBold",
                  }}
                >
                  {distanceKm} km
                </Text>
              </BlurView>
            )
          )}
        </View>
      </View>
    </Pressable>
  );
}
