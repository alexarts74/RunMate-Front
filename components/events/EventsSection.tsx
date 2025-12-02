import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { eventService } from "@/service/api/event";
import { Event } from "@/interface/Event";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/context/AuthContext";

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const loadEvents = async () => {
    if (!user?.is_premium) return;

    setIsLoading(true);
    try {
      const response = await eventService.getAllEvents({ radius: 10 });
      // Extraire les événements de la structure {event: {...}}
      const eventsData = response.map((item: any) => item.event || item);
      // Limiter à 2 événements pour l'aperçu
      setEvents(eventsData.slice(0, 2));
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [user?.is_premium]);

  const handleSeeAll = () => {
    router.push("/(app)/events/all");
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
    };
    return date.toLocaleDateString("fr-FR", options);
  };

  return (
    <View className="px-5 py-3">
      {/* Header de la section */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <View className="w-1 h-6 bg-greenLight rounded-full mr-3" />
          <Text className="text-xl font-nunito-semibold text-white">
            📅 Événements à venir
          </Text>
        </View>

        <Pressable
          onPress={handleSeeAll}
          className="flex-row items-center bg-purple/10 px-3 py-1 rounded-full"
        >
          <Text className="text-greenLight font-nunito text-sm mr-1">
            Voir tout
          </Text>
          <Ionicons name="arrow-forward" size={14} color="#126C52" />
        </Pressable>
      </View>

      {/* Contenu */}
      {isLoading ? (
        <View className="h-32 bg-background rounded-2xl items-center justify-center border border-gray-700">
          <Ionicons name="hourglass-outline" size={32} color="#126C52" />
        </View>
      ) : !user?.is_premium ? (
        <View className="bg-background rounded-2xl p-5 border border-purple/30">
          <View className="flex-row items-center mb-3">
            <View className="bg-purple/20 p-3 rounded-full mr-3">
              <Ionicons name="calendar" size={24} color="#126C52" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-nunito-semibold text-base mb-1">
                Participez à des événements
              </Text>
              <Text className="text-gray-400 text-xs">
                Fonctionnalité Premium
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push("/premium")}
            className="bg-purple rounded-xl py-3 items-center"
          >
            <Text className="text-white font-nunito-semibold">
              Débloquer Premium
            </Text>
          </Pressable>
        </View>
      ) : events.length === 0 ? (
        <View className="bg-background rounded-2xl p-5 items-center border border-gray-700">
          <Ionicons name="calendar-outline" size={36} color="#126C52" />
          <Text className="text-white text-center font-nunito mt-2 mb-1">
            Aucun événement
          </Text>
          <Text className="text-gray-400 text-center text-sm">
            Aucun événement à proximité
          </Text>
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {events.map((event, index) => (
            <Pressable
              key={`event-${event.id}-${index}`}
              className="bg-background rounded-xl p-4 border border-gray-700"
              onPress={() => handleEventPress(event.id)}
            >
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 mr-3">
                  <Text
                    className="text-white font-nunito-semibold text-base mb-1"
                    numberOfLines={1}
                  >
                    {event.name}
                  </Text>
                  <Text className="text-gray-400 text-xs" numberOfLines={1}>
                    {event.location}
                  </Text>
                </View>
                <View className="bg-purple/20 px-3 py-1 rounded-full">
                  <Text className="text-greenLight text-xs font-nunito-semibold">
                    {formatDate(event.start_date)}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center" style={{ gap: 16 }}>
                <View className="flex-row items-center">
                  <Ionicons name="people" size={14} color="#126C52" />
                  <Text className="text-gray-300 text-xs ml-1">
                    {event.participants_count || 0}
                  </Text>
                </View>
                {event.distance && (
                  <View className="flex-row items-center">
                    <Ionicons name="speedometer" size={14} color="#126C52" />
                    <Text className="text-gray-300 text-xs ml-1">
                      {event.distance}km
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
