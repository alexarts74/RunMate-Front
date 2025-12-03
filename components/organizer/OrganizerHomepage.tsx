import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { eventService } from "@/service/api/event";
import { groupService } from "@/service/api/group";
import { organizerProfileService } from "@/service/api/organizerProfile";
import { Event } from "@/interface/Event";
import { GroupInfo } from "@/interface/Group";

export function OrganizerHomepage() {
  const { user } = useAuth();
  const { unreadCount } = useUnreadMessages();
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

  useEffect(() => {
    loadData();
  }, []);

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
      const eventsResponse = await eventService.getMyEvents();
      const createdEvents = eventsResponse.created || [];
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
    <View className="flex-1 bg-fond">
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
                  <Ionicons name="business" size={20} color="#FF6B4A" style={{ marginRight: 8 }} />
                  <Text className="text-gray-500 font-nunito-medium text-sm">
                    Bienvenue
                  </Text>
                </View>
                <Text 
                  className="text-gray-900 font-nunito-extrabold text-2xl" 
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
                  <Ionicons name="notifications-outline" size={24} color="#FF6B4A" />
                  {unreadCount > 0 && (
                    <View className="absolute -top-1 -right-1 bg-primary rounded-full w-5 h-5 items-center justify-center border-2 border-fond">
                      <Text className="text-white font-nunito-bold text-xs">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </Text>
                    </View>
                  )}
                </Pressable>

                <Pressable
                  onPress={() => router.push("/(tabs)/profile")}
                  className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary"
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
            <Text className="text-gray-900 font-nunito-extrabold text-xl mb-4">
              Statistiques
            </Text>
            <View style={{ gap: 12 }}>
              <View className="bg-white rounded-2xl p-5" style={{
                shadowColor: "#FF6B4A",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}>
                <View className="flex-row items-center">
                  <View className="w-14 h-14 rounded-xl bg-primary/10 items-center justify-center mr-4">
                    <Ionicons name="calendar" size={28} color="#FF6B4A" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 font-nunito-medium text-sm mb-1">
                      Événements
                    </Text>
                    <Text className="text-gray-900 font-nunito-extrabold text-3xl mb-1">
                      {stats.totalEvents}
                    </Text>
                    {stats.upcomingEvents > 0 && (
                      <Text className="text-primary font-nunito-medium text-xs">
                        {stats.upcomingEvents} à venir
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              <View className="bg-white rounded-2xl p-5" style={{
                shadowColor: "#A78BFA",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}>
                <View className="flex-row items-center">
                  <View className="w-14 h-14 rounded-xl bg-secondary/10 items-center justify-center mr-4">
                    <Ionicons name="people" size={28} color="#A78BFA" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 font-nunito-medium text-sm mb-1">
                      Groupes
                    </Text>
                    <Text className="text-gray-900 font-nunito-extrabold text-3xl">
                      {stats.totalGroups}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="bg-white rounded-2xl p-5" style={{
                shadowColor: "#10B981",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}>
                <View className="flex-row items-center">
                  <View className="w-14 h-14 rounded-xl bg-green-100 items-center justify-center mr-4">
                    <Ionicons name="person-add" size={28} color="#10B981" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-500 font-nunito-medium text-sm mb-1">
                      Participants
                    </Text>
                    <Text className="text-gray-900 font-nunito-extrabold text-3xl">
                      {stats.totalParticipants}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Actions rapides */}
          <View className="px-6 mb-6">
            <Text className="text-gray-900 font-nunito-extrabold text-xl mb-4">
              Actions rapides
            </Text>
            <View className="flex-row" style={{ gap: 12 }}>
              {/* Carte Créer un événement */}
              <Pressable
                onPress={() => router.push("/(app)/events/create")}
                className="flex-1 bg-white rounded-2xl p-5"
                style={{
                  shadowColor: "#FF6B4A",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View>
                  <LinearGradient
                    colors={["#FF6B4A", "#FF8E75"]}
                    className="w-12 h-12 rounded-xl items-center justify-center mb-4"
                  >
                    <Ionicons name="calendar-outline" size={24} color="#FFFFFF" />
                  </LinearGradient>
                  <Text className="text-gray-900 font-nunito-extrabold text-lg mb-1">
                    Créer un événement
                  </Text>
                  <Text className="text-gray-500 font-nunito-medium text-xs">
                    Organiser une course
                  </Text>
                </View>
                <View className="flex-row justify-end mt-4">
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </Pressable>

              {/* Carte Créer un groupe */}
              <Pressable
                onPress={() => router.push("/(app)/groups/create")}
                className="flex-1 bg-white rounded-2xl p-5"
                style={{
                  shadowColor: "#A78BFA",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <View>
                  <LinearGradient
                    colors={["#A78BFA", "#C4AFFF"]}
                    className="w-12 h-12 rounded-xl items-center justify-center mb-4"
                  >
                    <Ionicons name="people-outline" size={24} color="#FFFFFF" />
                  </LinearGradient>
                  <Text className="text-gray-900 font-nunito-extrabold text-lg mb-1">
                    Créer un groupe
                  </Text>
                  <Text className="text-gray-500 font-nunito-medium text-xs">
                    Nouveau groupe
                  </Text>
                </View>
                <View className="flex-row justify-end mt-4">
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </Pressable>
            </View>
          </View>

          {/* Événements récents */}
          {myEvents.length > 0 && (
            <View className="px-6 mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-gray-900 font-nunito-extrabold text-xl">
                  Mes événements
                </Text>
                <Pressable onPress={() => router.push("/(app)/events/all")}>
                  <Text className="text-primary font-nunito-bold text-sm">
                    Voir tout
                  </Text>
                </Pressable>
              </View>

              <View style={{ gap: 12 }}>
                {myEvents.slice(0, 3).map((event) => (
                  <Pressable
                    key={event.id}
                    onPress={() => router.push(`/(app)/events/${event.id}`)}
                    className="bg-white rounded-2xl overflow-hidden"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 3,
                    }}
                  >
                    <View className="flex-row">
                      {event.cover_image && (
                        <Image
                          source={{ uri: event.cover_image }}
                          className="w-24 h-24"
                          style={{ resizeMode: "cover" }}
                        />
                      )}
                      <View className="flex-1 p-4">
                        <Text className="text-gray-900 font-nunito-bold text-base mb-1">
                          {event.name}
                        </Text>
                        <View className="flex-row items-center mb-2" style={{ gap: 8 }}>
                          <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                          <Text className="text-gray-600 font-nunito-medium text-xs">
                            {formatDate(event.start_date)}
                          </Text>
                          <Ionicons name="location-outline" size={14} color="#6B7280" style={{ marginLeft: 8 }} />
                          <Text className="text-gray-600 font-nunito-medium text-xs">
                            {event.location}
                          </Text>
                        </View>
                        <View className="flex-row items-center" style={{ gap: 12 }}>
                          <View className="flex-row items-center">
                            <Ionicons name="people-outline" size={14} color="#10B981" />
                            <Text className="text-gray-600 font-nunito-medium text-xs ml-1">
                              {event.participants_count || 0} participants
                            </Text>
                          </View>
                          {event.spots_left !== undefined && (
                            <View className="flex-row items-center">
                              <Ionicons name="time-outline" size={14} color="#F59E0B" />
                              <Text className="text-gray-600 font-nunito-medium text-xs ml-1">
                                {event.spots_left} places restantes
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Groupes récents */}
          {myGroups.length > 0 && (
            <View className="px-6 mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-gray-900 font-nunito-extrabold text-xl">
                  Mes groupes
                </Text>
                <Pressable onPress={() => router.push("/(app)/groups/all")}>
                  <Text className="text-primary font-nunito-bold text-sm">
                    Voir tout
                  </Text>
                </Pressable>
              </View>

              <View style={{ gap: 12 }}>
                {myGroups.slice(0, 3).map((group) => (
                  <Pressable
                    key={group.id}
                    onPress={() => router.push(`/(app)/groups/${group.id}`)}
                    className="bg-white rounded-2xl overflow-hidden"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 3,
                    }}
                  >
                    <View className="flex-row">
                      {group.cover_image && (
                        <Image
                          source={{ uri: group.cover_image }}
                          className="w-24 h-24"
                          style={{ resizeMode: "cover" }}
                        />
                      )}
                      <View className="flex-1 p-4">
                        <Text className="text-gray-900 font-nunito-bold text-base mb-1">
                          {group.name}
                        </Text>
                        <Text className="text-gray-600 font-nunito-medium text-sm mb-2" numberOfLines={2}>
                          {group.description}
                        </Text>
                        <View className="flex-row items-center" style={{ gap: 12 }}>
                          <View className="flex-row items-center">
                            <Ionicons name="people-outline" size={14} color="#A78BFA" />
                            <Text className="text-gray-600 font-nunito-medium text-xs ml-1">
                              {group.members_count || 0} membres
                            </Text>
                          </View>
                          {group.pending_requests_count && group.pending_requests_count > 0 && (
                            <View className="flex-row items-center bg-orange-100 px-2 py-1 rounded-full">
                              <Ionicons name="notifications" size={12} color="#F59E0B" />
                              <Text className="text-orange-700 font-nunito-bold text-xs ml-1">
                                {group.pending_requests_count} demande{group.pending_requests_count > 1 ? 's' : ''}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Message si aucun événement/groupe */}
          {myEvents.length === 0 && myGroups.length === 0 && !isLoading && (
            <View className="px-6 mb-6">
              <View
                className="bg-white rounded-2xl p-5"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center mb-4">
                  <View className="w-14 h-14 rounded-xl bg-primary/10 items-center justify-center mr-4">
                    <Ionicons name="rocket-outline" size={28} color="#FF6B4A" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-nunito-extrabold text-lg mb-1">
                      Commencez votre aventure
                    </Text>
                    <Text className="text-gray-600 font-nunito-medium text-sm">
                      Créez votre premier événement ou groupe pour lancer votre communauté.
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => router.push("/(app)/events/create")}
                  className="mt-2 bg-primary px-5 py-3 rounded-full flex-row items-center justify-center"
                >
                  <Text className="text-white font-nunito-bold text-sm mr-2">
                    Créer mon premier événement
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

