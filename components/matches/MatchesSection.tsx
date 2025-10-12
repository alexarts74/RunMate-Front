import React, { useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { useMatches } from "@/context/MatchesContext";
import { MatchCard } from "@/components/matches/MatchCard";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export function MatchesSection() {
  const { matches, isLoading } = useMatches();
  const { width: screenWidth } = Dimensions.get("window");
  const ITEM_WIDTH = screenWidth * 0.9;

  // Afficher seulement le premier match
  const firstMatch = matches && matches.length > 0 ? matches[0] : null;

  return (
    <View className="px-5 py-5">
      {/* Header de la section */}
      <View className="flex-row justify-between items-center mb-5">
        <View className="flex-row items-center">
          <View className="w-1 h-6 bg-[#f0c2fe] rounded-full mr-3" />
          <Text className="text-xl font-kanit-semibold text-white">
            🔥 Match du jour
          </Text>
        </View>

        {matches && matches.length > 1 && (
          <Pressable
            onPress={() => router.push("/(app)/matches/all")}
            className="flex-row items-center bg-purple/10 px-3 py-1 rounded-full"
          >
            <Text className="text-[#f0c2fe] font-kanit text-sm mr-1">
              Voir tout ({matches.length})
            </Text>
            <Ionicons name="arrow-forward" size={14} color="#f0c2fe" />
          </Pressable>
        )}
      </View>

      {/* Contenu */}
      {isLoading ? (
        <View className="h-64 bg-[#1e2429] rounded-2xl items-center justify-center">
          <Ionicons name="hourglass-outline" size={40} color="#f0c2fe" />
          <Text className="text-gray-400 mt-2">Chargement...</Text>
        </View>
      ) : !firstMatch ? (
        <View className="bg-[#1e2429] rounded-2xl p-6 items-center border border-gray-700">
          <Ionicons name="search" size={40} color="#f0c2fe" className="mb-3" />
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
        <View style={{ width: ITEM_WIDTH, alignSelf: "center" }}>
          <MatchCard match={firstMatch} />
        </View>
      )}
    </View>
  );
}
