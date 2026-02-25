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
import WarmBackground from "@/components/ui/WarmBackground";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeColors } from "@/constants/theme";

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
  const { colors, shadows } = useThemeColors();

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
      setError("Impossible de charger les courses. Veuillez reessayer.");
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
          <Text
            className="text-center mb-4 font-nunito-medium"
            style={{ color: colors.error }}
          >
            {error}
          </Text>
          <GlassButton
            title="Reessayer"
            onPress={() => loadRaces(locationFilter)}
          />
        </View>
      );
    }

    if (races.length === 0) {
      return (
        <View className="flex-1 justify-center items-center p-6">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: colors.primary.subtle }}
          >
            <Ionicons name="trophy-outline" size={40} color={colors.primary.DEFAULT} />
          </View>
          <Text
            className="text-xl font-nunito-bold text-center mb-2"
            style={{ color: colors.text.primary }}
          >
            Aucune course
          </Text>
          <Text
            className="text-sm font-nunito-medium text-center"
            style={{ color: colors.text.secondary }}
          >
            {activeFiltersCount > 0
              ? "Aucune course ne correspond a vos criteres."
              : "Aucune course disponible pour le moment."}
          </Text>
          {activeFiltersCount > 0 && (
            <GlassButton
              title="Reinitialiser les filtres"
              onPress={clearAllFilters}
              style={{ marginTop: 16 }}
            />
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
    <WarmBackground>
      <SafeAreaView edges={["top"]}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: colors.glass.light }}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text.secondary} />
            </Pressable>
            <Text
              className="text-xl font-nunito-bold"
              style={{ color: colors.text.primary }}
            >
              Courses
            </Text>
          </View>
          <Pressable
            onPress={() => setFiltersVisible(true)}
            className="flex-row items-center px-4 py-2.5 rounded-xl"
            style={{
              backgroundColor: activeFiltersCount > 0 ? colors.primary.DEFAULT : colors.glass.light,
            }}
          >
            <Ionicons
              name="options-outline"
              size={18}
              color={activeFiltersCount > 0 ? "white" : colors.text.secondary}
            />
            <Text
              className="font-nunito-bold text-sm ml-2"
              style={{
                color: activeFiltersCount > 0 ? colors.text.inverse : colors.text.secondary,
              }}
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
        <View
          className="flex-row items-center px-4 py-3 rounded-xl"
          style={{
            backgroundColor: colors.glass.light,
            borderWidth: 1,
            borderColor: colors.glass.border,
          }}
        >
          <Ionicons name="search" size={18} color={colors.text.tertiary} />
          <TextInput
            placeholder="Rechercher par localisation..."
            value={searchLocation}
            onChangeText={setSearchLocation}
            onSubmitEditing={handleSearch}
            className="flex-1 ml-3 font-nunito text-sm"
            placeholderTextColor={colors.text.tertiary}
            style={{ color: colors.text.primary }}
          />
          {searchLocation.length > 0 && (
            <Pressable onPress={() => setSearchLocation("")}>
              <Ionicons name="close-circle" size={18} color={colors.text.tertiary} />
            </Pressable>
          )}
        </View>

        {/* Active filters badges */}
        {activeFiltersCount > 0 && (
          <View className="mt-3 flex-row items-center flex-wrap" style={{ gap: 8 }}>
            {locationFilter && (
              <View
                className="px-3 py-1.5 rounded-full flex-row items-center"
                style={{ backgroundColor: colors.primary.subtle }}
              >
                <Text className="font-nunito-medium text-xs" style={{ color: colors.primary.DEFAULT }}>
                  {locationFilter}
                </Text>
                <Pressable
                  onPress={() => {
                    setSearchLocation("");
                    setLocationFilter("");
                  }}
                  className="ml-2"
                >
                  <Ionicons name="close-circle" size={14} color={colors.primary.DEFAULT} />
                </Pressable>
              </View>
            )}
            {selectedCountry && (
              <View
                className="px-3 py-1.5 rounded-full flex-row items-center"
                style={{ backgroundColor: colors.primary.subtle }}
              >
                <Text className="font-nunito-medium text-xs" style={{ color: colors.primary.DEFAULT }}>
                  {selectedCountry}
                </Text>
                <Pressable onPress={() => setSelectedCountry(null)} className="ml-2">
                  <Ionicons name="close-circle" size={14} color={colors.primary.DEFAULT} />
                </Pressable>
              </View>
            )}
            {selectedDistance !== null && (
              <View
                className="px-3 py-1.5 rounded-full flex-row items-center"
                style={{ backgroundColor: colors.primary.subtle }}
              >
                <Text className="font-nunito-medium text-xs" style={{ color: colors.primary.DEFAULT }}>
                  {selectedDistance === 42.195
                    ? "Marathon"
                    : selectedDistance === 21.0975
                    ? "Semi-marathon"
                    : `${selectedDistance} km`}
                </Text>
                <Pressable onPress={() => setSelectedDistance(null)} className="ml-2">
                  <Ionicons name="close-circle" size={14} color={colors.primary.DEFAULT} />
                </Pressable>
              </View>
            )}
            <Pressable
              onPress={clearAllFilters}
              className="px-3 py-1.5 rounded-full"
              style={{ backgroundColor: colors.glass.medium }}
            >
              <Text className="font-nunito-bold text-xs" style={{ color: colors.text.secondary }}>
                Effacer
              </Text>
            </Pressable>
          </View>
        )}

        {races.length > 0 && (
          <Text
            className="font-nunito-medium text-sm mt-3"
            style={{ color: colors.text.tertiary }}
          >
            {races.length} course{races.length > 1 ? "s" : ""} trouvee{races.length > 1 ? "s" : ""}
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
            tintColor={colors.primary.DEFAULT}
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
    </WarmBackground>
  );
}
