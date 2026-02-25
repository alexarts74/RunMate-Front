import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { eventService } from "@/service/api/event";
import { Event } from "@/interface/Event";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/context/AuthContext";
import GlassCard from "@/components/ui/GlassCard";
import PulseLoader from "@/components/ui/PulseLoader";
import { useThemeColors, palette } from "@/constants/theme";

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useThemeColors();

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
          <View className="w-1 h-6 rounded-full mr-3" style={{ backgroundColor: colors.primary.DEFAULT }} />
          <Text style={{ color: colors.text.primary }} className="text-xl font-nunito-semibold">
            Événements à venir
          </Text>
        </View>

        <Pressable
          onPress={handleSeeAll}
          className="flex-row items-center px-3 py-1 rounded-full"
          style={{ backgroundColor: palette.primary.subtle }}
        >
          <Text style={{ color: colors.primary.DEFAULT }} className="font-nunito text-sm mr-1">
            Voir tout
          </Text>
          <Ionicons name="arrow-forward" size={14} color={colors.primary.DEFAULT} />
        </Pressable>
      </View>

      {/* Contenu */}
      {isLoading ? (
        <GlassCard>
          <View className="h-32 items-center justify-center">
            <PulseLoader color={colors.primary.DEFAULT} size={10} />
          </View>
        </GlassCard>
      ) : !user?.is_premium ? (
        <GlassCard>
          <View className="flex-row items-center mb-3">
            <View
              className="p-3 rounded-full mr-3"
              style={{ backgroundColor: palette.primary.subtle }}
            >
              <Ionicons name="calendar" size={24} color={colors.primary.DEFAULT} />
            </View>
            <View className="flex-1">
              <Text style={{ color: colors.text.primary }} className="font-nunito-semibold text-base mb-1">
                Participez à des événements
              </Text>
              <Text style={{ color: colors.text.tertiary }} className="text-xs">
                Fonctionnalité Premium
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push("/premium")}
            className="rounded-xl py-3 items-center"
            style={{ backgroundColor: colors.primary.DEFAULT }}
          >
            <Text className="text-white font-nunito-semibold">
              Débloquer Premium
            </Text>
          </Pressable>
        </GlassCard>
      ) : events.length === 0 ? (
        <GlassCard>
          <View className="p-5 items-center">
            <Ionicons name="calendar-outline" size={36} color={colors.primary.DEFAULT} />
            <Text style={{ color: colors.text.primary }} className="text-center font-nunito mt-2 mb-1">
              Aucun événement
            </Text>
            <Text style={{ color: colors.text.tertiary }} className="text-center text-sm">
              Aucun événement à proximité
            </Text>
          </View>
        </GlassCard>
      ) : (
        <View style={{ gap: 12 }}>
          {events.map((event, index) => (
            <Pressable
              key={`event-${event.id}-${index}`}
              onPress={() => handleEventPress(event.id)}
            >
              <GlassCard>
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-1 mr-3">
                    <Text
                      style={{ color: colors.text.primary }}
                      className="font-nunito-semibold text-base mb-1"
                      numberOfLines={1}
                    >
                      {event.name}
                    </Text>
                    <Text style={{ color: colors.text.tertiary }} className="text-xs" numberOfLines={1}>
                      {event.location}
                    </Text>
                  </View>
                  <View className="px-3 py-1 rounded-full" style={{ backgroundColor: palette.primary.subtle }}>
                    <Text style={{ color: colors.primary.DEFAULT }} className="text-xs font-nunito-semibold">
                      {formatDate(event.start_date)}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center" style={{ gap: 16 }}>
                  <View className="flex-row items-center">
                    <Ionicons name="people" size={14} color={colors.primary.DEFAULT} />
                    <Text style={{ color: colors.text.secondary }} className="text-xs ml-1">
                      {event.participants_count || 0}
                    </Text>
                  </View>
                  {event.distance && (
                    <View className="flex-row items-center">
                      <Ionicons name="speedometer" size={14} color={colors.primary.DEFAULT} />
                      <Text style={{ color: colors.text.secondary }} className="text-xs ml-1">
                        {event.distance}km
                      </Text>
                    </View>
                  )}
                </View>
              </GlassCard>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
