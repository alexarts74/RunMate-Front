import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { eventService } from "@/service/api/event";

export const EventCard = ({ event, onEventUpdate }) => {
  const handleJoinEvent = async () => {
    try {
      await eventService.joinEvent(event.id);
      Alert.alert("Succès", "Vous participez maintenant à cet événement !");
      onEventUpdate();
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View className="bg-[#1e2429] p-4 rounded-xl mb-3">
      <Text className="text-white font-bold text-lg mb-2">{event.title}</Text>

      <View className="flex-row items-center mb-2">
        <Ionicons name="calendar" size={16} color="#b9f144" />
        <Text className="text-white ml-2">
          {new Date(event.date).toLocaleDateString()}
        </Text>
      </View>

      <Text className="text-white mb-3">{event.description}</Text>

      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <Ionicons name="location" size={16} color="#b9f144" />
          <Text className="text-white ml-2">{event.meeting_point}</Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center">
          <Ionicons name="speedometer" size={16} color="#b9f144" />
          <Text className="text-white ml-2">{event.pace} min/km</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="trending-up" size={16} color="#b9f144" />
          <Text className="text-white ml-2">{event.distance} km</Text>
        </View>
      </View>

      <Pressable onPress={handleJoinEvent} className="bg-green py-2 rounded-lg">
        <Text className="text-center text-[#12171b] font-bold">Participer</Text>
      </Pressable>
    </View>
  );
};
