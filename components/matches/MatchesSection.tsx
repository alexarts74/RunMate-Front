import React from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { useMatches } from "@/context/MatchesContext";
import { MatchCardCompact } from "@/components/matches/MatchCardCompact";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import GlassCard from "@/components/ui/GlassCard";
import PulseLoader from "@/components/ui/PulseLoader";
import { useThemeColors, palette } from "@/constants/theme";

export function MatchesSection() {
  const { matches, isLoading } = useMatches();
  const { width: screenWidth } = Dimensions.get("window");
  const ITEM_WIDTH = screenWidth * 0.9;
  const { colors, shadows } = useThemeColors();

  // Afficher les 2 premiers matches maximum
  const displayMatches =
    matches && matches.length > 0 ? matches.slice(0, 2) : [];

  return (
    <View className="px-5 pb-5 pt-4">
      {/* Header de la section */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Text style={{ color: colors.text.primary }} className="text-2xl font-nunito-extrabold mr-2">
            Vos matches
          </Text>
          {matches && matches.length > 0 && (
            <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: palette.primary.subtle }}>
              <Text style={{ color: colors.primary.DEFAULT }} className="font-nunito-semibold text-xs">
                {matches.length}
              </Text>
            </View>
          )}
        </View>

        {matches && matches.length > 2 && (
          <Pressable
            onPress={() => router.push("/(app)/matches/all")}
            className="flex-row items-center px-3 py-1.5 rounded-lg"
            style={{
              backgroundColor: palette.primary.subtle,
              borderWidth: 1,
              borderColor: palette.primary.muted,
            }}
          >
            <Text style={{ color: colors.primary.DEFAULT }} className="font-nunito-semibold text-sm mr-1">
              Voir tout
            </Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary.DEFAULT} />
          </Pressable>
        )}
      </View>

      {/* Contenu */}
      {isLoading ? (
        <GlassCard>
          <View className="h-64 items-center justify-center">
            <PulseLoader color={colors.primary.DEFAULT} size={10} />
            <Text style={{ color: colors.text.tertiary }} className="mt-3">Chargement...</Text>
          </View>
        </GlassCard>
      ) : displayMatches.length === 0 ? (
        <GlassCard>
          <View className="p-6 items-center">
            <Ionicons name="search" size={40} color={colors.primary.DEFAULT} style={{ marginBottom: 12 }} />
            <Text style={{ color: colors.text.primary }} className="text-center font-nunito mb-2">
              Aucun match disponible
            </Text>
            <Text style={{ color: colors.text.tertiary }} className="text-center text-sm mb-4">
              Élargissez vos critères de recherche
            </Text>
            <Pressable
              onPress={() => router.push("/runner/filters")}
              className="rounded-full px-4 py-2 flex-row items-center"
              style={{ backgroundColor: colors.primary.DEFAULT }}
            >
              <Ionicons
                name="filter"
                size={16}
                color="white"
                style={{ marginRight: 6 }}
              />
              <Text className="text-white font-nunito text-sm">Filtres</Text>
            </Pressable>
          </View>
        </GlassCard>
      ) : (
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <MatchCardCompact match={displayMatches[0]} />
          </View>
          {displayMatches[1] && (
            <View style={{ flex: 1 }}>
              <MatchCardCompact match={displayMatches[1]} />
            </View>
          )}
        </View>
      )}
    </View>
  );
}
