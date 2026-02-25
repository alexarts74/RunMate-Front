import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MatchUser } from "@/interface/Matches";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useThemeColors, radii, typography } from "@/constants/theme";
import GlassCard from "@/components/ui/GlassCard";

type MatchCardProps = {
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

export function MatchCard({ match }: MatchCardProps) {
  const { colors, shadows } = useThemeColors();

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
      style={{
        height: 460,
        borderRadius: radii["2xl"],
        overflow: "hidden",
      }}
    >
      <GlassCard
        variant="heavy"
        noPadding
        style={{
          flex: 1,
          borderRadius: radii["2xl"],
        }}
      >
        {/* Image principale */}
        <View style={{ height: "70%", position: "relative" }}>
          <Image
            source={
              match.user.profile_image
                ? { uri: match.user.profile_image }
                : require("@/assets/images/react-logo.png")
            }
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
            }}
          />

          {/* Gradient subtil en bas de l'image */}
          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.3)"]}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 100,
            }}
          />

          {/* Badge distance - en haut a droite */}
          {distanceKm !== null && distanceKm !== undefined && (
            <View
              style={{
                position: "absolute",
                top: 16,
                right: 16,
              }}
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: colors.success,
                  ...shadows.md,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontWeight: "700",
                    fontFamily: "Nunito-Bold",
                  }}
                >
                  {distanceKm} km
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Section infos en bas */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingTop: 14,
            paddingBottom: 10,
          }}
        >
          {/* Nom et ville */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 6,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  ...typography.h1,
                  color: colors.text.primary,
                  marginBottom: 1,
                }}
              >
                {match.user.first_name}
              </Text>
              <Text
                style={{
                  ...typography.label,
                  color: colors.text.secondary,
                }}
              >
                {match.user.age} ans
              </Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  ...typography.label,
                  color: colors.text.primary,
                  marginBottom: 3,
                }}
              >
                {match.user.city}
              </Text>
            </View>
          </View>

          {/* Tags et infos running */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: colors.primary.subtle,
              }}
            >
              <Text
                style={{
                  color: colors.primary.dark,
                  fontSize: 12,
                  fontWeight: "700",
                  fontFamily: "Nunito-Bold",
                }}
              >
                {isChillRunner ? "Runner du dimanche" : "Runner performance"}
              </Text>
            </View>

            {/* Infos selon le type de runner */}
            <View style={{ alignItems: "flex-end" }}>
              {isChillRunner ? (
                runningFrequency && (
                  <Text
                    style={{
                      ...typography.caption,
                      color: colors.text.secondary,
                    }}
                  >
                    {formatRunningFrequency()}
                  </Text>
                )
              ) : (
                <>
                  {actualPace && (
                    <Text
                      style={{
                        ...typography.label,
                        fontWeight: "700",
                        color: colors.text.primary,
                      }}
                    >
                      {actualPace} min/km
                    </Text>
                  )}
                  {weeklyDistance && (
                    <Text
                      style={{
                        ...typography.caption,
                        color: colors.text.secondary,
                        marginTop: 2,
                      }}
                    >
                      {weeklyDistance} km/semaine
                    </Text>
                  )}
                </>
              )}
            </View>
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}
