import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <View className="flex-1 bg-fond">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image de couverture avec header */}
        <View className="relative h-64">
          <Image
            source={{
              uri: event.cover_image || "https://via.placeholder.com/400x200",
            }}
            className="w-full h-full"
            style={{ resizeMode: "cover" }}
          />
          {/* Overlay gradient */}
          <View className="absolute inset-0 bg-black/30" />
          <SafeAreaView className="absolute inset-0" edges={['top']} style={{ position: 'absolute' }}>
            <View className="flex-row items-center pt-2 pl-4 z-10">
              <Pressable
                onPress={() => router.back()}
                className="w-11 h-11 bg-white/90 rounded-full items-center justify-center"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Ionicons name="arrow-back" size={22} color="#FF6B4A" />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        <View className="px-6 py-6 bg-fond">
          {/* Titre et badges */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              {event.is_creator && (
                <View className="bg-tertiary border border-primary px-3 py-1 rounded-full mr-2">
                  <Text className="text-primary font-nunito-bold text-xs">Créateur</Text>
                </View>
              )}
              {event.is_participant && !event.is_creator && (
                <View className="bg-tertiary border border-secondary px-3 py-1 rounded-full mr-2">
                  <Text className="text-secondary font-nunito-bold text-xs">Participant</Text>
                </View>
              )}
              {countdown.isExpired ? (
                <View className="bg-red-100 border border-red-300 px-3 py-1 rounded-full">
                  <Text className="text-red-600 font-nunito-bold text-xs">Terminé</Text>
                </View>
              ) : (
                <View className="bg-tertiary border border-secondary px-3 py-1.5 rounded-full flex-row items-center">
                  <Ionicons name="time-outline" size={14} color="#A78BFA" style={{ marginRight: 4 }} />
                  <Text className="text-secondary font-nunito-bold text-xs">
                    {countdown.days}j {countdown.hours}h
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-gray-900 font-nunito-bold text-3xl mb-2">
              {event.name}
            </Text>
          </View>

          {/* Carte créateur */}
          <View className="bg-white p-4 rounded-2xl mb-6 flex-row items-center"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Image
              source={{
                uri:
                  event.creator.profile_image ||
                  "https://via.placeholder.com/40",
              }}
              className="w-14 h-14 rounded-full border-2 border-primary"
            />
            <View className="ml-4 flex-1">
              <Text className="text-gray-900 font-nunito-bold text-base">
                {event.creator.name}
              </Text>
              <Text className="text-primary font-nunito-medium text-sm">Créateur</Text>
            </View>
            {user?.id !== event.creator.id && (
              <Pressable
                onPress={() => router.push(`/chat/${event.creator.id}`)}
                className="bg-primary px-4 py-2.5 rounded-full"
                style={{
                  shadowColor: "#FF6B4A",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text className="text-white font-nunito-bold text-sm">Message</Text>
              </Pressable>
            )}
          </View>

          {/* Informations principales */}
          <View className="bg-white p-5 rounded-2xl mb-6"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="space-y-4">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center mr-4">
                  <Ionicons name="calendar" size={20} color="#FF6B4A" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-nunito-bold text-base">
                    {formatDate(event.start_date as string)}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-gray-600 font-nunito-medium text-sm">
                      {formatTime(event.start_time)}
                    </Text>
                    <Text className="text-gray-400 mx-2">-</Text>
                    <Text className="text-gray-600 font-nunito-medium text-sm">
                      {formatTime(event.end_time)}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center mr-4">
                  <Ionicons name="location" size={20} color="#A78BFA" />
                </View>
                <Text className="text-gray-900 font-nunito-medium text-base flex-1">{event.location}</Text>
              </View>

              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center mr-4">
                  <Ionicons name="trending-up" size={20} color="#FF6B4A" />
                </View>
                <Text className="text-gray-900 font-nunito-bold text-base">
                  {event.distance} km
                </Text>
              </View>

              {event.participants_count !== undefined && (
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-xl bg-tertiary items-center justify-center mr-4">
                    <Ionicons name="people" size={20} color="#A78BFA" />
                  </View>
                  <View className="flex-1 flex-row items-center">
                    <Text className="text-gray-900 font-nunito-bold text-base mr-2">
                      {event.participants_count}
                    </Text>
                    <Text className="text-gray-600 font-nunito-medium text-sm">
                      participant{event.participants_count > 1 ? 's' : ''}
                    </Text>
                    {event.max_participants && (
                      <Text className="text-gray-400 text-sm ml-1">
                        / {event.max_participants}
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Description */}
          {event.description && (
            <View className="bg-white p-5 rounded-2xl mb-6"
              style={{
                shadowColor: "#A78BFA",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text className="text-gray-900 font-nunito-bold text-lg mb-3">
                Description
              </Text>
              <Text className="text-gray-600 font-nunito-medium leading-6">{event.description}</Text>
            </View>
          )}

          {/* Participants */}
          {event.participants && event.participants.length > 0 && (
            <View className="bg-white p-5 rounded-2xl mb-6"
              style={{
                shadowColor: "#A78BFA",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text className="text-gray-900 font-nunito-bold text-lg mb-4">
                Participants ({event.participants_count})
              </Text>
              <View className="flex-row items-center flex-wrap">
                {event.participants.slice(0, 8).map((participant, index) => (
                  <View
                    key={participant.id}
                    className="mr-3 mb-3 items-center"
                  >
                    <Image
                      source={{
                        uri:
                          participant.profile_image ||
                          "https://via.placeholder.com/40",
                      }}
                      className="w-12 h-12 rounded-full border-2 border-tertiary"
                    />
                    <Text
                      className="text-gray-600 text-xs font-nunito-medium mt-1 text-center"
                      numberOfLines={1}
                      style={{ maxWidth: 60 }}
                    >
                      {participant.name?.split(" ")[0]}
                    </Text>
                  </View>
                ))}
                {event.participants_count > 8 && (
                  <View className="w-12 h-12 rounded-full bg-tertiary border-2 border-secondary items-center justify-center mr-3 mb-3">
                    <Text className="text-secondary font-nunito-bold text-xs">
                      +{event.participants_count - 8}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer avec bouton d'action */}
      <View className="px-6 pb-6 pt-4 bg-fond border-t border-gray-200">
        <Pressable
          onPress={handleEventAction}
          className={`py-4 rounded-full flex-row items-center justify-center ${
            event.is_participant ? "bg-red-500" : "bg-primary"
          }`}
          style={{
            shadowColor: event.is_participant ? "#EF4444" : "#FF6B4A",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Ionicons 
            name={event.is_participant ? "exit-outline" : "checkmark-circle"} 
            size={20} 
            color="white" 
            style={{ marginRight: 8 }} 
          />
          <Text className="text-center text-white font-nunito-bold text-base">
            {event.is_participant ? "Quitter l'événement" : "Participer"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
