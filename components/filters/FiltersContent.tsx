import React, { useState } from "react";
import { View, Text, Pressable, Modal, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { Switch } from "react-native";
import { useRouter } from "expo-router";
import { useMatches } from "@/context/MatchesContext";

export function FiltersContent() {
  const router = useRouter();
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const { applyFilters } = useMatches();

  const [filters, setFilters] = useState({
    age_min: 18,
    age_max: 70,
    gender: "",
    location: "",
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

  const locationOptions = [
    { label: "Toutes les villes", value: "" },
    { label: "Paris", value: "Paris" },
    { label: "Lyon", value: "Lyon" },
    { label: "Marseille", value: "Marseille" },
  ];

  const handleApplyFilters = async () => {
    // console.log("Filters:", filters);
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
        <View className="space-y-6">
          <View>
            <Text className="text-green mb-2">
              Minimum: {filters.age_min} ans
            </Text>
            <Slider
              value={filters.age_min}
              onValueChange={(value: number) =>
                setFilters((prev) => ({ ...prev, age_min: value }))
              }
              minimumValue={18}
              maximumValue={70}
              step={1}
              minimumTrackTintColor="#b9f144"
              maximumTrackTintColor="#767577"
              thumbTintColor="#b9f144"
            />
          </View>
          <View>
            <Text className="text-green mb-2">
              Maximum: {filters.age_max} ans
            </Text>
            <Slider
              value={filters.age_max}
              onValueChange={(value: number) =>
                setFilters((prev) => ({ ...prev, age_max: value }))
              }
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

      {/* Filtre de localisation */}
      <View className="mb-8">
        <Text className="text-white text-lg mb-4">Ville</Text>
        <Pressable
          onPress={() => setShowLocationModal(true)}
          className="bg-[#1e2429] p-4 rounded-xl border border-[#394047]"
        >
          <Text className="text-white">
            {locationOptions.find((opt) => opt.value === filters.location)
              ?.label || "Sélectionner"}
          </Text>
        </Pressable>
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

      <Modal
        visible={showLocationModal}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-[#12171b] rounded-t-3xl p-6">
            <Text className="text-white text-xl mb-4">
              Sélectionner la ville
            </Text>
            {locationOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setFilters((prev) => ({ ...prev, location: option.value }));
                  setShowLocationModal(false);
                }}
                className={`p-4 border-b border-[#394047] ${
                  filters.location === option.value ? "bg-[#1e2429]" : ""
                }`}
              >
                <Text
                  className={`${
                    filters.location === option.value
                      ? "text-green"
                      : "text-white"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setShowLocationModal(false)}
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
