import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { raceService } from "@/service/api/race";
import { RaceCard } from "@/components/races/RaceCard";
import { RacesFilters } from "@/components/races/RacesFilters";
import { Race } from "@/interface/Race";
import LoadingScreen from "@/components/LoadingScreen";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AllRacesScreen() {
  const [allRaces, setAllRaces] = useState<Race[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [showFutureOnly, setShowFutureOnly] = useState<boolean>(true);
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false);
  const router = useRouter();

  const loadRaces = async (location?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (location) {
        params.location = location;
      }
      // Charger toutes les courses, on filtrera côté client
      const response = await raceService.getAllRaces(params);
      setAllRaces(response.races || []);
    } catch (error) {
      console.error("Erreur lors du chargement des courses:", error);
      setError("Impossible de charger les courses. Veuillez réessayer.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRaces(locationFilter);
  };

  useEffect(() => {
    loadRaces();
  }, []);

  const handleSearch = () => {
    setLocationFilter(searchLocation);
  };

  const handleApplyFilters = () => {
    setLocationFilter(searchLocation);
  };

  const clearAllFilters = () => {
    setSearchLocation("");
    setLocationFilter("");
    setShowFutureOnly(true);
    setSelectedDistance(null);
    setSelectedCountry(null);
  };

  // Compter les filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (locationFilter) count++;
    if (selectedCountry) count++;
    if (selectedDistance !== null) count++;
    if (!showFutureOnly) count++;
    return count;
  }, [locationFilter, selectedCountry, selectedDistance, showFutureOnly]);

  // Filtrer les courses selon les critères
  const races = useMemo(() => {
    let filtered = [...allRaces];

    // Filtre par localisation (recherche textuelle)
    if (locationFilter) {
      filtered = filtered.filter((race) =>
        race.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filtre par pays
    if (selectedCountry) {
      filtered = filtered.filter((race) => {
        const parts = race.location.split("(");
        if (parts.length > 0) {
          return parts[0].trim() === selectedCountry;
        }
        return race.location.includes(selectedCountry);
      });
    }

    // Filtre par distance
    if (selectedDistance !== null) {
      filtered = filtered.filter((race) =>
        race.distances?.includes(selectedDistance)
      );
    }

    // Filtre par date (courses futures uniquement)
    if (showFutureOnly) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter((race) => {
        const raceDate = new Date(race.start_date);
        raceDate.setHours(0, 0, 0, 0);
        return raceDate >= today;
      });
    }

    // Trier par date (croissant)
    filtered.sort((a, b) => {
      const dateA = new Date(a.start_date).getTime();
      const dateB = new Date(b.start_date).getTime();
      return dateA - dateB;
    });

    return filtered;
  }, [allRaces, locationFilter, selectedCountry, selectedDistance, showFutureOnly]);

  const renderContent = () => {
    if (loading && !refreshing) {
      return <LoadingScreen />;
    }

    if (error) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-center mb-4 font-kanit-medium">
            {error}
          </Text>
          <Pressable
            onPress={() => loadRaces(locationFilter)}
            className="bg-primary px-6 py-3 rounded-xl"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-white font-kanit-bold">Réessayer</Text>
          </Pressable>
        </View>
      );
    }

    if (races.length === 0) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <View className="bg-tertiary p-8 rounded-full mb-6">
            <Ionicons name="trophy-outline" size={60} color="#FF6B4A" />
          </View>
          <Text className="text-gray-900 text-center text-lg mb-2 mt-4 font-kanit-bold">
            Aucune course disponible
          </Text>
          <Text className="text-gray-500 text-center font-kanit-medium">
            {locationFilter || selectedCountry || selectedDistance !== null
              ? "Aucune course ne correspond à vos critères de recherche."
              : "Aucune course n'est disponible pour le moment."}
          </Text>
          {(locationFilter || selectedCountry || selectedDistance !== null) && (
            <Pressable
              onPress={clearAllFilters}
              className="mt-4 bg-primary px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-kanit-bold">
                Réinitialiser les filtres
              </Text>
            </Pressable>
          )}
        </View>
      );
    }

    return (
      <View className="p-4">
        {races.map((race) => (
          <RaceCard key={race.id} race={race} />
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-fond">
      <SafeAreaView className="bg-fond" edges={["top"]}>
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-gray-200">
          <View className="flex-row items-center">
            <Pressable onPress={() => router.back()} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#FF6B4A" />
            </Pressable>
            <Text className="text-2xl font-kanit-bold text-gray-900">
              Courses
            </Text>
          </View>
          <Pressable
            onPress={() => setFiltersVisible(true)}
            className="relative"
          >
            <View
              className={`px-4 py-2 rounded-xl flex-row items-center ${
                activeFiltersCount > 0 ? "bg-primary" : "bg-tertiary"
              }`}
              style={{
                shadowColor: activeFiltersCount > 0 ? "#FF6B4A" : "#A78BFA",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Ionicons
                name="filter"
                size={20}
                color={activeFiltersCount > 0 ? "white" : "#A78BFA"}
                style={{ marginRight: 6 }}
              />
              <Text
                className={`font-kanit-bold text-sm ${
                  activeFiltersCount > 0 ? "text-white" : "text-gray-700"
                }`}
              >
                Filtres
              </Text>
              {activeFiltersCount > 0 && (
                <View className="ml-2 bg-white/30 px-2 py-0.5 rounded-full">
                  <Text className="text-white font-kanit-bold text-xs">
                    {activeFiltersCount}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Barre de recherche simplifiée */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center bg-tertiary rounded-xl px-4 py-2.5">
            <Ionicons name="search" size={20} color="#FF6B4A" />
            <TextInput
              placeholder="Rechercher par localisation..."
              value={searchLocation}
              onChangeText={setSearchLocation}
              onSubmitEditing={handleSearch}
              className="flex-1 ml-2 text-gray-900 font-kanit-medium"
              placeholderTextColor="#9CA3AF"
            />
            {searchLocation.length > 0 && (
              <Pressable onPress={() => setSearchLocation("")}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Badges de filtres actifs */}
        {activeFiltersCount > 0 && (
          <View className="mt-3 flex-row items-center flex-wrap" style={{ gap: 8 }}>
            {locationFilter && (
              <View className="bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-full flex-row items-center">
                <Text className="text-primary font-kanit-medium text-xs">
                  {locationFilter}
                </Text>
                <Pressable
                  onPress={() => {
                    setSearchLocation("");
                    setLocationFilter("");
                  }}
                  className="ml-2"
                >
                  <Ionicons name="close-circle" size={16} color="#FF6B4A" />
                </Pressable>
              </View>
            )}
            {selectedCountry && (
              <View className="bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-full flex-row items-center">
                <Text className="text-primary font-kanit-medium text-xs">
                  {selectedCountry}
                </Text>
                <Pressable
                  onPress={() => setSelectedCountry(null)}
                  className="ml-2"
                >
                  <Ionicons name="close-circle" size={16} color="#FF6B4A" />
                </Pressable>
              </View>
            )}
            {selectedDistance !== null && (
              <View className="bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-full flex-row items-center">
                <Text className="text-primary font-kanit-medium text-xs">
                  {selectedDistance === 42.195
                    ? "Marathon"
                    : selectedDistance === 21.0975
                    ? "Semi-marathon"
                    : selectedDistance === 10
                    ? "10 km"
                    : selectedDistance === 5
                    ? "5 km"
                    : `${selectedDistance} km`}
                </Text>
                <Pressable
                  onPress={() => setSelectedDistance(null)}
                  className="ml-2"
                >
                  <Ionicons name="close-circle" size={16} color="#FF6B4A" />
                </Pressable>
              </View>
            )}
            {!showFutureOnly && (
              <View className="bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-full flex-row items-center">
                <Text className="text-primary font-kanit-medium text-xs">
                  Toutes dates
                </Text>
                <Pressable
                  onPress={() => setShowFutureOnly(true)}
                  className="ml-2"
                >
                  <Ionicons name="close-circle" size={16} color="#FF6B4A" />
                </Pressable>
              </View>
            )}
            <Pressable
              onPress={clearAllFilters}
              className="bg-gray-200 px-3 py-1.5 rounded-full"
            >
              <Text className="text-gray-700 font-kanit-bold text-xs">
                Tout effacer
              </Text>
            </Pressable>
          </View>
        )}

        {/* Compteur de résultats */}
        {races.length > 0 && (
          <View className="mt-3">
            <Text className="text-gray-500 font-kanit-medium text-sm">
              {races.length} course{races.length > 1 ? "s" : ""} trouvée{races.length > 1 ? "s" : ""}
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF6B4A"
          />
        }
      >
        {renderContent()}
      </ScrollView>

      {/* Modal de filtres */}
      <RacesFilters
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        allRaces={allRaces}
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        showFutureOnly={showFutureOnly}
        setShowFutureOnly={setShowFutureOnly}
        selectedDistance={selectedDistance}
        setSelectedDistance={setSelectedDistance}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        onApplyFilters={handleApplyFilters}
        onClearFilters={clearAllFilters}
        activeFiltersCount={activeFiltersCount}
      />
    </View>
  );
}

