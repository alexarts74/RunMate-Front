import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Event } from "@/interface/Event";

const ACCENT = "#F97316";

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
      className="bg-white rounded-2xl mb-6 overflow-hidden"
      style={{
        shadowColor: ACCENT,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      }}
      android_ripple={{ color: "rgba(249, 115, 22, 0.1)" }}
    >
      {/* Cover Image */}
      <Image
        source={{
          uri: event.cover_image || "https://via.placeholder.com/400x200",
        }}
        className="w-full h-48"
        style={{ resizeMode: "cover" }}
      />

      {/* Content Container */}
      <View className="p-5">
        <View className="flex-row justify-between items-center mb-3">
          {event.is_creator ? (
            <View className="bg-tertiary border border-primary px-3 py-1 rounded-full">
              <Text className="text-primary font-nunito-bold text-sm">Créateur</Text>
            </View>
          ) : event.is_participant ? (
            <View className="bg-tertiary border border-secondary px-3 py-1 rounded-full">
              <Text className="text-secondary font-nunito-bold text-sm">
              Participant
            </Text>
            </View>
          ) : null}
        </View>
        <Text className="text-gray-900 font-nunito-extrabold text-xl mb-4">{event.name}</Text>

        <View className="space-y-3 mb-4">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-tertiary items-center justify-center mr-3">
              <Ionicons name="calendar" size={16} color={ACCENT} />
            </View>
            <Text className="text-gray-700 font-nunito-medium">
            {new Date(event.start_date).toLocaleDateString()}
          </Text>
        </View>

          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-tertiary items-center justify-center mr-3">
              <Ionicons name="location" size={16} color="#525252" />
            </View>
            <Text className="text-gray-700 font-nunito-medium">{event.location}</Text>
        </View>

          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-tertiary items-center justify-center mr-3">
              <Ionicons name="trending-up" size={16} color={ACCENT} />
            </View>
            <Text className="text-gray-700 font-nunito-medium">{event.distance} km</Text>
          </View>
        </View>

        {event.description && (
          <Text className="text-gray-600 mb-4 font-nunito-medium text-sm">
            {event.description.slice(0, 100)}
            {event.description.length > 100 ? "..." : ""}
          </Text>
        )}

        <Pressable
          onPress={() => router.push(`/events/${event.id}`)}
          className="bg-primary py-3 rounded-xl"
          style={{
            shadowColor: ACCENT,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 3,
          }}
          android_ripple={{ color: "rgba(255, 255, 255, 0.2)" }}
        >
          <Text className="text-center text-white font-nunito-bold">
            Voir l'événement
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};
