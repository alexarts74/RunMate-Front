import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { eventService } from "@/service/api/event";
import { Event } from "@/interface/Event";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { EventCard } from "@/components/events/EventCard";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeColors } from "@/constants/theme";

export default function OrganizerAllEventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { colors, shadows } = useThemeColors();

  const loadEvents = async () => {
    try {
      console.log("[OrganizerAllEvents] Chargement des evenements crees...");
      setLoading(true);
      setError(null);

      const response = await eventService.getMyEvents();
      console.log("[OrganizerAllEvents] Reponse getMyEvents:", response);

      const createdEventsRaw = response.created || [];
      console.log("[OrganizerAllEvents] Evenements crees bruts:", createdEventsRaw.length, createdEventsRaw);

      const createdEvents = createdEventsRaw.map((item: any) => item.event || item);
      console.log("[OrganizerAllEvents] Evenements crees extraits:", createdEvents.length, createdEvents);

      setEvents(createdEvents);
    } catch (error) {
      console.error("[OrganizerAllEvents] Erreur:", error);
      setError("Impossible de charger vos evenements. Veuillez reessayer.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const renderContent = () => {
    if (loading && !refreshing) {
      return <LoadingScreen />;
    }

    if (error) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-center mb-4 font-nunito-medium" style={{ color: colors.error }}>
            {error}
          </Text>
          <GlassButton
            title="Reessayer"
            onPress={() => loadEvents()}
          />
        </View>
      );
    }

    if (events.length === 0) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <View
            className="p-8 rounded-full mb-6"
            style={{ backgroundColor: colors.primary.subtle }}
          >
            <Ionicons name="calendar-outline" size={60} color={colors.primary.DEFAULT} />
          </View>
          <Text
            className="text-center text-lg mb-2 mt-4 font-nunito-bold"
            style={{ color: colors.text.primary }}
          >
            Aucun evenement cree
          </Text>
          <Text
            className="text-center font-nunito-medium mb-6"
            style={{ color: colors.text.tertiary }}
          >
            Vous n'avez pas encore cree d'evenement.
          </Text>
          <GlassButton
            title="Creer un evenement"
            onPress={() => router.push("/(app)/events/create")}
          />
        </View>
      );
    }

    console.log("[OrganizerAllEvents] Rendu de", events.length, "evenements");
    console.log("[OrganizerAllEvents] Premier evenement:", events[0]);

    return (
      <View className="p-4">
        {events.map((event, index) => {
          console.log(`[OrganizerAllEvents] Rendu evenement ${index}:`, event?.id, event?.name, "Type:", typeof event, "Keys:", event ? Object.keys(event) : "null");
          if (!event || !event.id) {
            console.warn(`[OrganizerAllEvents] Evenement invalide a l'index ${index}:`, event);
            return null;
          }
          return (
            <View key={`${event.id}-${index}`} className="mb-6">
              <Pressable
                onPress={() => {
                  console.log(`[OrganizerAllEvents] Clic sur evenement ${event.id}`);
                  router.push(`/(app)/organizer/events/${String(event.id)}`);
                }}
              >
                <EventCard
                  event={event}
                  onEventUpdate={loadEvents}
                />
              </Pressable>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <WarmBackground>
      <SafeAreaView edges={['top']}>
        <View
          className="px-6 py-4 flex-row items-center"
          style={{ borderBottomWidth: 1, borderBottomColor: colors.glass.border }}
        >
          <Pressable onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color={colors.primary.DEFAULT} />
          </Pressable>
          <Text
            className="text-2xl font-nunito-extrabold"
            style={{ color: colors.text.primary }}
          >
            Mes evenements
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
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
    </WarmBackground>
  );
}
