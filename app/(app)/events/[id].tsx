import React from "react";
import { View, Text, Image, ScrollView, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { eventService } from "@/service/api/event";
import { Event } from "@/interface/Event";

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = React.useState<Event | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchEventDetails = async () => {
    try {
      const data = await eventService.getEventById(id as string);
      setEvent(data);
    } catch (error) {
      console.error("Erreur lors du chargement de l'événement:", error);
      Alert.alert("Erreur", "Impossible de charger les détails de l'événement");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const handleEventAction = async () => {
    try {
      if (event && event.is_participant) {
        await eventService.leaveEvent(id as string);
        Alert.alert("Succès", "Vous avez quitté l'événement");
      } else {
        await eventService.joinEvent(id as string);
        Alert.alert("Succès", "Vous participez maintenant à cet événement !");
      }
      fetchEventDetails();
    } catch (error: any) {
      Alert.alert("Erreur", error.message);
    }
  };

  if (loading || !event) {
    return (
      <View className="flex-1 bg-[#12171b] justify-center items-center">
        <Text className="text-white">Chargement...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#12171b]">
      <ScrollView className="flex-1">
        <View className="flex-1">
          <View className="flex-1">
            <View className="absolute z-10 top-12 left-4">
              <Pressable
                onPress={() => router.back()}
                className="w-10 h-10 bg-[#12171b]/50 rounded-full items-center justify-center"
              >
                <Ionicons name="arrow-back" size={24} color="#b9f144" />
              </Pressable>
            </View>
            <Image
              source={{
                uri: event.cover_image || "https://via.placeholder.com/400x200",
              }}
              className="w-full h-60"
              style={{ resizeMode: "cover" }}
            />
          </View>

          <View className="p-4">
            <Text className="text-white font-bold text-2xl mb-4">
              {event.name}
            </Text>

            <View className="flex-row items-center mb-4">
              <Ionicons name="calendar" size={20} color="#b9f144" />
              <Text className="text-white ml-2 text-lg">
                {new Date(event.start_date).toLocaleDateString()}
              </Text>
            </View>

            <View className="flex-row items-center mb-4">
              <Ionicons name="location" size={20} color="#b9f144" />
              <Text className="text-white ml-2 text-lg">{event.location}</Text>
            </View>

            <View className="flex-row items-center mb-6">
              <Ionicons name="trending-up" size={20} color="#b9f144" />
              <Text className="text-white ml-2 text-lg">
                {event.distance} km
              </Text>
            </View>

            <Text className="text-white text-lg mb-2 font-bold">
              Description
            </Text>
            <Text className="text-white mb-6">{event.description}</Text>

            <View className="mb-6">
              <Text className="text-white text-lg mb-2 font-bold">
                Participants
              </Text>
              <View className="flex-row items-center">
                <View className="flex-row items-center">
                  {event.participants?.slice(0, 5).map((participant, index) => (
                    <View
                      key={participant.id}
                      style={{ marginLeft: index > 0 ? -12 : 0 }}
                      className="relative"
                    >
                      <View className="border-2 border-[#12171b] rounded-full">
                        <Image
                          source={{
                            uri:
                              participant.profile_image ||
                              "https://via.placeholder.com/40",
                          }}
                          className="w-10 h-10 rounded-full"
                        />
                      </View>
                      <View className="absolute -bottom-5 left-0 right-0">
                        <Text
                          className="text-white text-xs text-center"
                          numberOfLines={1}
                        >
                          {participant.name?.split(" ")[0]}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Compteur pour les participants supplémentaires */}
                {event.participants_count > 5 && (
                  <View className="ml-4">
                    <Text className="text-gray-400 text-sm">
                      +{event.participants_count - 5} autres
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bouton fixe en bas */}
      <View className="px-4 pb-8 pt-2 bg-[#12171b]">
        <Pressable
          onPress={handleEventAction}
          className={`py-3 w-[70%] mx-auto rounded-full ${
            event.is_participant ? "bg-red-500" : "bg-green"
          }`}
        >
          <Text className="text-center text-[#12171b] font-bold text-base">
            {event.is_participant ? "Quitter" : "Intéressé"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
