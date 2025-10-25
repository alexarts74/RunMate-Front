import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Event } from "@/interface/Event";

export const EventCard = ({
  event,
  onEventUpdate,
}: {
  event: Event;
  onEventUpdate: () => void;
}) => {
  return (
    <Pressable
      onPress={() => router.push(`/events/${event.id}`)}
      className="bg-[#1e2429] rounded-xl mb-8 overflow-hidden"
      android_ripple={{ color: "rgba(255, 255, 255, 0.1)" }} // Effet de ripple sur Android
    >
      {/* Cover Image */}
      <Image
        source={{
          uri: event.cover_image || "https://via.placeholder.com/400x200",
        }}
        className="w-full h-40"
        style={{ resizeMode: "cover" }}
      />

      {/* Content Container */}
      <View className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          {event.is_creator ? (
            <Text className="text-purple font-bold text-lg mb-2">Créateur</Text>
          ) : event.is_participant ? (
            <Text className="text-orange-400 font-bold text-lg mb-2">
              Participant
            </Text>
          ) : null}
        </View>
        <Text className="text-white font-bold text-lg mb-2">{event.name}</Text>

        <View className="flex-row items-center mb-2">
          <Ionicons name="calendar" size={16} color="#126C52" />
          <Text className="text-white ml-2">
            {new Date(event.start_date).toLocaleDateString()}
          </Text>
        </View>

        <Text className="text-white mb-3">
          {event.description
            ? event.description.slice(0, 100) + "..."
            : "Aucune description"}
        </Text>

        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Ionicons name="location" size={16} color="#126C52" />
            <Text className="text-white ml-2">{event.location}</Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Ionicons name="trending-up" size={16} color="#126C52" />
            <Text className="text-white ml-2">{event.distance} km</Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push(`/events/${event.id}`)}
          className="bg-purple py-2 rounded-lg"
          android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }} // Effet de ripple sur Android
        >
          <Text className="text-center text-white font-bold">
            Voir l'événement
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};
