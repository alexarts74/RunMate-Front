import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Race } from "@/interface/Race";

export const RaceCard = ({ race }: { race: Race }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDistance = (distance: number) => {
    if (distance === 42.195) return "Marathon";
    if (distance === 21.0975) return "Semi-marathon";
    if (distance === 10) return "10 km";
    if (distance === 5) return "5 km";
    return `${distance} km`;
  };

  const getTimeUntilRace = (raceDate: string) => {
    if (!raceDate) return null;
    const now = new Date();
    const race = new Date(raceDate);
    now.setHours(0, 0, 0, 0);
    race.setHours(0, 0, 0, 0);
    const differenceInTime = race.getTime() - now.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    if (differenceInTime <= 0) return null;
    return differenceInDays;
  };

  const daysUntil = getTimeUntilRace(race.start_date);

  return (
    <Pressable
      onPress={() => router.push(`/(app)/races/${race.id}`)}
      className="bg-white rounded-2xl mb-6 overflow-hidden"
      style={{
        shadowColor: "#FF6B4A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      }}
      android_ripple={{ color: "rgba(255, 107, 74, 0.1)" }}
    >
      {/* Cover Image */}
      {race.cover_image && (
        <Image
          source={{
            uri: race.cover_image,
          }}
          className="w-full h-48"
          style={{ resizeMode: "cover" }}
        />
      )}

      {/* Content Container */}
      <View className="p-5">
        {/* Badge de temps restant */}
        {daysUntil !== null && (
          <View className="mb-3">
            <View className="bg-tertiary border border-secondary px-3 py-1 rounded-full self-start flex-row items-center">
              <Ionicons
                name="time-outline"
                size={12}
                color="#A78BFA"
                style={{ marginRight: 4 }}
              />
              <Text className="text-secondary font-kanit-bold text-xs">
                Dans {daysUntil} jour{daysUntil > 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        )}

        <Text className="text-gray-900 font-kanit-bold text-xl mb-4">
          {race.name}
        </Text>

        <View className="space-y-3 mb-4">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-tertiary items-center justify-center mr-3">
              <Ionicons name="calendar" size={16} color="#FF6B4A" />
            </View>
            <Text className="text-gray-700 font-kanit-medium">
              {formatDate(race.start_date)}
            </Text>
          </View>

          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-tertiary items-center justify-center mr-3">
              <Ionicons name="location" size={16} color="#A78BFA" />
            </View>
            <Text className="text-gray-700 font-kanit-medium flex-1">
              {race.location}
            </Text>
          </View>

          {/* Distances disponibles */}
          {race.distances && race.distances.length > 0 && (
            <View className="flex-row items-start">
              <View className="w-8 h-8 rounded-lg bg-tertiary items-center justify-center mr-3 mt-0.5">
                <Ionicons name="flag" size={16} color="#FF6B4A" />
              </View>
              <View className="flex-1 flex-row flex-wrap" style={{ gap: 6 }}>
                {race.distances.map((distance, index) => (
                  <View
                    key={index}
                    className="bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-lg"
                  >
                    <Text className="text-primary font-kanit-bold text-xs">
                      {formatDistance(distance)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {race.description && (
          <Text className="text-gray-600 mb-4 font-kanit-medium text-sm leading-5">
            {race.description.slice(0, 120)}
            {race.description.length > 120 ? "..." : ""}
          </Text>
        )}

        <Pressable
          onPress={() => router.push(`/(app)/races/${race.id}`)}
          className="bg-primary py-3 rounded-xl"
          style={{
            shadowColor: "#FF6B4A",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 3,
          }}
          android_ripple={{ color: "rgba(255, 255, 255, 0.2)" }}
        >
          <Text className="text-center text-white font-kanit-bold">
            Voir les détails
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

