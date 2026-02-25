import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { eventService } from "@/service/api/event";
import { Event } from "@/interface/Event";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import { LinearGradient } from "expo-linear-gradient";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeColors } from "@/constants/theme";

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { colors, shadows, gradients } = useThemeColors();

  const fetchEventDetails = async () => {
    try {
      const data = await eventService.getEventById(id as string);
      setEvent(data);
    } catch (error) {
      console.error("Erreur lors du chargement de l'evenement:", error);
      Alert.alert("Erreur", "Impossible de charger les details de l'evenement");
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
        Alert.alert("Succes", "Vous avez quitte l'evenement");
      } else {
        await eventService.joinEvent(id as string);
        Alert.alert("Succes", "Vous participez maintenant a cet evenement !");
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

    now.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);

    const differenceInTime = event.getTime() - now.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

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
    <WarmBackground>
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
          <LinearGradient
            colors={gradients.imageOverlay as unknown as [string, string, ...string[]]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <SafeAreaView className="absolute inset-0" edges={['top']} style={{ position: 'absolute' }}>
            <View className="flex-row items-center pt-2 pl-4 z-10">
              <Pressable
                onPress={() => router.back()}
                className="w-11 h-11 rounded-full items-center justify-center"
                style={{
                  backgroundColor: colors.glass.heavy,
                  ...shadows.sm,
                }}
              >
                <Ionicons name="arrow-back" size={22} color={colors.primary.DEFAULT} />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        <View className="px-6 py-6">
          {/* Titre et badges */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              {event.is_creator && (
                <View
                  className="px-3 py-1 rounded-full mr-2"
                  style={{
                    backgroundColor: colors.primary.subtle,
                    borderWidth: 1,
                    borderColor: colors.primary.DEFAULT,
                  }}
                >
                  <Text className="font-nunito-bold text-xs" style={{ color: colors.primary.DEFAULT }}>Createur</Text>
                </View>
              )}
              {event.is_participant && !event.is_creator && (
                <View
                  className="px-3 py-1 rounded-full mr-2"
                  style={{
                    backgroundColor: colors.primary.subtle,
                    borderWidth: 1,
                    borderColor: colors.primary.light,
                  }}
                >
                  <Text className="font-nunito-bold text-xs" style={{ color: colors.primary.DEFAULT }}>Participant</Text>
                </View>
              )}
              {countdown.isExpired ? (
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'rgba(212,115,110,0.15)', borderWidth: 1, borderColor: colors.error }}
                >
                  <Text className="font-nunito-bold text-xs" style={{ color: colors.error }}>Termine</Text>
                </View>
              ) : (
                <View
                  className="px-3 py-1.5 rounded-full flex-row items-center"
                  style={{
                    backgroundColor: colors.primary.subtle,
                    borderWidth: 1,
                    borderColor: colors.primary.light,
                  }}
                >
                  <Ionicons name="time-outline" size={14} color={colors.text.secondary} style={{ marginRight: 4 }} />
                  <Text className="font-nunito-bold text-xs" style={{ color: colors.text.secondary }}>
                    {countdown.days}j {countdown.hours}h
                  </Text>
                </View>
              )}
            </View>
            <Text
              className="font-nunito-bold text-3xl mb-2"
              style={{ color: colors.text.primary }}
            >
              {event.name}
            </Text>
          </View>

          {/* Carte createur */}
          <GlassCard variant="medium" style={{ marginBottom: 24 }}>
            <View className="flex-row items-center">
              <Image
                source={{
                  uri:
                    event.creator.profile_image ||
                    "https://via.placeholder.com/40",
                }}
                className="w-14 h-14 rounded-full"
                style={{ borderWidth: 2, borderColor: colors.primary.DEFAULT }}
              />
              <View className="ml-4 flex-1">
                <Text
                  className="font-nunito-bold text-base"
                  style={{ color: colors.text.primary }}
                >
                  {event.creator.name}
                </Text>
                <Text className="font-nunito-medium text-sm" style={{ color: colors.primary.DEFAULT }}>Createur</Text>
              </View>
              {user?.id !== event.creator.id && (
                <GlassButton
                  title="Message"
                  onPress={() => router.push(`/chat/${event.creator.id}`)}
                  size="sm"
                />
              )}
            </View>
          </GlassCard>

          {/* Informations principales */}
          <GlassCard variant="medium" style={{ marginBottom: 24 }}>
            <View className="space-y-4">
              <View className="flex-row items-center">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: colors.primary.subtle }}
                >
                  <Ionicons name="calendar" size={20} color={colors.primary.DEFAULT} />
                </View>
                <View className="flex-1">
                  <Text
                    className="font-nunito-bold text-base"
                    style={{ color: colors.text.primary }}
                  >
                    {formatDate(event.start_date as string)}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="font-nunito-medium text-sm" style={{ color: colors.text.secondary }}>
                      {formatTime(event.start_time)}
                    </Text>
                    <Text className="mx-2" style={{ color: colors.text.tertiary }}>-</Text>
                    <Text className="font-nunito-medium text-sm" style={{ color: colors.text.secondary }}>
                      {formatTime(event.end_time)}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: colors.primary.subtle }}
                >
                  <Ionicons name="location" size={20} color={colors.text.secondary} />
                </View>
                <Text
                  className="font-nunito-medium text-base flex-1"
                  style={{ color: colors.text.primary }}
                >
                  {event.location}
                </Text>
              </View>

              <View className="flex-row items-center">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: colors.primary.subtle }}
                >
                  <Ionicons name="trending-up" size={20} color={colors.primary.DEFAULT} />
                </View>
                <Text
                  className="font-nunito-bold text-base"
                  style={{ color: colors.text.primary }}
                >
                  {event.distance} km
                </Text>
              </View>

              {event.participants_count !== undefined && (
                <View className="flex-row items-center">
                  <View
                    className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: colors.primary.subtle }}
                  >
                    <Ionicons name="people" size={20} color={colors.text.secondary} />
                  </View>
                  <View className="flex-1 flex-row items-center">
                    <Text
                      className="font-nunito-bold text-base mr-2"
                      style={{ color: colors.text.primary }}
                    >
                      {event.participants_count}
                    </Text>
                    <Text className="font-nunito-medium text-sm" style={{ color: colors.text.secondary }}>
                      participant{event.participants_count > 1 ? 's' : ''}
                    </Text>
                    {event.max_participants && (
                      <Text className="text-sm ml-1" style={{ color: colors.text.tertiary }}>
                        / {event.max_participants}
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>
          </GlassCard>

          {/* Description */}
          {event.description && (
            <GlassCard variant="light" style={{ marginBottom: 24 }}>
              <Text
                className="font-nunito-bold text-lg mb-3"
                style={{ color: colors.text.primary }}
              >
                Description
              </Text>
              <Text
                className="font-nunito-medium leading-6"
                style={{ color: colors.text.secondary }}
              >
                {event.description}
              </Text>
            </GlassCard>
          )}

          {/* Participants */}
          {event.participants && event.participants.length > 0 && (
            <GlassCard variant="light" style={{ marginBottom: 24 }}>
              <View className="flex-row items-center justify-between mb-4">
                <Text
                  className="font-nunito-bold text-lg"
                  style={{ color: colors.text.primary }}
                >
                  Participants ({event.participants_count})
                </Text>
                {event.is_creator && user?.user_type === "organizer" && (
                  <Pressable
                    onPress={() => {
                      Alert.alert("Gestion", "Fonctionnalite de gestion des participants a venir");
                    }}
                    className="flex-row items-center"
                  >
                    <Text className="font-nunito-bold text-sm mr-1" style={{ color: colors.primary.DEFAULT }}>
                      Gerer
                    </Text>
                    <Ionicons name="settings-outline" size={16} color={colors.primary.DEFAULT} />
                  </Pressable>
                )}
              </View>
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
                      className="w-12 h-12 rounded-full"
                      style={{ borderWidth: 2, borderColor: colors.glass.border }}
                    />
                    <Text
                      className="text-xs font-nunito-medium mt-1 text-center"
                      numberOfLines={1}
                      style={{ maxWidth: 60, color: colors.text.secondary }}
                    >
                      {participant.name?.split(" ")[0]}
                    </Text>
                  </View>
                ))}
                {event.participants_count > 8 && (
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-3 mb-3"
                    style={{
                      backgroundColor: colors.primary.subtle,
                      borderWidth: 2,
                      borderColor: colors.primary.light,
                    }}
                  >
                    <Text className="font-nunito-bold text-xs" style={{ color: colors.primary.DEFAULT }}>
                      +{event.participants_count - 8}
                    </Text>
                  </View>
                )}
              </View>
            </GlassCard>
          )}

          {/* Section Organisateur */}
          {event.is_creator && user?.user_type === "organizer" && (
            <GlassCard variant="medium" style={{ marginBottom: 24 }}>
              <View className="flex-row items-center mb-4">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: colors.primary.subtle }}
                >
                  <Ionicons name="stats-chart" size={20} color={colors.primary.DEFAULT} />
                </View>
                <Text
                  className="font-nunito-bold text-lg"
                  style={{ color: colors.text.primary }}
                >
                  Gestion de l'evenement
                </Text>
              </View>

              <View className="flex-row" style={{ gap: 12 }}>
                <View
                  className="flex-1 p-4 rounded-xl"
                  style={{ backgroundColor: colors.glass.light }}
                >
                  <Text className="font-nunito-medium text-xs mb-1" style={{ color: colors.text.secondary }}>
                    Participants
                  </Text>
                  <Text className="font-nunito-extrabold text-2xl" style={{ color: colors.text.primary }}>
                    {event.participants_count || 0}
                  </Text>
                  {event.max_participants && (
                    <Text className="font-nunito-medium text-xs mt-1" style={{ color: colors.text.tertiary }}>
                      / {event.max_participants} max
                    </Text>
                  )}
                </View>

                <View
                  className="flex-1 p-4 rounded-xl"
                  style={{ backgroundColor: colors.glass.light }}
                >
                  <Text className="font-nunito-medium text-xs mb-1" style={{ color: colors.text.secondary }}>
                    Places restantes
                  </Text>
                  <Text className="font-nunito-extrabold text-2xl" style={{ color: colors.text.primary }}>
                    {event.spots_left !== undefined ? event.spots_left : (event.max_participants ? event.max_participants - (event.participants_count || 0) : '...')}
                  </Text>
                </View>
              </View>

              <View className="mt-4 flex-row" style={{ gap: 12 }}>
                <GlassButton
                  title="Modifier"
                  variant="secondary"
                  size="sm"
                  icon={<Ionicons name="create-outline" size={18} color={colors.primary.DEFAULT} />}
                  onPress={() => {
                    Alert.alert("Modifier", "Fonctionnalite de modification a venir");
                  }}
                  style={{ flex: 1 }}
                />

                <Pressable
                  onPress={() => {
                    Alert.alert(
                      "Supprimer l'evenement",
                      "Etes-vous sur de vouloir supprimer cet evenement ? Cette action est irreversible.",
                      [
                        { text: "Annuler", style: "cancel" },
                        {
                          text: "Supprimer",
                          style: "destructive",
                          onPress: () => {
                            Alert.alert("Info", "Fonctionnalite de suppression a venir");
                          },
                        },
                      ]
                    );
                  }}
                  className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                  style={{
                    backgroundColor: colors.elevated,
                    borderWidth: 2,
                    borderColor: colors.error,
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.error} style={{ marginRight: 6 }} />
                  <Text className="font-nunito-bold text-sm" style={{ color: colors.error }}>
                    Supprimer
                  </Text>
                </Pressable>
              </View>
            </GlassCard>
          )}
        </View>
      </ScrollView>

      {/* Footer avec bouton d'action */}
      {!(event.is_creator && user?.user_type === "organizer") && (
        <View
          className="px-6 pb-6 pt-4"
          style={{
            backgroundColor: colors.glass.heavy,
            borderTopWidth: 1,
            borderTopColor: colors.glass.border,
          }}
        >
          <Pressable
            onPress={handleEventAction}
            className="py-4 rounded-full flex-row items-center justify-center"
            style={{
              backgroundColor: event.is_participant ? colors.error : colors.primary.DEFAULT,
              ...shadows.md,
            }}
          >
            <Ionicons
              name={event.is_participant ? "exit-outline" : "checkmark-circle"}
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-center text-white font-nunito-bold text-base">
              {event.is_participant ? "Quitter l'evenement" : "Participer"}
            </Text>
          </Pressable>
        </View>
      )}
    </WarmBackground>
  );
}
