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

const ACCENT = "#F97316";

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

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (locationFilter) count++;
    if (selectedCountry) count++;
    if (selectedDistance !== null) count++;
    if (!showFutureOnly) count++;
    return count;
  }, [locationFilter, selectedCountry, selectedDistance, showFutureOnly]);

  const races = useMemo(() => {
    let filtered = [...allRaces];

    if (locationFilter) {
      filtered = filtered.filter((race) =>
        race.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter((race) => {
        const parts = race.location.split("(");
        if (parts.length > 0) {
          return parts[0].trim() === selectedCountry;
        }
        return race.location.includes(selectedCountry);
      });
    }

    if (selectedDistance !== null) {
      filtered = filtered.filter((race) =>
        race.distances?.includes(selectedDistance)
      );
    }

    if (showFutureOnly) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter((race) => {
        const raceDate = new Date(race.start_date);
        raceDate.setHours(0, 0, 0, 0);
        return raceDate >= today;
      });
    }

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
        <View className="flex-1 justify-center items-center p-6">
          <Text className="text-red-500 text-center mb-4 font-nunito-medium">
            {error}
          </Text>
          <Pressable
            onPress={() => loadRaces(locationFilter)}
            className="px-6 py-3 rounded-2xl"
            style={{ backgroundColor: ACCENT }}
          >
            <Text className="text-white font-nunito-bold">Réessayer</Text>
          </Pressable>
        </View>
      );
    }

    if (races.length === 0) {
      return (
        <View className="flex-1 justify-center items-center p-6">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: `${ACCENT}15` }}
          >
            <Ionicons name="trophy-outline" size={40} color={ACCENT} />
          </View>
          <Text className="text-neutral-900 text-xl font-nunito-bold text-center mb-2">
            Aucune course
          </Text>
          <Text className="text-neutral-500 text-sm font-nunito-medium text-center">
            {activeFiltersCount > 0
              ? "Aucune course ne correspond à vos critères."
              : "Aucune course disponible pour le moment."}
          </Text>
          {activeFiltersCount > 0 && (
            <Pressable
              onPress={clearAllFilters}
              className="mt-4 px-6 py-3 rounded-2xl"
              style={{ backgroundColor: ACCENT }}
            >
              <Text className="text-white font-nunito-bold">
                Réinitialiser les filtres
              </Text>
            </Pressable>
          )}
        </View>
      );
    }

    return (
      <View className="px-6 pt-4">
        {races.map((race) => (
          <RaceCard key={race.id} race={race} />
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={["top"]}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-neutral-100 items-center justify-center mr-3"
            >
              <Ionicons name="arrow-back" size={20} color="#525252" />
            </Pressable>
            <Text className="text-xl font-nunito-bold text-neutral-900">
              Courses
            </Text>
          </View>
          <Pressable
            onPress={() => setFiltersVisible(true)}
            className="flex-row items-center px-4 py-2.5 rounded-xl"
            style={{ backgroundColor: activeFiltersCount > 0 ? ACCENT : "#F5F5F5" }}
          >
            <Ionicons
              name="options-outline"
              size={18}
              color={activeFiltersCount > 0 ? "white" : "#525252"}
            />
            <Text
              className={`font-nunito-bold text-sm ml-2 ${
                activeFiltersCount > 0 ? "text-white" : "text-neutral-600"
              }`}
            >
              Filtres
            </Text>
            {activeFiltersCount > 0 && (
              <View className="ml-2 bg-white/30 px-1.5 py-0.5 rounded-full">
                <Text className="text-white font-nunito-bold text-xs">
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Search Bar */}
      <View className="px-6 pb-4">
        <View className="bg-neutral-100 flex-row items-center px-4 py-3 rounded-xl">
          <Ionicons name="search" size={18} color="#A3A3A3" />
          <TextInput
            placeholder="Rechercher par localisation..."
            value={searchLocation}
            onChangeText={setSearchLocation}
            onSubmitEditing={handleSearch}
            className="flex-1 ml-3 font-nunito text-neutral-900 text-sm"
            placeholderTextColor="#A3A3A3"
          />
          {searchLocation.length > 0 && (
            <Pressable onPress={() => setSearchLocation("")}>
              <Ionicons name="close-circle" size={18} color="#A3A3A3" />
            </Pressable>
          )}
        </View>

        {/* Active filters badges */}
        {activeFiltersCount > 0 && (
          <View className="mt-3 flex-row items-center flex-wrap" style={{ gap: 8 }}>
            {locationFilter && (
              <View
                className="px-3 py-1.5 rounded-full flex-row items-center"
                style={{ backgroundColor: `${ACCENT}15` }}
              >
                <Text className="font-nunito-medium text-xs" style={{ color: ACCENT }}>
                  {locationFilter}
                </Text>
                <Pressable
                  onPress={() => {
                    setSearchLocation("");
                    setLocationFilter("");
                  }}
                  className="ml-2"
                >
                  <Ionicons name="close-circle" size={14} color={ACCENT} />
                </Pressable>
              </View>
            )}
            {selectedCountry && (
              <View
                className="px-3 py-1.5 rounded-full flex-row items-center"
                style={{ backgroundColor: `${ACCENT}15` }}
              >
                <Text className="font-nunito-medium text-xs" style={{ color: ACCENT }}>
                  {selectedCountry}
                </Text>
                <Pressable onPress={() => setSelectedCountry(null)} className="ml-2">
                  <Ionicons name="close-circle" size={14} color={ACCENT} />
                </Pressable>
              </View>
            )}
            {selectedDistance !== null && (
              <View
                className="px-3 py-1.5 rounded-full flex-row items-center"
                style={{ backgroundColor: `${ACCENT}15` }}
              >
                <Text className="font-nunito-medium text-xs" style={{ color: ACCENT }}>
                  {selectedDistance === 42.195
                    ? "Marathon"
                    : selectedDistance === 21.0975
                    ? "Semi-marathon"
                    : `${selectedDistance} km`}
                </Text>
                <Pressable onPress={() => setSelectedDistance(null)} className="ml-2">
                  <Ionicons name="close-circle" size={14} color={ACCENT} />
                </Pressable>
              </View>
            )}
            <Pressable
              onPress={clearAllFilters}
              className="bg-neutral-200 px-3 py-1.5 rounded-full"
            >
              <Text className="text-neutral-600 font-nunito-bold text-xs">
                Effacer
              </Text>
            </Pressable>
          </View>
        )}

        {races.length > 0 && (
          <Text className="text-neutral-400 font-nunito-medium text-sm mt-3">
            {races.length} course{races.length > 1 ? "s" : ""} trouvée{races.length > 1 ? "s" : ""}
          </Text>
        )}
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={ACCENT}
          />
        }
      >
        {renderContent()}
      </ScrollView>

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
