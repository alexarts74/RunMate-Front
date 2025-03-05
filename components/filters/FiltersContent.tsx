import React, { useState } from "react";
import { View, Text, Pressable, Modal, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { Switch } from "react-native";
import { useRouter } from "expo-router";
import { useMatches } from "@/context/MatchesContext";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Ionicons } from "@expo/vector-icons";

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
    <View className="flex-1 bg-background p-4">
      {/* Filtres d'âge */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Ionicons name="person-outline" size={24} color="#8101f7" />
          <Text className="text-white text-lg ml-2">Âge</Text>
        </View>
        <View className="bg-[#1e2429] p-4 rounded-xl border border-gray-700">
          <Text className="text-white mb-2">
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
            sliderLength={280}
            selectedStyle={{
              backgroundColor: "#8101f7",
            }}
            unselectedStyle={{
              backgroundColor: "#394047",
            }}
            containerStyle={{
              height: 40,
              alignItems: "center",
            }}
            markerStyle={{
              backgroundColor: "#8101f7",
              height: 20,
              width: 20,
            }}
            trackStyle={{
              height: 4,
            }}
          />
          <View className="flex-row justify-between mt-2">
            <Text className="text-white">18 ans</Text>
            <Text className="text-white">70 ans</Text>
          </View>
        </View>
      </View>

      {/* Filtre de genre */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Ionicons name="male-female-outline" size={24} color="#8101f7" />
          <Text className="text-white text-lg ml-2">Genre</Text>
        </View>
        <Pressable
          onPress={() => setShowGenderModal(true)}
          className="bg-[#1e2429] p-4 rounded-xl border border-gray-700 flex-row justify-between items-center"
        >
          <Text className="text-white">
            {genderOptions.find((opt) => opt.value === filters.gender)?.label ||
              "Sélectionner"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#8101f7" />
        </Pressable>
      </View>

      {/* Filtre de distance */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Ionicons name="location-outline" size={24} color="#8101f7" />
          <Text className="text-white text-lg ml-2">Distance maximale</Text>
        </View>
        <View className="bg-[#1e2429] p-4 rounded-xl border border-gray-700">
          <Text className="text-white mb-2">{filters.distance} km</Text>
          <Slider
            value={filters.distance}
            onValueChange={(value: number) =>
              setFilters((prev) => ({ ...prev, distance: Math.round(value) }))
            }
            minimumValue={1}
            maximumValue={100}
            step={1}
            minimumTrackTintColor="#8101f7"
            maximumTrackTintColor="#394047"
            thumbTintColor="#8101f7"
          />
          <View className="flex-row justify-between mt-2">
            <Text className="text-white">1 km</Text>
            <Text className="text-white">100 km</Text>
          </View>
        </View>
      </View>

      {/* Filtres de compatibilité */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Ionicons name="fitness-outline" size={24} color="#8101f7" />
          <Text className="text-white text-lg ml-2">
            Critères de compatibilité
          </Text>
        </View>
        <View className="bg-[#1e2429] p-4 rounded-xl border border-gray-700 space-y-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-white">Rythme similaire</Text>
            <Switch
              value={filters.filter_pace}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, filter_pace: value }))
              }
              trackColor={{ false: "#394047", true: "#8101f7" }}
            />
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-white">Distance similaire</Text>
            <Switch
              value={filters.filter_distance}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, filter_distance: value }))
              }
              trackColor={{ false: "#394047", true: "#8101f7" }}
            />
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-white">Disponibilités similaires</Text>
            <Switch
              value={filters.filter_availability}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, filter_availability: value }))
              }
              trackColor={{ false: "#394047", true: "#8101f7" }}
            />
          </View>
        </View>
      </View>

      {/* Modals */}
      <Modal visible={showGenderModal} transparent={true} animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-[#1e2429] rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-xl">Sélectionner le genre</Text>
              <Pressable onPress={() => setShowGenderModal(false)}>
                <Ionicons name="close" size={24} color="#8101f7" />
              </Pressable>
            </View>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setFilters((prev) => ({ ...prev, gender: option.value }));
                  setShowGenderModal(false);
                }}
                className={`p-4 border-b border-gray-700 ${
                  filters.gender === option.value ? "bg-[#2a3238]" : ""
                }`}
              >
                <Text
                  className={`${
                    filters.gender === option.value
                      ? "text-purple"
                      : "text-white"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <Pressable
        onPress={handleApplyFilters}
        className="bg-purple py-4 rounded-full items-center mt-4 active:opacity-90"
      >
        <Text className="text-white font-semibold text-lg">
          Appliquer les filtres
        </Text>
      </Pressable>
    </View>
  );
}
