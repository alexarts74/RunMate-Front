import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, { SharedValue, useAnimatedStyle, interpolate } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { MatchUser } from "@/interface/Matches";
import { useThemeColors, radii, isAndroid } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Reused from MatchCard.tsx
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
    return "";
  }
};

type SwipeMatchCardProps = {
  match: MatchUser;
  translateX: SharedValue<number>;
  isTop: boolean;
};

function StatPill({ icon, text }: { icon: string; text: string }) {
  if (isAndroid) {
    return (
      <View style={[styles.statPill, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
        <Ionicons name={icon as any} size={13} color="rgba(255,255,255,0.9)" />
        <Text style={styles.statPillText}>{text}</Text>
      </View>
    );
  }

  return (
    <BlurView intensity={30} tint="dark" style={styles.statPill}>
      <Ionicons name={icon as any} size={13} color="rgba(255,255,255,0.9)" />
      <Text style={styles.statPillText}>{text}</Text>
    </BlurView>
  );
}

export default function SwipeMatchCard({ match, translateX, isTop }: SwipeMatchCardProps) {
  const { colors } = useThemeColors();

  const isChillRunner = match.user.runner_profile.running_type === "chill";
  const actualPace = match.user.runner_profile.actual_pace;
  const runningFrequency = match.user.runner_profile.running_frequency;
  const weeklyDistance = match.user.runner_profile.weekly_mileage;
  const distanceKm = match.distance_km;
  const score = match.score;

  // Swipe overlays — only on top card
  const leftOverlayStyle = useAnimatedStyle(() => {
    if (!isTop) return { opacity: 0 };
    return {
      opacity: interpolate(translateX.value, [-SCREEN_WIDTH * 0.3, 0], [1, 0], "clamp"),
    };
  });

  const rightOverlayStyle = useAnimatedStyle(() => {
    if (!isTop) return { opacity: 0 };
    return {
      opacity: interpolate(translateX.value, [0, SCREEN_WIDTH * 0.3], [0, 1], "clamp"),
    };
  });

  return (
    <View style={styles.container}>
      {/* Photo */}
      <Image
        source={
          match.user.profile_image
            ? { uri: match.user.profile_image }
            : require("@/assets/images/react-logo.png")
        }
        style={styles.image}
      />

      {/* Distance badge — top right */}
      {distanceKm != null && (
        <View style={styles.distanceBadge}>
          <Ionicons name="navigate-outline" size={12} color="white" style={{ marginRight: 4 }} />
          <Text style={styles.distanceText}>{distanceKm} km</Text>
        </View>
      )}

      {/* Gradient overlay bottom */}
      <LinearGradient
        colors={["transparent", "rgba(26,40,32,0.85)"]}
        locations={[0, 1]}
        style={styles.gradient}
      />

      {/* Content over gradient */}
      <View style={styles.content}>
        {/* Compatibility pill */}
        {score != null && (
          <View style={styles.compatPill}>
            <Ionicons name="fitness" size={14} color="white" style={{ marginRight: 5 }} />
            <Text style={styles.compatText}>{Math.round(score)}% compatible</Text>
          </View>
        )}

        {/* Name + age */}
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {match.user.first_name}{match.user.age ? `, ${match.user.age}` : ""}
        </Text>

        {/* City */}
        {match.user.city ? (
          <View style={styles.cityRow}>
            <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.cityText} numberOfLines={1} ellipsizeMode="tail">
              {match.user.city}
            </Text>
          </View>
        ) : null}

        {/* Stats pills */}
        <View style={styles.pillsRow}>
          <StatPill
            icon={isChillRunner ? "walk-outline" : "speedometer-outline"}
            text={
              isChillRunner
                ? "Runner chill"
                : actualPace
                ? `${actualPace} min/km`
                : "—"
            }
          />
          <StatPill
            icon={isChillRunner ? "calendar-outline" : "bar-chart-outline"}
            text={
              isChillRunner
                ? runningFrequency
                  ? safelyFormatArray(runningFrequency)
                  : "—"
                : weeklyDistance
                ? `${weeklyDistance} km/sem`
                : "—"
            }
          />
        </View>
      </View>

      {/* Swipe overlays */}
      {isTop && (
        <>
          {/* Skip overlay (swipe left) */}
          <Animated.View style={[styles.overlay, { backgroundColor: "rgba(212,115,110,0.35)" }, leftOverlayStyle]}>
            <View style={styles.overlayIconContainer}>
              <Ionicons name="close" size={64} color="white" />
            </View>
          </Animated.View>

          {/* Connect overlay (swipe right) */}
          <Animated.View style={[styles.overlay, { backgroundColor: "rgba(123,158,135,0.35)" }, rightOverlayStyle]}>
            <View style={styles.overlayIconContainer}>
              <Ionicons name="heart" size={56} color="white" />
            </View>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: radii["3xl"],
    overflow: "hidden",
    backgroundColor: "#1A2820",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  distanceBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  distanceText: {
    color: "white",
    fontFamily: "Nunito-Bold",
    fontSize: 13,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "55%",
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  compatPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginBottom: 8,
  },
  compatText: {
    color: "white",
    fontFamily: "Nunito-Bold",
    fontSize: 13,
  },
  name: {
    fontFamily: "Nunito-ExtraBold",
    fontSize: 26,
    color: "white",
    marginBottom: 2,
  },
  cityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 4,
  },
  cityText: {
    fontFamily: "Nunito-Medium",
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  pillsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 5,
    overflow: "hidden",
    ...(isAndroid ? {} : {}),
  },
  statPillText: {
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Nunito-SemiBold",
    fontSize: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radii["3xl"],
    justifyContent: "center",
    alignItems: "center",
  },
  overlayIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
});
