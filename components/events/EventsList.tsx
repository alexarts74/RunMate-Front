import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { eventService } from "@/service/api/event";
import { EventCard } from "./EventCard";
import { Event } from "@/interface/Event";

interface EventsListProps {
  eventsType: "all" | "my";
}

const distances = [
  { label: "Tous", value: 1000, icon: "🌍", id: "all" },
  { label: "5km", value: 5, icon: "🚶", id: "walk" },
  { label: "10km", value: 10, icon: "🏃", id: "run" },
  { label: "50km", value: 50, icon: "🚴", id: "bike" },
  { label: "200km", value: 200, icon: "🚗", id: "car" },
  { label: "1000km", value: 1000, icon: "✈️", id: "plane" },
];

export const EventsList = ({ eventsType }: EventsListProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState<number>(5);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = async (selectedRadius: number = radius) => {
    setLoading(true);
    setError(null);
    try {
      if (eventsType === "my") {
        const response = await eventService.getMyEvents();
        const createdEvents = response.created.map((item) => ({
          ...item.event,
          is_creator: true,
          is_participant: false,
        }));
        const participatingEvents = response.participating.map((item) => ({
          ...item.event,
          is_creator: false,
          is_participant: true,
        }));
        setEvents([...createdEvents, ...participatingEvents]);
      } else {
        const response = await eventService.getAllEvents({
          radius: selectedRadius,
        });
        const events = response.map((item) => item.event);
        setEvents(events);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
      setError("Impossible de charger les événements. Veuillez réessayer.");
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
  }, [eventsType]);

  const DistanceFilter = () => (
    <View className="bg-[#12171b] py-3">
      <Text className="text-white text-center text-lg mb-2">
        Filtrer par distance
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4"
      >
        <View className="flex-row gap-2">
          {distances.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                setRadius(item.value);
                loadEvents(item.value);
              }}
              className={`px-4 py-3 rounded-xl flex-row items-center gap-2 ${
                radius === item.value
                  ? "bg-[#1e2429] border border-green"
                  : "bg-[#1e2429] border border-[#2a3137]"
              }`}
            >
              <Text className="text-base">{item.icon}</Text>
              <Text
                className={`${
                  radius === item.value ? "text-green font-bold" : "text-white"
                } text-base`}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View className="flex-1 justify-center h-full my-auto items-center">
          <ActivityIndicator size="large" color="#b9f144" />
          <Text className="text-white mt-4">Chargement des événements...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <Pressable
            onPress={() => loadEvents()}
            className="bg-[#00dc82] px-6 py-3 rounded-xl"
          >
            <Text className="text-[#12171b] font-bold">Réessayer</Text>
          </Pressable>
        </View>
      );
    }

    if (events.length === 0) {
      return (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-white text-center text-lg mb-2">
            Aucun événement disponible
          </Text>
          <Text className="text-gray-400 text-center">
            {radius === 1000
              ? "Aucun événement n'est disponible pour le moment."
              : `Aucun événement trouvé dans un rayon de ${radius}km.`}
          </Text>
        </View>
      );
    }

    return (
      <View className="p-4">
        {events.map((event, index) => (
          <EventCard
            key={`${event.id}-${index}`}
            event={event}
            onEventUpdate={loadEvents}
          />
        ))}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-[#12171b]">
      {eventsType === "all" && <DistanceFilter />}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00dc82"
          />
        }
      >
        {renderContent()}
      </ScrollView>
    </View>
  );
};
