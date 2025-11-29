import React, { useState, useEffect } from "react";
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
import { Race } from "@/interface/Race";
import LoadingScreen from "@/components/LoadingScreen";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AllRacesScreen() {
  const [races, setRaces] = useState<Race[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [searchLocation, setSearchLocation] = useState<string>("");
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
      setRaces(response.races || []);
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
    loadRaces(searchLocation);
  };

  const clearFilter = () => {
    setSearchLocation("");
    setLocationFilter("");
    loadRaces();
  };

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
            {locationFilter
              ? `Aucune course trouvée pour "${locationFilter}".`
              : "Aucune course n'est disponible pour le moment."}
          </Text>
          {locationFilter && (
            <Pressable
              onPress={clearFilter}
              className="mt-4 bg-primary px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-kanit-bold">
                Réinitialiser le filtre
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
        <View className="px-6 py-4 flex-row items-center border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#FF6B4A" />
          </Pressable>
          <Text className="text-2xl font-kanit-bold text-gray-900">
            Courses
          </Text>
        </View>
      </SafeAreaView>

      {/* Barre de recherche */}
      <View className="bg-white py-3 border-b border-gray-200 px-4">
        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center bg-tertiary rounded-xl px-4 py-2">
            <Ionicons name="search" size={20} color="#FF6B4A" />
            <TextInput
              placeholder="Rechercher par localisation..."
              value={searchLocation}
              onChangeText={setSearchLocation}
              onSubmitEditing={handleSearch}
              className="flex-1 ml-2 text-gray-900 font-kanit-medium"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <Pressable
            onPress={handleSearch}
            className="bg-primary px-4 py-2 rounded-xl"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="search" size={20} color="white" />
          </Pressable>
          {locationFilter && (
            <Pressable
              onPress={clearFilter}
              className="bg-gray-200 px-4 py-2 rounded-xl"
            >
              <Ionicons name="close" size={20} color="#666" />
            </Pressable>
          )}
        </View>
        {locationFilter && (
          <View className="mt-2 flex-row items-center">
            <Text className="text-gray-600 font-kanit-medium text-sm">
              Filtre actif: {locationFilter}
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
    </View>
  );
}

