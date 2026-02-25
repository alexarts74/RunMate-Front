import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { eventService } from "@/service/api/event";
import { Event } from "@/interface/Event";
import { useAuth } from "@/context/AuthContext";
import LoadingScreen from "@/components/LoadingScreen";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeColors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";

export default function OrganizerEventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { colors, shadows, gradients } = useThemeColors();

  const fetchEventDetails = async () => {
    try {
      console.log("[OrganizerEventDetails] Chargement de l'evenement:", id);
      const data = await eventService.getEventById(id as string);
      console.log("[OrganizerEventDetails] Evenement recu:", data);
      setEvent(data);
    } catch (error) {
      console.error("[OrganizerEventDetails] Erreur:", error);
      Alert.alert("Erreur", "Impossible de charger les details de l'evenement");
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

  // Verifier que l'utilisateur est bien le createur
  if (!event.is_creator) {
    return (
      <WarmBackground>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="lock-closed" size={64} color={colors.primary.DEFAULT} />
          <Text
            className="font-nunito-bold text-xl mt-4 text-center"
            style={{ color: colors.text.primary }}
          >
            Acces restreint
          </Text>
          <Text
            className="font-nunito-medium text-center mt-2"
            style={{ color: colors.text.secondary }}
          >
            Vous n'etes pas le createur de cet evenement.
          </Text>
          <GlassButton
            title="Retour"
            onPress={() => router.back()}
            style={{ marginTop: 24 }}
          />
        </View>
      </WarmBackground>
    );
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
          {/* Titre */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: colors.primary.DEFAULT }}
              >
                <Text className="text-white font-nunito-bold text-xs">Votre evenement</Text>
              </View>
            </View>
            <Text
              className="font-nunito-bold text-3xl mb-2"
              style={{ color: colors.text.primary }}
            >
              {event.name}
            </Text>
          </View>

          {/* Statistiques */}
          <GlassCard variant="medium" style={{ marginBottom: 24 }}>
            <View className="flex-row items-center mb-4">
              <View
                className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                style={{ backgroundColor: colors.primary.subtle }}
              >
                <Ionicons name="stats-chart" size={20} color={colors.primary.DEFAULT} />
              </View>
              <Text className="font-nunito-bold text-lg" style={{ color: colors.text.primary }}>
                Statistiques
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
                  <Text className="font-nunito-bold text-base" style={{ color: colors.text.primary }}>
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
                <Text className="font-nunito-medium text-base flex-1" style={{ color: colors.text.primary }}>
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
                <Text className="font-nunito-bold text-base" style={{ color: colors.text.primary }}>
                  {event.distance} km
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Description */}
          {event.description && (
            <GlassCard variant="light" style={{ marginBottom: 24 }}>
              <Text className="font-nunito-bold text-lg mb-3" style={{ color: colors.text.primary }}>
                Description
              </Text>
              <Text className="font-nunito-medium leading-6" style={{ color: colors.text.secondary }}>
                {event.description}
              </Text>
            </GlassCard>
          )}

          {/* Participants */}
          {event.participants && event.participants.length > 0 && (
            <GlassCard variant="light" style={{ marginBottom: 24 }}>
              <Text className="font-nunito-bold text-lg mb-4" style={{ color: colors.text.primary }}>
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
              </View>
            </GlassCard>
          )}

          {/* Actions */}
          <GlassCard variant="medium" style={{ marginBottom: 24 }}>
            <Text className="font-nunito-bold text-lg mb-4" style={{ color: colors.text.primary }}>
              Actions
            </Text>
            <View className="flex-row" style={{ gap: 12 }}>
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
        </View>
      </ScrollView>
    </WarmBackground>
  );
}
