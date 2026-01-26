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

const ACCENT = "#F97316";

export default function OrganizerAllEventsScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadEvents = async () => {
    try {
      console.log("🏢 [OrganizerAllEvents] Chargement des événements créés...");
      setLoading(true);
      setError(null);
      
      const response = await eventService.getMyEvents();
      console.log("🏢 [OrganizerAllEvents] Réponse getMyEvents:", response);
      
      // Ne prendre que les événements créés (pas ceux où on participe)
      const createdEventsRaw = response.created || [];
      console.log("🏢 [OrganizerAllEvents] Événements créés bruts:", createdEventsRaw.length, createdEventsRaw);
      
      // Extraire la propriété "event" de chaque élément (format: {event: {...}})
      const createdEvents = createdEventsRaw.map((item: any) => item.event || item);
      console.log("🏢 [OrganizerAllEvents] Événements créés extraits:", createdEvents.length, createdEvents);
      
      setEvents(createdEvents);
    } catch (error) {
      console.error("🏢 [OrganizerAllEvents] Erreur:", error);
      setError("Impossible de charger vos événements. Veuillez réessayer.");
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
          <Text className="text-red-500 text-center mb-4 font-nunito-medium">{error}</Text>
          <Pressable
            onPress={() => loadEvents()}
            className="bg-primary px-6 py-3 rounded-xl"
            style={{
              shadowColor: ACCENT,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-white font-nunito-bold">Réessayer</Text>
          </Pressable>
        </View>
      );
    }

    if (events.length === 0) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <View className="bg-tertiary p-8 rounded-full mb-6">
            <Ionicons name="calendar-outline" size={60} color={ACCENT} />
          </View>
          <Text className="text-gray-900 text-center text-lg mb-2 mt-4 font-nunito-bold">
            Aucun événement créé
          </Text>
          <Text className="text-gray-500 text-center font-nunito-medium mb-6">
            Vous n'avez pas encore créé d'événement.
          </Text>
          <Pressable
            onPress={() => router.push("/(app)/events/create")}
            className="bg-primary px-6 py-3 rounded-full"
            style={{
              shadowColor: ACCENT,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-white font-nunito-bold">Créer un événement</Text>
          </Pressable>
        </View>
      );
    }

    console.log("🏢 [OrganizerAllEvents] Rendu de", events.length, "événements");
    console.log("🏢 [OrganizerAllEvents] Premier événement:", events[0]);
    
    return (
      <View className="p-4">
        {events.map((event, index) => {
          console.log(`🏢 [OrganizerAllEvents] Rendu événement ${index}:`, event?.id, event?.name, "Type:", typeof event, "Keys:", event ? Object.keys(event) : "null");
          if (!event || !event.id) {
            console.warn(`🏢 [OrganizerAllEvents] Événement invalide à l'index ${index}:`, event);
            return null;
          }
          return (
            <View key={`${event.id}-${index}`} className="mb-6">
              <Pressable
                onPress={() => {
                  console.log(`🏢 [OrganizerAllEvents] Clic sur événement ${event.id}`);
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
    <View className="flex-1 bg-fond">
      <SafeAreaView className="bg-fond" edges={['top']}>
        <View className="px-6 py-4 flex-row items-center border-b border-gray-200">
          <Pressable onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color={ACCENT} />
          </Pressable>
          <Text className="text-2xl font-nunito-extrabold text-gray-900">
            Mes événements
          </Text>
        </View>
      </SafeAreaView>

      <ScrollView
        className="flex-1"
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
    </View>
  );
}

