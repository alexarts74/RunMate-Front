import React, { useState } from "react";
import { View, Text, Pressable, Modal, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { Switch } from "react-native";
import { useRouter } from "expo-router";
import { useMatches } from "@/context/MatchesContext";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

export function FiltersContent() {
  const router = useRouter();
  const [showGenderModal, setShowGenderModal] = useState(false);
  const { applyFilters } = useMatches();

  const [filters, setFilters] = useState({
    age_min: 18,
    age_max: 70,
    gender: "",
    location: "",
    distance: 50,
    filter_pace: false,
    filter_distance: false,
    filter_availability: false,
  });

  const genderOptions = [
    { label: "Tous", value: "" },
    { label: "Homme", value: "male" },
    { label: "Femme", value: "female" },
    { label: "Autre", value: "other" },
  ];

  const handleApplyFilters = async () => {
    try {
      await applyFilters(filters);
      router.back();
    } catch (error) {
      console.error("Erreur lors de l'application des filtres:", error);
    }
  };

  return (
    <>
      {/* Filtres d'âge */}
      <View className="mb-8">
        <Text className="text-white text-lg mb-4">Âge</Text>
        <View>
          <Text className="text-green mb-2">
            Entre {filters.age_min} et {filters.age_max} ans
          </Text>
          <MultiSlider
            values={[filters.age_min, filters.age_max]}
            onValuesChange={(values) =>
              setFilters((prev) => ({
                ...prev,
                age_min: values[0],
                age_max: values[1],
              }))
            }
            min={18}
            max={80}
            step={1}
            sliderLength={350}
            selectedStyle={{
              backgroundColor: "#b9f144",
            }}
            unselectedStyle={{
              backgroundColor: "#767577",
            }}
            containerStyle={{
              height: 40,
              alignItems: "center",
            }}
            markerStyle={{
              backgroundColor: "#b9f144",
              height: 20,
              width: 20,
            }}
            trackStyle={{
              height: 4,
            }}
          />
          <View className="flex-row justify-between">
            <Text className="text-white">18 ans</Text>
            <Text className="text-white">70 ans</Text>
          </View>
        </View>
      </View>

      {/* Filtre de genre */}
      <View className="mb-8">
        <Text className="text-white text-lg mb-4">Genre</Text>
        <Pressable
          onPress={() => setShowGenderModal(true)}
          className="bg-[#1e2429] p-4 rounded-xl border border-[#394047]"
        >
          <Text className="text-white">
            {genderOptions.find((opt) => opt.value === filters.gender)?.label ||
              "Sélectionner"}
          </Text>
        </Pressable>
      </View>

      {/* Filtre de distance */}
      <View className="mb-8">
        <Text className="text-white text-lg mb-4">Distance maximale</Text>
        <View>
          <Text className="text-green mb-2">{filters.distance} km</Text>
          <Slider
            value={filters.distance}
            onValueChange={(value: number) =>
              setFilters((prev) => ({ ...prev, distance: Math.round(value) }))
            }
            minimumValue={1}
            maximumValue={100}
            step={1}
            minimumTrackTintColor="#b9f144"
            maximumTrackTintColor="#767577"
            thumbTintColor="#b9f144"
          />
          <View className="flex-row justify-between">
            <Text className="text-white">1 km</Text>
            <Text className="text-white">100 km</Text>
          </View>
        </View>
      </View>

      {/* Filtres de compatibilité */}
      <View className="space-y-4 mb-8">
        <Text className="text-white text-lg mb-2">
          Critères de compatibilité
        </Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-green">Rythme similaire</Text>
          <Switch
            value={filters.filter_pace}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, filter_pace: value }))
            }
            trackColor={{ false: "#767577", true: "#b9f144" }}
          />
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-green">Distance similaire</Text>
          <Switch
            value={filters.filter_distance}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, filter_distance: value }))
            }
            trackColor={{ false: "#767577", true: "#b9f144" }}
          />
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-green">Disponibilités similaires</Text>
          <Switch
            value={filters.filter_availability}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, filter_availability: value }))
            }
            trackColor={{ false: "#767577", true: "#b9f144" }}
          />
        </View>
      </View>

      {/* Modals */}
      <Modal visible={showGenderModal} transparent={true} animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-[#12171b] rounded-t-3xl p-6">
            <Text className="text-white text-xl mb-4">
              Sélectionner le genre
            </Text>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setFilters((prev) => ({ ...prev, gender: option.value }));
                  setShowGenderModal(false);
                }}
                className={`p-4 border-b border-[#394047] ${
                  filters.gender === option.value ? "bg-[#1e2429]" : ""
                }`}
              >
                <Text
                  className={`${
                    filters.gender === option.value
                      ? "text-green"
                      : "text-white"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setShowGenderModal(false)}
              className="mt-4 p-4 bg-[#1e2429] rounded-xl"
            >
              <Text className="text-white text-center">Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Pressable
        onPress={handleApplyFilters}
        className="bg-green py-4 rounded-full items-center mt-4"
      >
        <Text className="text-dark font-semibold">Appliquer les filtres</Text>
      </Pressable>
    </>
  );
}
