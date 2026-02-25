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
import WarmBackground from "@/components/ui/WarmBackground";
import GlassCard from "@/components/ui/GlassCard";
import { useThemeColors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";

export default function RaceDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [race, setRace] = useState<Race | null>(null);
  const [loading, setLoading] = useState(true);
  const { colors, shadows, gradients } = useThemeColors();

  const fetchRaceDetails = async () => {
    try {
      const data = await raceService.getRaceById(Number(id));
      setRace(data);
    } catch (error) {
      console.error("Erreur lors du chargement de la course:", error);
      Alert.alert("Erreur", "Impossible de charger les details de la course");
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

    now.setHours(0, 0, 0, 0);
    race.setHours(0, 0, 0, 0);

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
    <WarmBackground>
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
            <View
              className="w-full h-full"
              style={{ backgroundColor: colors.primary.DEFAULT }}
            />
          )}
          <LinearGradient
            colors={gradients.imageOverlay as unknown as [string, string, ...string[]]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <SafeAreaView
            className="absolute inset-0"
            edges={["top"]}
            style={{ position: "absolute" }}
          >
            <View className="flex-row items-center pt-2 pl-4 z-10">
              <Pressable
                onPress={() => router.back()}
                className="w-11 h-11 rounded-full items-center justify-center"
                style={{
                  backgroundColor: colors.glass.heavy,
                  ...shadows.sm,
                }}
              >
                <Ionicons name="arrow-back" size={22} color={colors.primary.DEFAULT} />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        <View className="px-6 py-6">
          {/* Titre et badges */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3 flex-wrap">
              {countdown.isExpired ? (
                <View
                  className="px-4 py-2 rounded-full mb-2"
                  style={{ backgroundColor: 'rgba(212,115,110,0.15)', borderWidth: 1, borderColor: colors.error }}
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={colors.error}
                      style={{ marginRight: 6 }}
                    />
                    <Text className="font-nunito-bold text-sm" style={{ color: colors.error }}>
                      Course terminee
                    </Text>
                  </View>
                </View>
              ) : (
                <View
                  className="px-4 py-2 rounded-full flex-row items-center mb-2"
                  style={{
                    backgroundColor: colors.primary.subtle,
                    borderWidth: 1,
                    borderColor: colors.primary.light,
                  }}
                >
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={colors.text.secondary}
                    style={{ marginRight: 6 }}
                  />
                  <Text className="font-nunito-bold text-sm" style={{ color: colors.text.secondary }}>
                    Dans {countdown.days} jour{countdown.days > 1 ? "s" : ""}
                  </Text>
                </View>
              )}
            </View>
            <Text
              className="font-nunito-black text-3xl mb-3"
              style={{ color: colors.text.primary }}
            >
              {race.name}
            </Text>
            {race.distances && race.distances.length > 0 && (
              <View className="flex-row items-center mb-2">
                <Ionicons name="trophy" size={18} color={colors.warning} />
                <Text className="font-nunito-medium text-sm ml-2" style={{ color: colors.text.secondary }}>
                  {race.distances.length} distance{race.distances.length > 1 ? "s" : ""} disponible{race.distances.length > 1 ? "s" : ""}
                </Text>
              </View>
            )}
          </View>

          {/* Informations principales */}
          <GlassCard variant="medium" style={{ marginBottom: 24 }}>
            <Text
              className="font-nunito-extrabold text-lg mb-4"
              style={{ color: colors.text.primary }}
            >
              Informations de la course
            </Text>
            <View className="space-y-4">
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: colors.primary.subtle }}
                >
                  <Ionicons name="calendar" size={22} color={colors.primary.DEFAULT} />
                </View>
                <View className="flex-1">
                  <Text className="font-nunito-medium text-xs mb-1" style={{ color: colors.text.tertiary }}>
                    Date de la course
                  </Text>
                  <Text className="font-nunito-bold text-base" style={{ color: colors.text.primary }}>
                    {formatDate(race.start_date)}
                  </Text>
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: colors.glass.border }} />

              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: colors.primary.subtle }}
                >
                  <Ionicons name="location" size={22} color={colors.text.secondary} />
                </View>
                <View className="flex-1">
                  <Text className="font-nunito-medium text-xs mb-1" style={{ color: colors.text.tertiary }}>
                    Localisation
                  </Text>
                  <Text className="font-nunito-bold text-base" style={{ color: colors.text.primary }}>
                    {race.location}
                  </Text>
                </View>
              </View>

              {/* Distances disponibles */}
              {race.distances && race.distances.length > 0 && (
                <View>
                  <View style={{ height: 1, backgroundColor: colors.glass.border, marginBottom: 16 }} />
                  <View className="flex-row items-start">
                    <View
                      className="w-12 h-12 rounded-xl items-center justify-center mr-4 mt-1"
                      style={{ backgroundColor: colors.primary.subtle }}
                    >
                      <Ionicons name="flag" size={22} color={colors.primary.DEFAULT} />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-nunito-extrabold text-sm mb-2"
                        style={{ color: colors.text.primary }}
                      >
                        Distances disponibles
                      </Text>
                      <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                        {race.distances.map((distance, index) => (
                          <View
                            key={index}
                            className="px-4 py-2.5 rounded-xl"
                            style={{
                              backgroundColor: colors.primary.DEFAULT,
                              ...shadows.sm,
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
          </GlassCard>

          {/* Description */}
          {race.description && (
            <GlassCard variant="light" style={{ marginBottom: 24 }}>
              <Text
                className="font-nunito-extrabold text-lg mb-3"
                style={{ color: colors.text.primary }}
              >
                Description
              </Text>
              <Text
                className="font-nunito-medium leading-6"
                style={{ color: colors.text.secondary }}
              >
                {race.description}
              </Text>
            </GlassCard>
          )}
        </View>
      </ScrollView>
    </WarmBackground>
  );
}
