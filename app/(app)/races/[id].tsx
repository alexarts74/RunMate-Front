import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { raceService } from "@/service/api/race";
import { Race } from "@/interface/Race";
import LoadingScreen from "@/components/LoadingScreen";

export default function RaceDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [race, setRace] = useState<Race | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRaceDetails = async () => {
    try {
      const data = await raceService.getRaceById(Number(id));
      setRace(data);
    } catch (error) {
      console.error("Erreur lors du chargement de la course:", error);
      Alert.alert("Erreur", "Impossible de charger les détails de la course");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRaceDetails();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTimeUntilRace = (raceDate: string) => {
    if (!raceDate) {
      return { days: 0, isExpired: true };
    }

    const now = new Date();
    const race = new Date(raceDate);

    // Réinitialiser les heures pour avoir un calcul précis des jours
    now.setHours(0, 0, 0, 0);
    race.setHours(0, 0, 0, 0);

    // Calculer la différence en jours
    const differenceInTime = race.getTime() - now.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    if (differenceInTime <= 0) {
      return { days: 0, isExpired: true };
    }

    return {
      days: differenceInDays,
      isExpired: false,
    };
  };

  const [countdown, setCountdown] = useState({
    days: 0,
    isExpired: true,
  });

  useEffect(() => {
    if (race?.start_date) {
      setCountdown(getTimeUntilRace(race.start_date));
    }
  }, [race]);

  const formatDistance = (distance: number) => {
    if (distance === 42.195) return "Marathon";
    if (distance === 21.0975) return "Semi-marathon";
    if (distance === 10) return "10 km";
    if (distance === 5) return "5 km";
    return `${distance} km`;
  };

  if (loading || !race) {
    return <LoadingScreen />;
  }

  return (
    <View className="flex-1 bg-fond">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image de couverture avec header */}
        <View className="relative h-64">
          {race.cover_image ? (
            <Image
              source={{
                uri: race.cover_image,
              }}
              className="w-full h-full"
              style={{ resizeMode: "cover" }}
            />
          ) : (
            <View className="w-full h-full bg-gradient-to-br from-primary to-secondary" />
          )}
          {/* Overlay gradient */}
          <View className="absolute inset-0 bg-black/30" />
          <SafeAreaView
            className="absolute inset-0"
            edges={["top"]}
            style={{ position: "absolute" }}
          >
            <View className="flex-row items-center pt-2 pl-4 z-10">
              <Pressable
                onPress={() => router.back()}
                className="w-11 h-11 bg-white/90 rounded-full items-center justify-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Ionicons name="arrow-back" size={22} color="#FF6B4A" />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        <View className="px-6 py-6 bg-fond">
          {/* Titre et badges */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3 flex-wrap">
              {countdown.isExpired ? (
                <View className="bg-red-100 border border-red-300 px-4 py-2 rounded-full mb-2">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#DC2626"
                      style={{ marginRight: 6 }}
                    />
                    <Text className="text-red-600 font-nunito-bold text-sm">
                      Course terminée
                    </Text>
                  </View>
                </View>
              ) : (
                <View className="bg-tertiary border border-secondary px-4 py-2 rounded-full flex-row items-center mb-2">
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color="#A78BFA"
                    style={{ marginRight: 6 }}
                  />
                  <Text className="text-secondary font-nunito-bold text-sm">
                    Dans {countdown.days} jour{countdown.days > 1 ? "s" : ""}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-gray-900 font-nunito-black text-3xl mb-3">
              {race.name}
            </Text>
            {race.distances && race.distances.length > 0 && (
              <View className="flex-row items-center mb-2">
                <Ionicons name="trophy" size={18} color="#F59E0B" />
                <Text className="text-gray-600 font-nunito-medium text-sm ml-2">
                  {race.distances.length} distance{race.distances.length > 1 ? "s" : ""} disponible{race.distances.length > 1 ? "s" : ""}
                </Text>
              </View>
            )}
          </View>

          {/* Informations principales */}
          <View
            className="bg-white p-5 rounded-2xl mb-6"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text className="text-gray-900 font-nunito-extrabold text-lg mb-4">
              Informations de la course
            </Text>
            <View className="space-y-4">
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center mr-4">
                  <Ionicons name="calendar" size={22} color="#FF6B4A" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 font-nunito-medium text-xs mb-1">
                    Date de la course
                  </Text>
                  <Text className="text-gray-900 font-nunito-bold text-base">
                    {formatDate(race.start_date)}
                  </Text>
                </View>
              </View>

              <View className="h-px bg-gray-200" />

              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-xl bg-secondary/10 items-center justify-center mr-4">
                  <Ionicons name="location" size={22} color="#A78BFA" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 font-nunito-medium text-xs mb-1">
                    Localisation
                  </Text>
                  <Text className="text-gray-900 font-nunito-bold text-base">
                    {race.location}
                  </Text>
                </View>
              </View>

              {/* Distances disponibles */}
              {race.distances && race.distances.length > 0 && (
                <View>
                  <View className="h-px bg-gray-200 mb-4" />
                  <View className="flex-row items-start">
                    <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center mr-4 mt-1">
                      <Ionicons name="flag" size={22} color="#FF6B4A" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-nunito-extrabold text-sm mb-2">
                        Distances disponibles
                      </Text>
                      <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                        {race.distances.map((distance, index) => (
                          <View
                            key={index}
                            className="bg-primary px-4 py-2.5 rounded-xl"
                            style={{
                              shadowColor: "#FF6B4A",
                              shadowOffset: { width: 0, height: 2 },
                              shadowOpacity: 0.2,
                              shadowRadius: 4,
                              elevation: 2,
                            }}
                          >
                            <Text className="text-white font-nunito-bold text-sm">
                              {formatDistance(distance)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Description */}
          {race.description && (
            <View
              className="bg-white p-5 rounded-2xl mb-6"
              style={{
                shadowColor: "#A78BFA",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text className="text-gray-900 font-nunito-extrabold text-lg mb-3">
                Description
              </Text>
              <Text className="text-gray-600 font-nunito-medium leading-6">
                {race.description}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

