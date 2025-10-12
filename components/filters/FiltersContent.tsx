import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Switch } from "react-native";
import { useRouter } from "expo-router";
import { useMatches } from "@/context/MatchesContext";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Ionicons } from "@expo/vector-icons";
import { ActionButton } from "../ui/ActionButton";

export function FiltersContent() {
  const router = useRouter();
  const [showGenderModal, setShowGenderModal] = useState(false);
  const { applyFilters } = useMatches();
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState({
    age_min: 18,
    age_max: 70,
    gender: "",
    location: "",
    distance: 50,
    filter_pace: false,
    filter_distance: false,
    filter_availability: false,
    running_type: "chill",
    filter_competition_goals: false,
    filter_training_days: false,
    filter_social_preferences: false,
  });

  const genderOptions = [
    { label: "Tous", value: "" },
    { label: "Homme", value: "male" },
    { label: "Femme", value: "female" },
    { label: "Autre", value: "other" },
  ];

  const runningTypeOptions = [
    { label: "Chill", value: "chill" },
    { label: "Performance", value: "perf" },
  ];

  const handleApplyFilters = async () => {
    setIsLoading(true);
    try {
      await applyFilters(filters);
      router.back();
    } catch (error) {
      console.error("Erreur lors de l'application des filtres:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-4">
      {/* Filtres d'âge */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Ionicons name="person-outline" size={24} color="#f0c2fe" />
          <Text className="text-white text-lg ml-2">Âge</Text>
        </View>
        <View className="bg-background p-4 rounded-xl border border-gray-700">
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
              backgroundColor: "#f0c2fe",
            }}
            unselectedStyle={{
              backgroundColor: "#394047",
            }}
            containerStyle={{
              height: 40,
              alignItems: "center",
            }}
            markerStyle={{
              backgroundColor: "#f0c2fe",
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
      {/* Type de runner */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Ionicons name="fitness-outline" size={24} color="#f0c2fe" />
          <Text className="text-white text-lg ml-2">Type de runner</Text>
        </View>
        <View className="bg-background p-4 rounded-xl border border-gray-700">
          <View className="flex-row justify-between">
            {runningTypeOptions.map((option) => (
              <Pressable
                key={option.value}
                onPress={() =>
                  setFilters((prev) => ({
                    ...prev,
                    running_type: option.value,
                  }))
                }
                className={`flex-1 mx-1 py-2 rounded-lg ${
                  filters.running_type === option.value
                    ? "bg-purple"
                    : "bg-[#2a3238]"
                }`}
              >
                <Text
                  className={`text-center ${
                    filters.running_type === option.value
                      ? "text-white font-semibold"
                      : "text-gray-400"
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
      {/* Filtre de genre */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Ionicons name="male-female-outline" size={24} color="#f0c2fe" />
          <Text className="text-white text-lg ml-2">Genre</Text>
        </View>
        <Pressable
          onPress={() => setShowGenderModal(true)}
          className="bg-background p-4 rounded-xl border border-gray-700 flex-row justify-between items-center"
        >
          <Text className="text-white">
            {genderOptions.find((opt) => opt.value === filters.gender)?.label ||
              "Sélectionner"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#f0c2fe" />
        </Pressable>
      </View>
      {/* Filtre de distance */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Ionicons name="location-outline" size={24} color="#f0c2fe" />
          <Text className="text-white text-lg ml-2">Distance maximale</Text>
        </View>
        <View className="bg-background p-4 rounded-xl border border-gray-700">
          <Text className="text-white mb-2">{filters.distance} km</Text>
          <Slider
            value={filters.distance}
            onValueChange={(value: number) =>
              setFilters((prev) => ({ ...prev, distance: Math.round(value) }))
            }
            minimumValue={1}
            maximumValue={100}
            step={1}
            minimumTrackTintColor="#f0c2fe"
            maximumTrackTintColor="#394047"
            thumbTintColor="#f0c2fe"
          />
          <View className="flex-row justify-between mt-2">
            <Text className="text-white">1 km</Text>
            <Text className="text-white">100 km</Text>
          </View>
        </View>
      </View>
      {/* Filtres de compatibilité */}
      <View className="mb-12">
        <View className="flex-row items-center mb-4">
          <Ionicons name="fitness-outline" size={24} color="#f0c2fe" />
          <Text className="text-white text-lg ml-2">
            Critères de compatibilité
          </Text>
        </View>
        <View className="bg-background p-4 rounded-xl border border-gray-700 space-y-6">
          {/* Critères communs */}
          <View className="flex-row justify-between mb-2 items-center">
            <Text className="text-white">Rythme similaire</Text>
            <Switch
              value={filters.filter_pace}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, filter_pace: value }))
              }
              trackColor={{ false: "#394047", true: "#f0c2fe" }}
            />
          </View>

          {/* Critères spécifiques selon le type */}
          {filters.running_type === "perf" ? (
            <>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white">
                  Objectifs de compétition similaires
                </Text>
                <Switch
                  value={filters.filter_competition_goals}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      filter_competition_goals: value,
                    }))
                  }
                  trackColor={{ false: "#394047", true: "#f0c2fe" }}
                />
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white">
                  Jours d'entraînement similaires
                </Text>
                <Switch
                  value={filters.filter_training_days}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      filter_training_days: value,
                    }))
                  }
                  trackColor={{ false: "#394047", true: "#f0c2fe" }}
                />
              </View>
            </>
          ) : (
            <>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white">Disponibilités similaires</Text>
                <Switch
                  value={filters.filter_availability}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      filter_availability: value,
                    }))
                  }
                  trackColor={{ false: "#394047", true: "#f0c2fe" }}
                />
              </View>
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white font-kanit-light">
                  Préférences sociales similaires
                </Text>
                <Switch
                  value={filters.filter_social_preferences}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      filter_social_preferences: value,
                    }))
                  }
                  trackColor={{ false: "#394047", true: "#f0c2fe" }}
                />
              </View>
            </>
          )}
        </View>
      </View>
      {/* Modals */}
      <Modal visible={showGenderModal} transparent={true} animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-background rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-xl">Sélectionner le genre</Text>
              <Pressable onPress={() => setShowGenderModal(false)}>
                <Ionicons name="close" size={24} color="#f0c2fe" />
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
                  filters.gender === option.value ? "bg-background" : ""
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
      <ActionButton
        onPress={handleApplyFilters}
        text="Appliquer les filtres"
        loading={isLoading}
      />
    </View>
  );
}
