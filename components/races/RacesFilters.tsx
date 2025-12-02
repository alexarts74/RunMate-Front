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
      <View className="flex-1 bg-black/50">
        <Pressable
          className="flex-1"
          onPress={onClose}
        />
        <View
          className="bg-white rounded-t-3xl"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            maxHeight: Dimensions.get("window").height * 0.85,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 16,
            elevation: 16,
          }}
        >
          <SafeAreaView edges={["bottom"]} className="flex-1">
            {/* Header */}
            <View className="px-6 py-4 border-b border-gray-200">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center mr-3">
                    <Ionicons name="filter" size={20} color="#FF6B4A" />
                  </View>
                  <View>
                    <Text className="text-gray-900 text-2xl font-kanit-bold">
                      Filtres
                    </Text>
                    {activeFiltersCount > 0 && (
                      <Text className="text-primary text-sm font-kanit-medium">
                        {activeFiltersCount} filtre{activeFiltersCount > 1 ? "s" : ""} actif{activeFiltersCount > 1 ? "s" : ""}
                      </Text>
                    )}
                  </View>
                </View>
                <Pressable
                  onPress={onClose}
                  className="w-10 h-10 rounded-full bg-tertiary items-center justify-center"
                >
                  <Ionicons name="close" size={22} color="#FF6B4A" />
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
                  <Text className="text-gray-900 font-kanit-bold text-base mb-3">
                    Rechercher par localisation
                  </Text>
                  <View className="flex-row items-center bg-tertiary rounded-xl px-4 py-3">
                    <Ionicons name="search" size={20} color="#FF6B4A" />
                    <TextInput
                      placeholder="Ex: Paris, Lyon..."
                      value={searchLocation}
                      onChangeText={setSearchLocation}
                      className="flex-1 ml-3 text-gray-900 font-kanit-medium"
                      placeholderTextColor="#9CA3AF"
                    />
                    {searchLocation.length > 0 && (
                      <Pressable onPress={() => setSearchLocation("")}>
                        <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                      </Pressable>
                    )}
                  </View>
                </View>

                {/* Filtre par date */}
                <View className="mb-6">
                  <Text className="text-gray-900 font-kanit-bold text-base mb-3">
                    Date
                  </Text>
                  <View className="flex-row gap-3">
                    <Pressable
                      onPress={() => setShowFutureOnly(true)}
                      className={`flex-1 px-4 py-3.5 rounded-xl flex-row items-center justify-center ${
                        showFutureOnly ? "bg-primary" : "bg-tertiary"
                      }`}
                      style={{
                        shadowColor: showFutureOnly ? "#FF6B4A" : "#A78BFA",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                    >
                      <Ionicons
                        name="calendar"
                        size={18}
                        color={showFutureOnly ? "white" : "#A78BFA"}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        className={`font-kanit-bold text-sm ${
                          showFutureOnly ? "text-white" : "text-gray-700"
                        }`}
                      >
                        À venir
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => setShowFutureOnly(false)}
                      className={`flex-1 px-4 py-3.5 rounded-xl flex-row items-center justify-center ${
                        !showFutureOnly ? "bg-primary" : "bg-tertiary"
                      }`}
                      style={{
                        shadowColor: !showFutureOnly ? "#FF6B4A" : "#A78BFA",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.15,
                        shadowRadius: 4,
                        elevation: 2,
                      }}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color={!showFutureOnly ? "white" : "#A78BFA"}
                        style={{ marginRight: 8 }}
                      />
                      <Text
                        className={`font-kanit-bold text-sm ${
                          !showFutureOnly ? "text-white" : "text-gray-700"
                        }`}
                      >
                        Toutes
                      </Text>
                    </Pressable>
                  </View>
                </View>

                {/* Filtre par distance */}
                <View className="mb-6">
                  <Text className="text-gray-900 font-kanit-bold text-base mb-3">
                    Distance
                  </Text>
                  <View className="flex-row flex-wrap" style={{ gap: 10 }}>
                    {availableDistances.map((distance) => (
                      <Pressable
                        key={distance.value || "all"}
                        onPress={() => setSelectedDistance(distance.value)}
                        className={`px-4 py-3 rounded-xl flex-row items-center ${
                          selectedDistance === distance.value
                            ? "bg-primary"
                            : "bg-tertiary"
                        }`}
                        style={{
                          shadowColor:
                            selectedDistance === distance.value
                              ? "#FF6B4A"
                              : "#A78BFA",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.15,
                          shadowRadius: 4,
                          elevation: 2,
                        }}
                      >
                        <Text className="text-base mr-2">{distance.icon}</Text>
                        <Text
                          className={`font-kanit-bold text-sm ${
                            selectedDistance === distance.value
                              ? "text-white"
                              : "text-gray-700"
                          }`}
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
                    <Text className="text-gray-900 font-kanit-bold text-base mb-3">
                      Localisation
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 10 }}
                    >
                      <Pressable
                        onPress={() => setSelectedCountry(null)}
                        className={`px-4 py-3 rounded-xl ${
                          selectedCountry === null ? "bg-primary" : "bg-tertiary"
                        }`}
                        style={{
                          shadowColor:
                            selectedCountry === null ? "#FF6B4A" : "#A78BFA",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.15,
                          shadowRadius: 4,
                          elevation: 2,
                        }}
                      >
                        <Text
                          className={`font-kanit-bold text-sm ${
                            selectedCountry === null
                              ? "text-white"
                              : "text-gray-700"
                          }`}
                        >
                          Toutes
                        </Text>
                      </Pressable>
                      {availableCountries.slice(0, 15).map((country) => (
                        <Pressable
                          key={country}
                          onPress={() => setSelectedCountry(country)}
                          className={`px-4 py-3 rounded-xl ${
                            selectedCountry === country
                              ? "bg-primary"
                              : "bg-tertiary"
                          }`}
                          style={{
                            shadowColor:
                              selectedCountry === country ? "#FF6B4A" : "#A78BFA",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.15,
                            shadowRadius: 4,
                            elevation: 2,
                          }}
                        >
                          <Text
                            className={`font-kanit-bold text-sm ${
                              selectedCountry === country
                                ? "text-white"
                                : "text-gray-700"
                            }`}
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
            <View className="px-6 py-4 border-t border-gray-200 bg-white">
              <View className="flex-row gap-3">
                {activeFiltersCount > 0 && (
                  <Pressable
                    onPress={handleClear}
                    className="flex-1 bg-tertiary border border-primary py-4 rounded-xl"
                    style={{
                      shadowColor: "#FF6B4A",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                    }}
                  >
                    <Text className="text-center text-primary font-kanit-bold">
                      Effacer
                    </Text>
                  </Pressable>
                )}
                <Pressable
                  onPress={handleApply}
                  className={`${activeFiltersCount > 0 ? "flex-1" : "flex-1"} bg-primary py-4 rounded-xl`}
                  style={{
                    shadowColor: "#FF6B4A",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Text className="text-center text-white font-kanit-bold">
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

