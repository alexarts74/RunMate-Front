import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Race } from "@/interface/Race";
import { useThemeColors, radii, typography } from "@/constants/theme";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";

export const RaceCard = ({ race }: { race: Race }) => {
  const { colors, shadows } = useThemeColors();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDistance = (distance: number) => {
    if (distance === 42.195) return "Marathon";
    if (distance === 21.0975) return "Semi-marathon";
    if (distance === 10) return "10 km";
    if (distance === 5) return "5 km";
    return `${distance} km`;
  };

  const getTimeUntilRace = (raceDate: string) => {
    if (!raceDate) return null;
    const now = new Date();
    const raceD = new Date(raceDate);
    now.setHours(0, 0, 0, 0);
    raceD.setHours(0, 0, 0, 0);
    const differenceInTime = raceD.getTime() - now.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    if (differenceInTime <= 0) return null;
    return differenceInDays;
  };

  const daysUntil = getTimeUntilRace(race.start_date);

  return (
    <Pressable
      onPress={() => router.push(`/(app)/races/${race.id}`)}
      style={{ marginBottom: 24 }}
      android_ripple={{ color: colors.primary.subtle }}
    >
      <GlassCard
        variant="medium"
        noPadding
        style={{
          borderRadius: radii.lg,
          ...shadows.md,
        }}
      >
        {/* Cover Image */}
        {race.cover_image && (
          <Image
            source={{
              uri: race.cover_image,
            }}
            style={{
              width: "100%",
              height: 192,
              resizeMode: "cover",
              borderTopLeftRadius: radii.lg,
              borderTopRightRadius: radii.lg,
            }}
          />
        )}

        {/* Content Container */}
        <View style={{ padding: 20 }}>
          {/* Badge de temps restant */}
          {daysUntil !== null && (
            <View style={{ marginBottom: 12 }}>
              <View
                style={{
                  backgroundColor: colors.primary.subtle,
                  borderWidth: 1,
                  borderColor: colors.primary.light,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: radii.full,
                  alignSelf: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="time-outline"
                  size={12}
                  color={colors.text.secondary}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={{
                    color: colors.primary.dark,
                    fontFamily: "Nunito-Bold",
                    fontSize: 12,
                  }}
                >
                  Dans {daysUntil} jour{daysUntil > 1 ? "s" : ""}
                </Text>
              </View>
            </View>
          )}

          <Text
            style={{
              ...typography.h2,
              color: colors.text.primary,
              marginBottom: 16,
            }}
          >
            {race.name}
          </Text>

          <View style={{ gap: 12, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: radii.sm,
                  backgroundColor: colors.primary.subtle,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons
                  name="calendar"
                  size={16}
                  color={colors.primary.DEFAULT}
                />
              </View>
              <Text
                style={{
                  ...typography.bodyMedium,
                  color: colors.text.secondary,
                }}
              >
                {formatDate(race.start_date)}
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: radii.sm,
                  backgroundColor: colors.primary.subtle,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons
                  name="location"
                  size={16}
                  color={colors.text.tertiary}
                />
              </View>
              <Text
                style={{
                  ...typography.bodyMedium,
                  color: colors.text.secondary,
                  flex: 1,
                }}
              >
                {race.location}
              </Text>
            </View>

            {/* Distances disponibles */}
            {race.distances && race.distances.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: radii.sm,
                    backgroundColor: colors.primary.subtle,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                    marginTop: 2,
                  }}
                >
                  <Ionicons
                    name="flag"
                    size={16}
                    color={colors.primary.DEFAULT}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  {race.distances.map((distance, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: colors.primary.subtle,
                        borderWidth: 1,
                        borderColor: colors.primary.muted,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: radii.sm,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.primary.dark,
                          fontFamily: "Nunito-Bold",
                          fontSize: 12,
                        }}
                      >
                        {formatDistance(distance)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {race.description && (
            <Text
              style={{
                ...typography.caption,
                color: colors.text.tertiary,
                marginBottom: 16,
                lineHeight: 20,
              }}
            >
              {race.description.slice(0, 120)}
              {race.description.length > 120 ? "..." : ""}
            </Text>
          )}

          <GlassButton
            title="Voir les details"
            onPress={() => router.push(`/(app)/races/${race.id}`)}
            variant="primary"
            size="md"
          />
        </View>
      </GlassCard>
    </Pressable>
  );
};
