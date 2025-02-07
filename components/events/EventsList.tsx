import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { eventService } from "@/service/api/event";
import { EventCard } from "./EventCard";

export const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      const response = await eventService.getAllEvents();
      setEvents(response);
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white">Chargement des événements...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-[#12171b]"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-4">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEventUpdate={loadEvents}
            />
          ))
        ) : (
          <Text className="text-white text-center mt-4">
            Aucun événement disponible
          </Text>
        )}
      </View>
    </ScrollView>
  );
};
