import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Slider from "@react-native-community/slider";
import { Switch } from "react-native";
import { useRouter } from "expo-router";
import { matchesService } from "@/service/api/matching";

export function FiltersContent() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    age_min: 18,
    age_max: 70,
    gender: "",
    location: "",
    filter_pace: false,
    filter_distance: false,
    filter_availability: false
  });

  const handleApplyFilters = async () => {
    try {
      console.log("Filters:", filters);
      await matchesService.applyFilters(filters);
      router.back();
    } catch (error) {
      console.error("Erreur lors de l'application des filtres:", error);
    }
  };

  return (
    <>
      <Text className="text-2xl font-bold text-white mb-8">Filtres</Text>

      {/* Filtres d'âge */}
      <View className="mb-8">
        <Text className="text-white text-lg mb-4">Âge</Text>
        <View className="space-y-6">
          <View>
            <Text className="text-green mb-2">Minimum: {filters.age_min} ans</Text>
            <Slider
              value={filters.age_min}
              onValueChange={(value: number ) => setFilters(prev => ({ ...prev, age_min: value }))}
              minimumValue={18}
              maximumValue={70}
              step={1}
              minimumTrackTintColor="#b9f144"
              maximumTrackTintColor="#767577"
              thumbTintColor="#b9f144"
            />
          </View>
          <View>
            <Text className="text-green mb-2">Maximum: {filters.age_max} ans</Text>
            <Slider
              value={filters.age_max}
              onValueChange={(value: number) => setFilters(prev => ({ ...prev, age_max: value }))}
              minimumValue={18}
              maximumValue={70}
              step={1}
              minimumTrackTintColor="#b9f144"
              maximumTrackTintColor="#767577"
              thumbTintColor="#b9f144"
            />
          </View>
        </View>
      </View>

      {/* Filtres de compatibilité */}
      <View className="space-y-4 mb-8">
        <Text className="text-white text-lg mb-2">Critères de compatibilité</Text>

        <View className="flex-row justify-between items-center">
          <Text className="text-green">Rythme similaire</Text>
          <Switch
            value={filters.filter_pace}
            onValueChange={(value) => setFilters(prev => ({ ...prev, filter_pace: value }))}
            trackColor={{ false: "#767577", true: "#b9f144" }}
          />
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-green">Distance similaire</Text>
          <Switch
            value={filters.filter_distance}
            onValueChange={(value) => setFilters(prev => ({ ...prev, filter_distance: value }))}
            trackColor={{ false: "#767577", true: "#b9f144" }}
          />
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-green">Disponibilités similaires</Text>
          <Switch
            value={filters.filter_availability}
            onValueChange={(value) => setFilters(prev => ({ ...prev, filter_availability: value }))}
            trackColor={{ false: "#767577", true: "#b9f144" }}
          />
        </View>
      </View>

      {/* Bouton d'application */}
      <Pressable
        onPress={handleApplyFilters}
        className="bg-green py-4 rounded-full items-center mt-4"
      >
        <Text className="text-dark font-semibold">Appliquer les filtres</Text>
      </Pressable>
    </>
  );
}
