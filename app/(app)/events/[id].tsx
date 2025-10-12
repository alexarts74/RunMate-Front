import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { eventService } from "@/service/api/event";
import { Event } from "@/interface/Event";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  useEffect(() => {
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const getTimeUntilEvent = (eventDate: string) => {
    if (!eventDate) {
      return { days: 0, hours: 0, isExpired: true };
    }

    const now = new Date();
    const event = new Date(eventDate);

    // Réinitialiser les heures pour avoir un calcul précis des jours
    now.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);

    // Calculer la différence en jours
    const differenceInTime = event.getTime() - now.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    // Pour les heures, utiliser la date originale
    const currentTime = new Date();
    const eventTime = new Date(eventDate);
    const differenceForTime = eventTime.getTime() - currentTime.getTime();

    if (differenceInTime <= 0) {
      return { days: 0, hours: 0, isExpired: true };
    }

    const hours = Math.floor((differenceForTime / (1000 * 60 * 60)) % 24);

    return {
      days: differenceInDays,
      hours,
      isExpired: false,
    };
  };

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    isExpired: true,
  });

  useEffect(() => {
    if (event?.start_date) {
      setCountdown(getTimeUntilEvent(event.start_date as string));
    }
  }, [event]);

  useEffect(() => {
    if (!event?.start_date) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown(getTimeUntilEvent(event.start_date as string));
    }, 3600000);

    return () => clearInterval(timer);
  }, [event]);

  if (loading || !event) {
    return <LoadingScreen />;
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="relative h-72">
          <Image
            source={{
              uri: event.cover_image || "https://via.placeholder.com/400x200",
            }}
            className="w-full h-full"
            style={{ resizeMode: "cover" }}
          />
          <View className="absolute z-10 top-12 left-4">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 bg-background/50 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="#401346" />
            </Pressable>
          </View>
        </View>

        <View className="p-6">
          <Text className="text-white font-bold text-3xl mb-2">
            {event.name}
          </Text>

          {countdown.isExpired ? (
            <Text className="text-red-500 text-sm mb-4">Événement terminé</Text>
          ) : (
            <View className="flex-row items-center space-x-1 space-y-2 mb-4">
              <View className="items-center mt-2.5 mr-2">
                <Ionicons name="time-outline" size={20} color="#401346" />
              </View>

              <View className="items-center">
                <Text className="text-white text-sm">{countdown.days}j</Text>
              </View>
              <Text className="text-purple">:</Text>
              <View className="items-center">
                <Text className="text-white text-sm">{countdown.hours}h</Text>
              </View>
            </View>
          )}

          <View className="flex-row items-center mb-8 bg-background p-4 rounded-2xl">
            <Image
              source={{
                uri:
                  event.creator.profile_image ||
                  "https://via.placeholder.com/40",
              }}
              className="w-14 h-14 rounded-full border-2 border-purple"
            />
            <View className="ml-4 flex-1">
              <Text className="text-white font-semibold text-lg">
                {event.creator.name}
              </Text>
              <Text className="text-purple">Créateur</Text>
            </View>
            {user?.id !== event.creator.id && (
              <Pressable
                onPress={() => router.push(`/chat/${event.creator.id}`)}
                className="bg-purple px-4 py-2 rounded-full"
              >
                <Text className="text-white font-semibold">Message</Text>
              </Pressable>
            )}
          </View>

          <View className="space-y-6 mb-8">
            <View className="flex-row items-center ">
              <View className="w-10 h-10 bg-background rounded-full items-center justify-center">
                <Ionicons name="calendar" size={20} color="#401346" />
              </View>
              <View className="ml-4">
                <Text className="text-white text-lg">
                  {formatDate(event.start_date as string)}
                </Text>
                <View className="flex-row items-center space-x-2 mt-1">
                  <Text className="text-white text-sm">
                    {formatTime(event.start_time)}
                  </Text>
                  <Text className="text-purple">-</Text>
                  <Text className="text-white text-sm">
                    {formatTime(event.end_time)}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-background rounded-full items-center justify-center">
                <Ionicons name="location" size={20} color="#401346" />
              </View>
              <Text className="text-white ml-4 text-lg">{event.location}</Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-background rounded-full items-center justify-center">
                <Ionicons name="trending-up" size={20} color="#401346" />
              </View>
              <Text className="text-white ml-4 text-lg">
                {event.distance} km
              </Text>
            </View>
          </View>

          <View className="bg-background p-4 rounded-2xl mb-8">
            <Text className="text-white text-lg font-bold mb-2">
              Description
            </Text>
            <Text className="text-white leading-6">{event.description}</Text>
          </View>

          <View className="mb-8">
            <Text className="text-white text-lg font-bold mb-4">
              Participants ({event.participants_count})
            </Text>
            <View className="flex-row items-center">
              <View className="flex-row items-center">
                {event.participants?.slice(0, 5).map((participant, index) => (
                  <View
                    key={participant.id}
                    // style={{ marginLeft: index > 0 ? -12 : 0 }}
                    className="relative"
                  >
                    <View className="border-2 border-background rounded-full">
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
                  <Text className="text-white text-sm">
                    +{event.participants_count - 5}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="px-6 pb-8 pt-4 bg-background">
        <Pressable
          onPress={handleEventAction}
          className={`py-4 rounded-full ${
            event.is_participant ? "bg-red-500" : "bg-purple"
          }`}
        >
          <Text className="text-center text-white font-bold text-base">
            {event.is_participant ? "Quitter" : "Participer"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
