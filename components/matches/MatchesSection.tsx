import React, { useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { useMatches } from "@/context/MatchesContext";
import { MatchCardCompact } from "@/components/matches/MatchCardCompact";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export function MatchesSection() {
  const { matches, isLoading } = useMatches();
  const { width: screenWidth } = Dimensions.get("window");
  const ITEM_WIDTH = screenWidth * 0.9;

  // Afficher les 2 premiers matches maximum
  const displayMatches =
    matches && matches.length > 0 ? matches.slice(0, 2) : [];

  return (
    <View className="px-5 pb-5 pt-4">
      {/* Header de la section */}
      <View className="flex-row justify-between items-center mb-5">
        <View className="flex-row items-center">
          <View className="w-1 h-6 bg-greenLight rounded-full mr-3" />
          <Text className="text-xl font-kanit-semibold text-white">
            🔥 Vos matches
          </Text>
        </View>

        {matches && matches.length > 2 && (
          <Pressable
            onPress={() => router.push("/(app)/matches/all")}
            className="flex-row items-center bg-purple/10 px-3 py-1 rounded-full"
          >
            <Text className="text-greenLight font-kanit text-sm mr-1">
              Voir tout ({matches.length})
            </Text>
            <Ionicons name="arrow-forward" size={14} color="#126C52" />
          </Pressable>
        )}
      </View>

      {/* Contenu */}
      {isLoading ? (
        <View className="h-64 bg-[#1e2429] rounded-2xl items-center justify-center">
          <Ionicons name="hourglass-outline" size={40} color="#126C52" />
          <Text className="text-gray-400 mt-2">Chargement...</Text>
        </View>
      ) : displayMatches.length === 0 ? (
        <View className="bg-[#1e2429] rounded-2xl p-6 items-center border border-gray-700">
          <Ionicons name="search" size={40} color="#126C52" className="mb-3" />
          <Text className="text-white text-center font-kanit mb-2">
            Aucun match disponible
          </Text>
          <Text className="text-gray-400 text-center text-sm mb-4">
            Élargissez vos critères de recherche
          </Text>
          <Pressable
            onPress={() => router.push("/runner/filters")}
            className="bg-purple rounded-full px-4 py-2 flex-row items-center"
          >
            <Ionicons
              name="filter"
              size={16}
              color="white"
              style={{ marginRight: 6 }}
            />
            <Text className="text-white font-kanit text-sm">Filtres</Text>
          </Pressable>
        </View>
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
