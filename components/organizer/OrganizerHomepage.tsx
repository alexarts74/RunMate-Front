import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { eventService } from "@/service/api/event";
import { groupService } from "@/service/api/group";
import { organizerProfileService } from "@/service/api/organizerProfile";
import { Event } from "@/interface/Event";
import { GroupInfo } from "@/interface/Group";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassCard from "@/components/ui/GlassCard";
import { useThemeColors, palette } from "@/constants/theme";

export function OrganizerHomepage() {
  const { user } = useAuth();
  const { unreadCount } = useUnreadMessages();
  const { colors, shadows, gradients } = useThemeColors();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [myGroups, setMyGroups] = useState<GroupInfo[]>([]);
  const [organizationName, setOrganizationName] = useState<string>("Votre organisation");
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalGroups: 0,
    totalParticipants: 0,
    upcomingEvents: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données au montage initial
  useEffect(() => {
    loadData();
  }, []);

  // Recharger les données quand l'écran revient au focus (après création d'un groupe/événement)
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadOrganizerProfile = async () => {
    try {
      console.log("🏢 [OrganizerHomepage] Chargement du profil organisateur...");
      const profile = await organizerProfileService.getProfile();
      console.log("🏢 [OrganizerHomepage] Profil organisateur reçu:", profile);
      if (profile?.organization_name) {
        setOrganizationName(profile.organization_name);
      }
    } catch (error) {
      console.log("🏢 [OrganizerHomepage] Profil organisateur non trouvé ou erreur:", error);
      // Le profil peut ne pas exister encore, ce n'est pas grave
    }
  };

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Charger le profil organisateur pour obtenir le nom
      await loadOrganizerProfile();

      // Charger les événements créés
      console.log("🏢 [OrganizerHomepage] Chargement des événements...");
      const eventsResponse = await eventService.getMyEvents();
      console.log("🏢 [OrganizerHomepage] Réponse complète getMyEvents:", JSON.stringify(eventsResponse, null, 2));
      const createdEvents = eventsResponse.created || [];
      console.log("🏢 [OrganizerHomepage] Événements créés:", createdEvents.length, createdEvents);
      setMyEvents(createdEvents);

      // Charger les groupes
      const groupsData = await groupService.getGroups();

      const myCreatedGroups = groupsData.filter((g: GroupInfo) => g.is_admin);
      setMyGroups(myCreatedGroups);

      // Calculer les statistiques
      const totalParticipants = createdEvents.reduce(
        (sum, event) => sum + (event.participants_count || 0),
        0
      );
      const upcomingEvents = createdEvents.filter(
        (event) => new Date(event.start_date) > new Date()
      ).length;

      setStats({
        totalEvents: createdEvents.length,
        totalGroups: myCreatedGroups.length,
        totalParticipants,
        upcomingEvents,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("fr-FR", options);
  };

  return (
    <WarmBackground>
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Header */}
          <View className="px-6 pt-4 pb-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="business" size={20} color={colors.primary.DEFAULT} style={{ marginRight: 8 }} />
                  <Text style={{ color: colors.text.secondary }} className="font-nunito-medium text-sm">
                    Bienvenue
                  </Text>
                </View>
                <Text
                  style={{ color: colors.text.primary }}
                  className="font-nunito-extrabold text-2xl"
                  numberOfLines={2}
                >
                  {organizationName}
                </Text>
              </View>

              <View className="flex-row items-center" style={{ gap: 12 }}>
                <Pressable
                  onPress={() => router.push("/messages")}
                  className="relative"
                >
                  <Ionicons name="notifications-outline" size={24} color={colors.primary.DEFAULT} />
                  {unreadCount > 0 && (
                    <View
                      className="absolute -top-1 -right-1 rounded-full w-5 h-5 items-center justify-center border-2"
                      style={{ backgroundColor: colors.primary.DEFAULT, borderColor: colors.background }}
                    >
                      <Text className="text-white font-nunito-bold text-xs">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Text>
                    </View>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => router.push("/(tabs)/profile")}
                  className="w-10 h-10 rounded-full overflow-hidden border-2"
                  style={{ borderColor: colors.primary.DEFAULT }}
                >
                  <Image
                    source={
                      user?.profile_image
                        ? { uri: user.profile_image }
                        : require("@/assets/images/react-logo.png")
                    }
                    className="w-full h-full"
                    style={{ resizeMode: "cover" }}
                  />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Statistiques */}
          <View className="px-6 mb-6">
            <Text style={{ color: colors.text.primary }} className="font-nunito-extrabold text-xl mb-4">
              Statistiques
            </Text>
            <View style={{ gap: 12 }}>
              <Pressable
                onPress={() => router.push("/(app)/organizer/events/all")}
                className="active:opacity-90"
              >
                <GlassCard>
                  <View className="flex-row items-center">
                    <View
                      className="w-14 h-14 rounded-xl items-center justify-center mr-4"
                      style={{ backgroundColor: palette.primary.subtle }}
                    >
                      <Ionicons name="calendar" size={28} color={colors.primary.DEFAULT} />
                    </View>
                    <View className="flex-1">
                      <Text style={{ color: colors.text.secondary }} className="font-nunito-medium text-sm mb-1">
                        Événements
                      </Text>
                      <Text style={{ color: colors.text.primary }} className="font-nunito-extrabold text-3xl mb-1">
                        {stats.totalEvents}
                      </Text>
                      {stats.upcomingEvents > 0 && (
                        <Text style={{ color: colors.primary.DEFAULT }} className="font-nunito-medium text-xs">
                          {stats.upcomingEvents} à venir
                        </Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
                  </View>
                </GlassCard>
              </Pressable>

              <Pressable
                onPress={() => router.push("/(app)/groups/all")}
                className="active:opacity-90"
              >
                <GlassCard>
                  <View className="flex-row items-center">
                    <View
                      className="w-14 h-14 rounded-xl items-center justify-center mr-4"
                      style={{ backgroundColor: colors.surface }}
                    >
                      <Ionicons name="people" size={28} color={colors.text.secondary} />
                    </View>
                    <View className="flex-1">
                      <Text style={{ color: colors.text.secondary }} className="font-nunito-medium text-sm mb-1">
                        Groupes
                      </Text>
                      <Text style={{ color: colors.text.primary }} className="font-nunito-extrabold text-3xl">
                        {stats.totalGroups}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
                  </View>
                </GlassCard>
              </Pressable>

              <GlassCard>
                <View className="flex-row items-center">
                  <View
                    className="w-14 h-14 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: 'rgba(124, 184, 138, 0.15)' }}
                  >
                    <Ionicons name="person-add" size={28} color={colors.success} />
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: colors.text.secondary }} className="font-nunito-medium text-sm mb-1">
                      Participants
                    </Text>
                    <Text style={{ color: colors.text.primary }} className="font-nunito-extrabold text-3xl">
                      {stats.totalParticipants}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </View>
          </View>

          {/* Actions rapides */}
          <View className="px-6 mb-6">
            <Text style={{ color: colors.text.primary }} className="font-nunito-extrabold text-xl mb-4">
              Actions rapides
            </Text>
            <View className="flex-row" style={{ gap: 12 }}>
              {/* Carte Créer un événement */}
              <Pressable
                onPress={() => router.push("/(app)/events/create")}
                className="flex-1"
              >
                <GlassCard>
                  <View>
                    <LinearGradient
                      colors={gradients.primaryButton as unknown as [string, string, ...string[]]}
                      className="w-12 h-12 rounded-xl items-center justify-center mb-4"
                    >
                      <Ionicons name="calendar-outline" size={24} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={{ color: colors.text.primary }} className="font-nunito-extrabold text-lg mb-1">
                      Créer un événement
                    </Text>
                    <Text style={{ color: colors.text.secondary }} className="font-nunito-medium text-xs">
                      Organiser une course
                    </Text>
                  </View>
                  <View className="flex-row justify-end mt-4">
                    <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
                  </View>
                </GlassCard>
              </Pressable>

              {/* Carte Créer un groupe */}
              <Pressable
                onPress={() => router.push("/(app)/groups/create")}
                className="flex-1"
              >
                <GlassCard>
                  <View>
                    <LinearGradient
                      colors={[colors.text.secondary, colors.text.tertiary] as [string, string]}
                      className="w-12 h-12 rounded-xl items-center justify-center mb-4"
                    >
                      <Ionicons name="people-outline" size={24} color="#FFFFFF" />
                    </LinearGradient>
                    <Text style={{ color: colors.text.primary }} className="font-nunito-extrabold text-lg mb-1">
                      Créer un groupe
                    </Text>
                    <Text style={{ color: colors.text.secondary }} className="font-nunito-medium text-xs">
                      Nouveau groupe
                    </Text>
                  </View>
                  <View className="flex-row justify-end mt-4">
                    <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
                  </View>
                </GlassCard>
              </Pressable>
            </View>
          </View>

          {/* Événements récents */}
          {myEvents.length > 0 && (
            <View className="px-6 mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text style={{ color: colors.text.primary }} className="font-nunito-extrabold text-xl">
                  Mes événements
                </Text>
                <Pressable onPress={() => router.push("/(app)/organizer/events/all")}>
                  <Text style={{ color: colors.primary.DEFAULT }} className="font-nunito-bold text-sm">
                    Voir tout
                  </Text>
                </Pressable>
              </View>

              <View style={{ gap: 12 }}>
                {myEvents.slice(0, 3).map((event, index) => (
                  <Pressable
                    key={event.id || `event-${index}`}
                    onPress={() => router.push(`/(app)/organizer/events/${String(event.id)}`)}
                  >
                    <GlassCard noPadding>
                      <View className="flex-row">
                        {event.cover_image && (
                          <Image
                            source={{ uri: event.cover_image }}
                            className="w-24 h-24"
                            style={{ resizeMode: "cover" }}
                          />
                        )}
                        <View className="flex-1 p-4">
                          <Text style={{ color: colors.text.primary }} className="font-nunito-bold text-base mb-1">
                            {event.name}
                          </Text>
                          <View className="flex-row items-center mb-2" style={{ gap: 8 }}>
                            <Ionicons name="calendar-outline" size={14} color={colors.text.tertiary} />
                            <Text style={{ color: colors.text.secondary }} className="font-nunito-medium text-xs">
                              {formatDate(event.start_date)}
                            </Text>
                            <Ionicons name="location-outline" size={14} color={colors.text.tertiary} style={{ marginLeft: 8 }} />
                            <Text style={{ color: colors.text.secondary }} className="font-nunito-medium text-xs">
                              {event.location}
                            </Text>
                          </View>
                          <View className="flex-row items-center" style={{ gap: 12 }}>
                            <View className="flex-row items-center">
                              <Ionicons name="people-outline" size={14} color={colors.success} />
                              <Text style={{ color: colors.text.secondary }} className="font-nunito-medium text-xs ml-1">
                                {event.participants_count || 0} participants
                              </Text>
                            </View>
                            {event.spots_left !== undefined && (
                              <View className="flex-row items-center">
                                <Ionicons name="time-outline" size={14} color={colors.warning} />
                                <Text style={{ color: colors.text.secondary }} className="font-nunito-medium text-xs ml-1">
                                  {event.spots_left} places restantes
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </GlassCard>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Groupes récents */}
          {myGroups.length > 0 && (
            <View className="px-6 mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text style={{ color: colors.text.primary }} className="font-nunito-extrabold text-xl">
                  Mes groupes
                </Text>
                <Pressable onPress={() => router.push("/(app)/groups/all")}>
                  <Text style={{ color: colors.primary.DEFAULT }} className="font-nunito-bold text-sm">
                    Voir tout
                  </Text>
                </Pressable>
              </View>

              <View style={{ gap: 12 }}>
                {myGroups.slice(0, 3).map((group, index) => {
                  // Sanitize group data to prevent string leakage
                  const groupName = String(group.name || '');
                  const groupDesc = group.description && typeof group.description === 'string'
                    ? group.description.trim()
                    : '';
                  const membersCount = Number(group.members_count) || 0;
                  const pendingCount = Number(group.pending_requests_count) || 0;
                  const coverImage = group.cover_image ? String(group.cover_image) : null;
                  const groupId = group.id;

                  return (
                    <Pressable
                      key={groupId || `group-${index}`}
                      onPress={() => router.push(`/(app)/organizer/groups/${String(groupId)}`)}
                    >
                      <GlassCard noPadding>
                        <View className="flex-row">
                          {coverImage && (
                            <Image
                              source={{ uri: coverImage }}
                              className="w-24 h-24"
                              style={{ resizeMode: "cover" }}
                            />
                          )}
                          <View className="flex-1 p-4">
                            <Text style={{ color: colors.text.primary }} className="font-nunito-bold text-base mb-1">
                              {groupName}
                            </Text>
                            {groupDesc.length > 0 && (
                              <Text style={{ color: colors.text.secondary }} className="font-nunito-medium text-sm mb-2" numberOfLines={2}>
                                {groupDesc}
                              </Text>
                            )}
                            <View className="flex-row items-center" style={{ gap: 12 }}>
                              <View className="flex-row items-center">
                                <Ionicons name="people-outline" size={14} color={colors.text.secondary} />
                                <Text style={{ color: colors.text.secondary }} className="font-nunito-medium text-xs ml-1">
                                  {membersCount} membres
                                </Text>
                              </View>
                              {pendingCount > 0 && (
                                <View
                                  className="flex-row items-center px-2 py-1 rounded-full"
                                  style={{ backgroundColor: 'rgba(229, 184, 103, 0.15)' }}
                                >
                                  <Ionicons name="notifications" size={12} color={colors.warning} />
                                  <Text style={{ color: colors.warning }} className="font-nunito-bold text-xs ml-1">
                                    {pendingCount} demande{pendingCount > 1 ? 's' : ''}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      </GlassCard>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* Message si aucun événement/groupe */}
          {myEvents.length === 0 && myGroups.length === 0 && !isLoading && (
            <View className="px-6 mb-6">
              <GlassCard>
                <View className="flex-row items-center mb-4">
                  <View
                    className="w-14 h-14 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: palette.primary.subtle }}
                  >
                    <Ionicons name="rocket-outline" size={28} color={colors.primary.DEFAULT} />
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: colors.text.primary }} className="font-nunito-extrabold text-lg mb-1">
                      Commencez votre aventure
                    </Text>
                    <Text style={{ color: colors.text.secondary }} className="font-nunito-medium text-sm">
                      Créez votre premier événement ou groupe pour lancer votre communauté.
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => router.push("/(app)/events/create")}
                  className="mt-2 px-5 py-3 rounded-full flex-row items-center justify-center"
                  style={{ backgroundColor: colors.primary.DEFAULT }}
                >
                  <Text className="text-white font-nunito-bold text-sm mr-2">
                    Créer mon premier événement
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </Pressable>
              </GlassCard>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </WarmBackground>
  );
}
