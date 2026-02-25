import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Switch } from "react-native";
import { useRouter } from "expo-router";
import { useMatches } from "@/context/MatchesContext";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Ionicons } from "@expo/vector-icons";
import { ActionButton } from "../ui/ActionButton";
import GlassCard from "@/components/ui/GlassCard";
import { useThemeColors, palette } from "@/constants/theme";

export function FiltersContent() {
  const router = useRouter();
  const [showGenderModal, setShowGenderModal] = useState(false);
  const { applyFilters } = useMatches();
  const [isLoading, setIsLoading] = useState(false);
  const { colors, shadows } = useThemeColors();

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
    <View className="flex-1 px-6 pt-6 pb-24" style={{ backgroundColor: colors.background }}>
      {/* Filtres d'âge */}
      <View className="mb-6">
        <View className="flex-row items-center mb-3">
          <View className="p-2 rounded-xl mr-3" style={{ backgroundColor: palette.primary.subtle }}>
            <Ionicons name="person-outline" size={20} color={colors.primary.DEFAULT} />
          </View>
          <Text style={{ color: colors.text.primary }} className="text-lg font-nunito-bold">Âge</Text>
        </View>
        <GlassCard>
          <Text style={{ color: colors.text.primary }} className="mb-3 font-nunito-bold text-base">
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
              backgroundColor: colors.primary.DEFAULT,
            }}
            unselectedStyle={{
              backgroundColor: colors.surface,
            }}
            containerStyle={{
              height: 40,
              alignItems: "center",
            }}
            markerStyle={{
              backgroundColor: colors.primary.DEFAULT,
              height: 24,
              width: 24,
              borderRadius: 12,
            }}
            trackStyle={{
              height: 4,
            }}
          />
          <View className="flex-row justify-between mt-3">
            <Text style={{ color: colors.text.tertiary }} className="text-sm font-nunito-medium">18 ans</Text>
            <Text style={{ color: colors.text.tertiary }} className="text-sm font-nunito-medium">80 ans</Text>
          </View>
        </GlassCard>
      </View>
      {/* Type de runner */}
      <View className="mb-6">
        <View className="flex-row items-center mb-3">
          <View className="p-2 rounded-xl mr-3" style={{ backgroundColor: colors.surface }}>
            <Ionicons name="fitness-outline" size={20} color={colors.text.secondary} />
          </View>
          <Text style={{ color: colors.text.primary }} className="text-lg font-nunito-bold">Type de runner</Text>
        </View>
        <GlassCard>
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
                className="flex-1 py-3 rounded-xl"
                style={{
                  backgroundColor: filters.running_type === option.value
                    ? colors.primary.DEFAULT
                    : colors.surface,
                  ...shadows.sm,
                }}
              >
                <Text
                  className="text-center font-nunito-bold text-base"
                  style={{
                    color: filters.running_type === option.value
                      ? "#FFFFFF"
                      : colors.text.secondary,
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </GlassCard>
      </View>
      {/* Filtre de genre */}
      <View className="mb-6">
        <View className="flex-row items-center mb-3">
          <View className="p-2 rounded-xl mr-3" style={{ backgroundColor: palette.primary.subtle }}>
            <Ionicons name="male-female-outline" size={20} color={colors.primary.DEFAULT} />
          </View>
          <Text style={{ color: colors.text.primary }} className="text-lg font-nunito-bold">Genre</Text>
        </View>
        <Pressable
          onPress={() => setShowGenderModal(true)}
        >
          <GlassCard>
            <View className="flex-row justify-between items-center">
              <Text style={{ color: colors.text.primary }} className="font-nunito-medium">
                {genderOptions.find((opt) => opt.value === filters.gender)?.label ||
                  "Sélectionner"}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.primary.DEFAULT} />
            </View>
          </GlassCard>
        </Pressable>
      </View>
      {/* Filtre de distance */}
      <View className="mb-6">
        <View className="flex-row items-center mb-3">
          <View className="p-2 rounded-xl mr-3" style={{ backgroundColor: palette.primary.subtle }}>
            <Ionicons name="location-outline" size={20} color={colors.primary.DEFAULT} />
          </View>
          <Text style={{ color: colors.text.primary }} className="text-lg font-nunito-bold">Distance maximale</Text>
        </View>
        <GlassCard>
          <Text style={{ color: colors.text.primary }} className="mb-3 font-nunito-bold text-base">{filters.distance} km</Text>
          <Slider
            value={filters.distance}
            onValueChange={(value: number) =>
              setFilters((prev) => ({ ...prev, distance: Math.round(value) }))
            }
            minimumValue={1}
            maximumValue={100}
            step={1}
            minimumTrackTintColor={colors.primary.DEFAULT}
            maximumTrackTintColor={colors.surface}
            thumbTintColor={colors.primary.DEFAULT}
          />
          <View className="flex-row justify-between mt-3">
            <Text style={{ color: colors.text.tertiary }} className="text-sm font-nunito-medium">1 km</Text>
            <Text style={{ color: colors.text.tertiary }} className="text-sm font-nunito-medium">100 km</Text>
          </View>
        </GlassCard>
      </View>
      {/* Filtres de compatibilité */}
      <View className="mb-8">
        <View className="flex-row items-center mb-3">
          <View className="p-2 rounded-xl mr-3" style={{ backgroundColor: colors.surface }}>
            <Ionicons name="star-outline" size={20} color={colors.text.secondary} />
          </View>
          <Text style={{ color: colors.text.primary }} className="text-lg font-nunito-bold">
            Critères de compatibilité
          </Text>
        </View>
        <GlassCard>
          {/* Critères communs */}
          <View className="flex-row justify-between items-center mb-4 pb-4" style={{ borderBottomWidth: 1, borderBottomColor: colors.glass.border }}>
            <Text style={{ color: colors.text.primary }} className="font-nunito-medium flex-1">Rythme similaire</Text>
            <Switch
              value={filters.filter_pace}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, filter_pace: value }))
              }
              trackColor={{ false: colors.surface, true: colors.primary.DEFAULT }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Critères spécifiques selon le type */}
          {filters.running_type === "perf" ? (
            <>
              <View className="flex-row justify-between items-center mb-4 pb-4" style={{ borderBottomWidth: 1, borderBottomColor: colors.glass.border }}>
                <Text style={{ color: colors.text.primary }} className="font-nunito-medium flex-1">
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
                  trackColor={{ false: colors.surface, true: colors.primary.DEFAULT }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View className="flex-row justify-between items-center">
                <Text style={{ color: colors.text.primary }} className="font-nunito-medium flex-1">
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
                  trackColor={{ false: colors.surface, true: colors.primary.DEFAULT }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </>
          ) : (
            <>
              <View className="flex-row justify-between items-center mb-4 pb-4" style={{ borderBottomWidth: 1, borderBottomColor: colors.glass.border }}>
                <Text style={{ color: colors.text.primary }} className="font-nunito-medium flex-1">Disponibilités similaires</Text>
                <Switch
                  value={filters.filter_availability}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      filter_availability: value,
                    }))
                  }
                  trackColor={{ false: colors.surface, true: colors.primary.DEFAULT }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <View className="flex-row justify-between items-center">
                <Text style={{ color: colors.text.primary }} className="font-nunito-medium flex-1">
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
                  trackColor={{ false: colors.surface, true: colors.primary.DEFAULT }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </>
          )}
        </GlassCard>
      </View>
      {/* Modals */}
      <Modal visible={showGenderModal} transparent={true} animationType="slide">
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View
            className="rounded-t-3xl p-6"
            style={{
              backgroundColor: colors.elevated,
              ...shadows.lg,
            }}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text style={{ color: colors.text.primary }} className="text-xl font-nunito-extrabold">Sélectionner le genre</Text>
              <Pressable
                onPress={() => setShowGenderModal(false)}
                className="p-2 rounded-full"
                style={{ backgroundColor: colors.surface }}
              >
                <Ionicons name="close" size={20} color={colors.primary.DEFAULT} />
              </Pressable>
            </View>
            {genderOptions.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => {
                  setFilters((prev) => ({ ...prev, gender: option.value }));
                  setShowGenderModal(false);
                }}
                className={`p-4`}
                style={{
                  backgroundColor: filters.gender === option.value ? palette.primary.subtle : 'transparent',
                  borderBottomWidth: index !== genderOptions.length - 1 ? 1 : 0,
                  borderBottomColor: colors.glass.border,
                }}
              >
                <Text
                  className={`font-nunito-medium text-base ${
                    filters.gender === option.value
                      ? "font-nunito-bold"
                      : ""
                  }`}
                  style={{
                    color: filters.gender === option.value
                      ? colors.primary.DEFAULT
                      : colors.text.primary,
                  }}
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
