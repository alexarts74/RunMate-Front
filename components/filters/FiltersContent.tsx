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
    <View className="flex-1 bg-fond px-6 pt-6 pb-24">
      {/* Filtres d'âge */}
      <View className="mb-6">
        <View className="flex-row items-center mb-3">
          <View className="bg-primary/10 p-2 rounded-xl mr-3">
            <Ionicons name="person-outline" size={20} color="#FF6B4A" />
          </View>
          <Text className="text-gray-900 text-lg font-kanit-bold">Âge</Text>
        </View>
        <View className="bg-white p-5 rounded-2xl border border-gray-200"
          style={{
            shadowColor: "#FF6B4A",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text className="text-gray-900 mb-3 font-kanit-bold text-base">
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
              backgroundColor: "#FF6B4A",
            }}
            unselectedStyle={{
              backgroundColor: "#E5E7EB",
            }}
            containerStyle={{
              height: 40,
              alignItems: "center",
            }}
            markerStyle={{
              backgroundColor: "#FF6B4A",
              height: 24,
              width: 24,
              borderRadius: 12,
            }}
            trackStyle={{
              height: 4,
            }}
          />
          <View className="flex-row justify-between mt-3">
            <Text className="text-gray-500 text-sm font-kanit-medium">18 ans</Text>
            <Text className="text-gray-500 text-sm font-kanit-medium">80 ans</Text>
          </View>
        </View>
      </View>
      {/* Type de runner */}
      <View className="mb-6">
        <View className="flex-row items-center mb-3">
          <View className="bg-secondary/10 p-2 rounded-xl mr-3">
            <Ionicons name="fitness-outline" size={20} color="#A78BFA" />
          </View>
          <Text className="text-gray-900 text-lg font-kanit-bold">Type de runner</Text>
        </View>
        <View className="bg-white p-4 rounded-2xl border border-gray-200"
          style={{
            shadowColor: "#A78BFA",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View className="flex-row justify-between" style={{ gap: 12 }}>
            {runningTypeOptions.map((option) => (
              <Pressable
                key={option.value}
                onPress={() =>
                  setFilters((prev) => ({
                    ...prev,
                    running_type: option.value,
                  }))
                }
                className={`flex-1 py-3 rounded-xl ${
                  filters.running_type === option.value
                    ? "bg-secondary"
                    : "bg-gray-100"
                }`}
                style={{
                  shadowColor: filters.running_type === option.value ? "#A78BFA" : "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: filters.running_type === option.value ? 0.2 : 0.05,
                  shadowRadius: 4,
                  elevation: filters.running_type === option.value ? 3 : 1,
                }}
              >
                <Text
                  className={`text-center font-kanit-bold text-base ${
                    filters.running_type === option.value
                      ? "text-white"
                      : "text-gray-600"
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
      <View className="mb-6">
        <View className="flex-row items-center mb-3">
          <View className="bg-primary/10 p-2 rounded-xl mr-3">
            <Ionicons name="male-female-outline" size={20} color="#FF6B4A" />
          </View>
          <Text className="text-gray-900 text-lg font-kanit-bold">Genre</Text>
        </View>
        <Pressable
          onPress={() => setShowGenderModal(true)}
          className="bg-white p-4 rounded-2xl border border-gray-200 flex-row justify-between items-center"
          style={{
            shadowColor: "#FF6B4A",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text className="text-gray-900 font-kanit-medium">
            {genderOptions.find((opt) => opt.value === filters.gender)?.label ||
              "Sélectionner"}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#FF6B4A" />
        </Pressable>
      </View>
      {/* Filtre de distance */}
      <View className="mb-6">
        <View className="flex-row items-center mb-3">
          <View className="bg-primary/10 p-2 rounded-xl mr-3">
            <Ionicons name="location-outline" size={20} color="#FF6B4A" />
          </View>
          <Text className="text-gray-900 text-lg font-kanit-bold">Distance maximale</Text>
        </View>
        <View className="bg-white p-5 rounded-2xl border border-gray-200"
          style={{
            shadowColor: "#FF6B4A",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text className="text-gray-900 mb-3 font-kanit-bold text-base">{filters.distance} km</Text>
          <Slider
            value={filters.distance}
            onValueChange={(value: number) =>
              setFilters((prev) => ({ ...prev, distance: Math.round(value) }))
            }
            minimumValue={1}
            maximumValue={100}
            step={1}
            minimumTrackTintColor="#FF6B4A"
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor="#FF6B4A"
          />
          <View className="flex-row justify-between mt-3">
            <Text className="text-gray-500 text-sm font-kanit-medium">1 km</Text>
            <Text className="text-gray-500 text-sm font-kanit-medium">100 km</Text>
          </View>
        </View>
      </View>
      {/* Filtres de compatibilité */}
      <View className="mb-8">
        <View className="flex-row items-center mb-3">
          <View className="bg-secondary/10 p-2 rounded-xl mr-3">
            <Ionicons name="star-outline" size={20} color="#A78BFA" />
          </View>
          <Text className="text-gray-900 text-lg font-kanit-bold">
            Critères de compatibilité
          </Text>
        </View>
        <View className="bg-white p-5 rounded-2xl border border-gray-200"
          style={{
            shadowColor: "#A78BFA",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          {/* Critères communs */}
          <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-100">
            <Text className="text-gray-900 font-kanit-medium flex-1">Rythme similaire</Text>
            <Switch
              value={filters.filter_pace}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, filter_pace: value }))
              }
              trackColor={{ false: "#E5E7EB", true: "#FF6B4A" }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Critères spécifiques selon le type */}
          {filters.running_type === "perf" ? (
            <>
              <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <Text className="text-gray-900 font-kanit-medium flex-1">
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
                  trackColor={{ false: "#E5E7EB", true: "#FF6B4A" }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-900 font-kanit-medium flex-1">
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
                  trackColor={{ false: "#E5E7EB", true: "#FF6B4A" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </>
          ) : (
            <>
              <View className="flex-row justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <Text className="text-gray-900 font-kanit-medium flex-1">Disponibilités similaires</Text>
                <Switch
                  value={filters.filter_availability}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      filter_availability: value,
                    }))
                  }
                  trackColor={{ false: "#E5E7EB", true: "#FF6B4A" }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-900 font-kanit-medium flex-1">
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
                  trackColor={{ false: "#E5E7EB", true: "#FF6B4A" }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </>
          )}
        </View>
      </View>
      {/* Modals */}
      <Modal visible={showGenderModal} transparent={true} animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 16,
              elevation: 16,
            }}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-gray-900 text-xl font-kanit-bold">Sélectionner le genre</Text>
              <Pressable 
                onPress={() => setShowGenderModal(false)}
                className="bg-gray-100 p-2 rounded-full"
              >
                <Ionicons name="close" size={20} color="#FF6B4A" />
              </Pressable>
            </View>
            {genderOptions.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setFilters((prev) => ({ ...prev, gender: option.value }));
                  setShowGenderModal(false);
                }}
                className={`p-4 ${index !== genderOptions.length - 1 ? 'border-b border-gray-100' : ''}`}
                style={{
                  backgroundColor: filters.gender === option.value ? 'rgba(255, 107, 74, 0.1)' : 'transparent',
                }}
              >
                <Text
                  className={`font-kanit-medium text-base ${
                    filters.gender === option.value
                      ? "text-primary font-kanit-bold"
                      : "text-gray-900"
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
