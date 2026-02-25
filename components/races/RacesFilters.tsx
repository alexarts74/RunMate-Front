import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Race } from "@/interface/Race";
import { useThemeColors, palette } from "@/constants/theme";

const availableDistances = [
  { label: "Toutes", value: null, icon: "🏃" },
  { label: "5 km", value: 5, icon: "🚶" },
  { label: "10 km", value: 10, icon: "🏃" },
  { label: "Semi-marathon", value: 21.0975, icon: "🏅" },
  { label: "Marathon", value: 42.195, icon: "🏆" },
];

interface RacesFiltersProps {
  visible: boolean;
  onClose: () => void;
  allRaces: Race[];
  // Filtres
  searchLocation: string;
  setSearchLocation: (value: string) => void;
  showFutureOnly: boolean;
  setShowFutureOnly: (value: boolean) => void;
  selectedDistance: number | null;
  setSelectedDistance: (value: number | null) => void;
  selectedCountry: string | null;
  setSelectedCountry: (value: string | null) => void;
  // Actions
  onApplyFilters: () => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
}

export const RacesFilters = ({
  visible,
  onClose,
  allRaces,
  searchLocation,
  setSearchLocation,
  showFutureOnly,
  setShowFutureOnly,
  selectedDistance,
  setSelectedDistance,
  selectedCountry,
  setSelectedCountry,
  onApplyFilters,
  onClearFilters,
  activeFiltersCount,
}: RacesFiltersProps) => {
  const { colors, shadows } = useThemeColors();

  // Extraire les pays uniques des courses
  const availableCountries = useMemo(() => {
    const countries = new Set<string>();
    allRaces.forEach((race) => {
      const match = race.location.match(/\((\d+)\)/);
      if (match) {
        const parts = race.location.split("(");
        if (parts.length > 0) {
          countries.add(parts[0].trim());
        }
      } else {
        const parts = race.location.split(",");
        if (parts.length > 1) {
          countries.add(parts[parts.length - 1].trim());
        } else {
          countries.add(race.location);
        }
      }
    });
    return Array.from(countries).sort();
  }, [allRaces]);

  const handleApply = () => {
    onApplyFilters();
    onClose();
  };

  const handleClear = () => {
    onClearFilters();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <Pressable
          className="flex-1"
          onPress={onClose}
        />
        <View
          className="rounded-t-3xl"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            maxHeight: Dimensions.get("window").height * 0.85,
            backgroundColor: colors.elevated,
            ...shadows.lg,
          }}
        >
          <SafeAreaView edges={["bottom"]} className="flex-1">
            {/* Header */}
            <View className="px-6 py-4" style={{ borderBottomWidth: 1, borderBottomColor: colors.glass.border }}>
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: palette.primary.subtle }}
                  >
                    <Ionicons name="filter" size={20} color={colors.primary.DEFAULT} />
                  </View>
                  <View>
                    <Text style={{ color: colors.text.primary }} className="text-2xl font-nunito-extrabold">
                      Filtres
                    </Text>
                    {activeFiltersCount > 0 && (
                      <Text style={{ color: colors.primary.DEFAULT }} className="text-sm font-nunito-medium">
                        {activeFiltersCount} filtre{activeFiltersCount > 1 ? "s" : ""} actif{activeFiltersCount > 1 ? "s" : ""}
                      </Text>
                    )}
                  </View>
                </View>
                <Pressable
                  onPress={onClose}
                  className="w-10 h-10 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Ionicons name="close" size={22} color={colors.primary.DEFAULT} />
                </Pressable>
              </View>
            </View>

            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View className="px-6 py-4">
                {/* Recherche par localisation */}
                <View className="mb-6">
                  <Text style={{ color: colors.text.primary }} className="font-nunito-extrabold text-base mb-3">
                    Rechercher par localisation
                  </Text>
                  <View
                    className="flex-row items-center rounded-xl px-4 py-3"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <Ionicons name="search" size={20} color={colors.primary.DEFAULT} />
                    <TextInput
                      placeholder="Ex: Paris, Lyon..."
                      value={searchLocation}
                      onChangeText={setSearchLocation}
                      className="flex-1 ml-3 font-nunito-medium"
                      style={{ color: colors.text.primary }}
                      placeholderTextColor={colors.text.tertiary}
                    />
                    {searchLocation.length > 0 && (
                      <Pressable onPress={() => setSearchLocation("")}>
                        <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
                      </Pressable>
                    )}
                  </View>
                </View>

                {/* Filtre par date */}
                <View className="mb-6">
                  <Text style={{ color: colors.text.primary }} className="font-nunito-extrabold text-base mb-3">
                    Date
                  </Text>
                  <View className="flex-row gap-3">
                    <Pressable
                      onPress={() => setShowFutureOnly(true)}
                      className="flex-1 px-4 py-3.5 rounded-xl flex-row items-center justify-center"
                      style={{
                        backgroundColor: showFutureOnly ? colors.primary.DEFAULT : colors.surface,
                        ...shadows.sm,
                      }}
                    >
                      <Ionicons
                        name="calendar"
                        size={18}
                        color={showFutureOnly ? "white" : colors.text.primary}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        className="font-nunito-bold text-sm"
                        style={{
                          color: showFutureOnly ? "white" : colors.text.secondary,
                        }}
                      >
                        À venir
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setShowFutureOnly(false)}
                      className="flex-1 px-4 py-3.5 rounded-xl flex-row items-center justify-center"
                      style={{
                        backgroundColor: !showFutureOnly ? colors.primary.DEFAULT : colors.surface,
                        ...shadows.sm,
                      }}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color={!showFutureOnly ? "white" : colors.text.primary}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        className="font-nunito-bold text-sm"
                        style={{
                          color: !showFutureOnly ? "white" : colors.text.secondary,
                        }}
                      >
                        Toutes
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* Filtre par distance */}
                <View className="mb-6">
                  <Text style={{ color: colors.text.primary }} className="font-nunito-extrabold text-base mb-3">
                    Distance
                  </Text>
                  <View className="flex-row flex-wrap" style={{ gap: 10 }}>
                    {availableDistances.map((distance) => (
                      <Pressable
                        key={distance.value || "all"}
                        onPress={() => setSelectedDistance(distance.value)}
                        className="px-4 py-3 rounded-xl flex-row items-center"
                        style={{
                          backgroundColor: selectedDistance === distance.value
                            ? colors.primary.DEFAULT
                            : colors.surface,
                          ...shadows.sm,
                        }}
                      >
                        <Text className="text-base mr-2">{distance.icon}</Text>
                        <Text
                          className="font-nunito-bold text-sm"
                          style={{
                            color: selectedDistance === distance.value
                              ? "white"
                              : colors.text.secondary,
                          }}
                        >
                          {distance.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Filtre par localisation/pays */}
                {availableCountries.length > 0 && (
                  <View className="mb-6">
                    <Text style={{ color: colors.text.primary }} className="font-nunito-extrabold text-base mb-3">
                      Localisation
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 10 }}
                    >
                      <Pressable
                        onPress={() => setSelectedCountry(null)}
                        className="px-4 py-3 rounded-xl"
                        style={{
                          backgroundColor: selectedCountry === null
                            ? colors.primary.DEFAULT
                            : colors.surface,
                          ...shadows.sm,
                        }}
                      >
                        <Text
                          className="font-nunito-bold text-sm"
                          style={{
                            color: selectedCountry === null
                              ? "white"
                              : colors.text.secondary,
                          }}
                        >
                          Toutes
                        </Text>
                      </Pressable>
                      {availableCountries.slice(0, 15).map((country) => (
                        <Pressable
                          key={country}
                          onPress={() => setSelectedCountry(country)}
                          className="px-4 py-3 rounded-xl"
                          style={{
                            backgroundColor: selectedCountry === country
                              ? colors.primary.DEFAULT
                              : colors.surface,
                            ...shadows.sm,
                          }}
                        >
                          <Text
                            className="font-nunito-bold text-sm"
                            style={{
                              color: selectedCountry === country
                                ? "white"
                                : colors.text.secondary,
                            }}
                          >
                            {country}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Footer avec boutons d'action */}
            <View
              className="px-6 py-4"
              style={{
                borderTopWidth: 1,
                borderTopColor: colors.glass.border,
                backgroundColor: colors.elevated,
              }}
            >
              <View className="flex-row gap-3">
                {activeFiltersCount > 0 && (
                  <Pressable
                    onPress={handleClear}
                    className="flex-1 py-4 rounded-xl"
                    style={{
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.primary.DEFAULT,
                      ...shadows.sm,
                    }}
                  >
                    <Text style={{ color: colors.primary.DEFAULT }} className="text-center font-nunito-bold">
                      Effacer
                    </Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={handleApply}
                  className="flex-1 py-4 rounded-xl"
                  style={{
                    backgroundColor: colors.primary.DEFAULT,
                    ...shadows.md,
                  }}
                >
                  <Text className="text-center text-white font-nunito-bold">
                    Appliquer ({activeFiltersCount})
                  </Text>
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};
