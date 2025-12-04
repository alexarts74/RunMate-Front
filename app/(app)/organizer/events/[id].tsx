import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { eventService } from "@/service/api/event";
import { Event } from "@/interface/Event";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";

export default function OrganizerEventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEventDetails = async () => {
    try {
      console.log("🏢 [OrganizerEventDetails] Chargement de l'événement:", id);
      const data = await eventService.getEventById(id as string);
      console.log("🏢 [OrganizerEventDetails] Événement reçu:", data);
      setEvent(data);
    } catch (error) {
      console.error("🏢 [OrganizerEventDetails] Erreur:", error);
      Alert.alert("Erreur", "Impossible de charger les détails de l'événement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

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

  if (loading || !event) {
    return <LoadingScreen />;
  }

  // Vérifier que l'utilisateur est bien le créateur
  if (!event.is_creator) {
    return (
      <View className="flex-1 bg-fond items-center justify-center px-6">
        <Ionicons name="lock-closed" size={64} color="#FF6B4A" />
        <Text className="text-gray-900 font-nunito-bold text-xl mt-4 text-center">
          Accès restreint
        </Text>
        <Text className="text-gray-600 font-nunito-medium text-center mt-2">
          Vous n'êtes pas le créateur de cet événement.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-primary px-6 py-3 rounded-full mt-6"
        >
          <Text className="text-white font-nunito-bold">Retour</Text>
        </Pressable>
      </View>
    );
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
          {/* Titre */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <View className="bg-primary px-3 py-1 rounded-full">
                <Text className="text-white font-nunito-bold text-xs">Votre événement</Text>
              </View>
            </View>
            <Text className="text-gray-900 font-nunito-bold text-3xl mb-2">
              {event.name}
            </Text>
          </View>

          {/* Statistiques */}
          <View className="bg-white p-5 rounded-2xl mb-6"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center mr-3">
                <Ionicons name="stats-chart" size={20} color="#FF6B4A" />
              </View>
              <Text className="text-gray-900 font-nunito-bold text-lg">
                Statistiques
              </Text>
            </View>
            
            <View className="flex-row" style={{ gap: 12 }}>
              <View className="flex-1 bg-tertiary p-4 rounded-xl">
                <Text className="text-gray-600 font-nunito-medium text-xs mb-1">
                  Participants
                </Text>
                <Text className="text-gray-900 font-nunito-extrabold text-2xl">
                  {event.participants_count || 0}
                </Text>
                {event.max_participants && (
                  <Text className="text-gray-500 font-nunito-medium text-xs mt-1">
                    / {event.max_participants} max
                  </Text>
                )}
              </View>
              
              <View className="flex-1 bg-tertiary p-4 rounded-xl">
                <Text className="text-gray-600 font-nunito-medium text-xs mb-1">
                  Places restantes
                </Text>
                <Text className="text-gray-900 font-nunito-extrabold text-2xl">
                  {event.spots_left !== undefined ? event.spots_left : (event.max_participants ? event.max_participants - (event.participants_count || 0) : '∞')}
                </Text>
              </View>
            </View>
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
                {event.participants.map((participant) => (
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
              </View>
            </View>
          )}

          {/* Actions */}
          <View className="bg-white p-5 rounded-2xl mb-6"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Text className="text-gray-900 font-nunito-bold text-lg mb-4">
              Actions
            </Text>
            <View className="flex-row" style={{ gap: 12 }}>
              <Pressable
                onPress={() => {
                  Alert.alert("Modifier", "Fonctionnalité de modification à venir");
                }}
                className="flex-1 bg-white border-2 border-primary py-3 rounded-xl flex-row items-center justify-center"
              >
                <Ionicons name="create-outline" size={18} color="#FF6B4A" style={{ marginRight: 6 }} />
                <Text className="text-primary font-nunito-bold text-sm">
                  Modifier
                </Text>
              </Pressable>
              
              <Pressable
                onPress={() => {
                  Alert.alert(
                    "Supprimer l'événement",
                    "Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.",
                    [
                      { text: "Annuler", style: "cancel" },
                      {
                        text: "Supprimer",
                        style: "destructive",
                        onPress: () => {
                          Alert.alert("Info", "Fonctionnalité de suppression à venir");
                        },
                      },
                    ]
                  );
                }}
                className="flex-1 bg-white border-2 border-red-500 py-3 rounded-xl flex-row items-center justify-center"
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" style={{ marginRight: 6 }} />
                <Text className="text-red-500 font-nunito-bold text-sm">
                  Supprimer
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

