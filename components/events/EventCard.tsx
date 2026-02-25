import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Event } from "@/interface/Event";
import { useThemeColors, radii, typography } from "@/constants/theme";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";

export const EventCard = ({
  event,
  onEventUpdate,
}: {
  event: Event;
  onEventUpdate: () => void;
}) => {
  const { colors, shadows } = useThemeColors();

  return (
    <Pressable
      onPress={() => router.push(`/events/${event.id}`)}
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
        <Image
          source={{
            uri: event.cover_image || "https://via.placeholder.com/400x200",
          }}
          style={{
            width: "100%",
            height: 192,
            resizeMode: "cover",
            borderTopLeftRadius: radii.lg,
            borderTopRightRadius: radii.lg,
          }}
        />

        {/* Content Container */}
        <View style={{ padding: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            {event.is_creator ? (
              <View
                style={{
                  backgroundColor: colors.primary.subtle,
                  borderWidth: 1,
                  borderColor: colors.primary.DEFAULT,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: radii.full,
                }}
              >
                <Text
                  style={{
                    color: colors.primary.dark,
                    fontFamily: "Nunito-Bold",
                    fontSize: 14,
                  }}
                >
                  Createur
                </Text>
              </View>
            ) : event.is_participant ? (
              <View
                style={{
                  backgroundColor: colors.primary.subtle,
                  borderWidth: 1,
                  borderColor: colors.primary.light,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: radii.full,
                }}
              >
                <Text
                  style={{
                    color: colors.primary.DEFAULT,
                    fontFamily: "Nunito-Bold",
                    fontSize: 14,
                  }}
                >
                  Participant
                </Text>
              </View>
            ) : null}
          </View>

          <Text
            style={{
              ...typography.h2,
              color: colors.text.primary,
              marginBottom: 16,
            }}
          >
            {event.name}
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
                {new Date(event.start_date).toLocaleDateString()}
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
                }}
              >
                {event.location}
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
                  name="trending-up"
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
                {event.distance} km
              </Text>
            </View>
          </View>

          {event.description && (
            <Text
              style={{
                ...typography.caption,
                color: colors.text.tertiary,
                marginBottom: 16,
              }}
            >
              {event.description.slice(0, 100)}
              {event.description.length > 100 ? "..." : ""}
            </Text>
          )}

          <GlassButton
            title="Voir l'evenement"
            onPress={() => router.push(`/events/${event.id}`)}
            variant="primary"
            size="md"
          />
        </View>
      </GlassCard>
    </Pressable>
  );
};
