import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { groupService } from "@/service/api/group";
import { GroupEvent } from "@/components/group/GroupEvent";
import { CreateEventForm } from "@/components/group/CreateEventForm";
import { GroupChat } from "@/components/group/GroupChat";

type GroupDetails = {
  id: string;
  name: string;
  description: string;
  members_count: number;
  max_members: number;
  location: string;
  level: string;
  cover_image: string | null;
  creator: {
    id: number;
    name: string;
    profile_image: string;
  };
  is_member: boolean;
  is_admin: boolean;
  upcoming_events: Array<{
    id: number;
    date: string;
    title: string;
    distance: number;
  }>;
  members?: Array<{
    id: number;
    first_name: string;
    last_name: string;
    profile_image: string;
  }>;
};

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [isLeaving, setIsLeaving] = useState(false);

  const fetchEvents = async () => {
    try {
      const eventsData = await groupService.getGroupEvents(id as string);
      setEvents(eventsData || []);
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
      setEvents([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [groupData, eventsData] = await Promise.all([
          groupService.getGroupById(id as string),
          groupService.getGroupEvents(id as string),
        ]);
        setGroup(groupData);
        setEvents(eventsData || []);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleJoinGroup = async () => {
    setIsJoining(true);
    try {
      await groupService.joinGroup(id as string);
      Alert.alert("Succès", "Vous avez rejoint le groupe avec succès !");
      // Recharger les données du groupe
      const updatedGroup = await groupService.getGroupById(id as string);
      setGroup(updatedGroup);
    } catch (error: any) {
      Alert.alert(
        "Information",
        error.message || "Impossible de rejoindre le groupe"
      );
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveGroup = async () => {
    setIsLeaving(true);
    try {
      await groupService.leaveGroup(id as string);
      Alert.alert("Succès", "Vous avez quitté le groupe");
      // Recharger les données du groupe
      const updatedGroup = await groupService.getGroupById(id as string);
      setGroup(updatedGroup);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Impossible de quitter le groupe");
    } finally {
      setIsLeaving(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#12171b] items-center justify-center">
        <Text className="text-white">Chargement...</Text>
      </View>
    );
  }

  if (!group) {
    return (
      <View className="flex-1 bg-[#12171b] items-center justify-center">
        <Text className="text-white">Groupe non trouvé</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#12171b]">
      <ScrollView>
        {/* Image de couverture et infos de base */}
        <View className="relative h-64">
          <Image
            source={
              group.cover_image
                ? { uri: group.cover_image }
                : require("@/assets/images/favicon.png")
            }
            className="w-full h-full"
            style={{ resizeMode: "cover" }}
          />
          {/* Bouton de retour */}
          <Pressable
            onPress={() => router.back()}
            className="absolute top-12 left-4 bg-black/30 p-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        </View>

        {/* Contenu principal */}
        <View className="p-5">
          {/* Info du groupe */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-white mb-2">
              {group.name}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="location" size={16} color="#b9f144" />
              <Text className="text-white ml-2">{group.location}</Text>
            </View>
          </View>

          {/* Événements à venir */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white font-bold text-lg">
                Événements à venir
              </Text>
              {group.is_admin && (
                <Pressable
                  onPress={() => router.push(`/groups/${id}/create-event`)}
                  className="bg-green py-2 px-4 rounded-lg flex-row items-center"
                >
                  <Ionicons name="add" size={20} color="#12171b" />
                  <Text className="text-[#12171b] font-bold ml-2">
                    Créer un événement
                  </Text>
                </Pressable>
              )}
            </View>

            {events && events.length > 0 ? (
              events.map((event) => (
                <GroupEvent
                  key={event.id}
                  event={event}
                  groupId={id as string}
                  onEventUpdate={fetchEvents}
                />
              ))
            ) : (
              <Text className="text-white text-center italic">
                Aucun événement prévu
              </Text>
            )}
          </View>

          {/* Autres informations du groupe */}
          <View className="mb-6">
            <Text className="text-white font-bold text-lg mb-2">
              Description
            </Text>
            <Text className="text-white">{group.description}</Text>
          </View>

          {/* Membres */}
          <View>
            <Text className="text-white font-bold text-lg mb-2">
              Membres ({group.members_count}/{group.max_members})
            </Text>
            <View className="flex-row flex-wrap">
              {group.members?.map((member) => (
                <View key={member.id} className="mr-2 mb-2">
                  <Image
                    source={
                      member.profile_image
                        ? { uri: member.profile_image }
                        : require("@/assets/images/favicon.png")
                    }
                    className="w-12 h-12 rounded-full"
                  />
                  <Text className="text-white text-center text-xs mt-1">
                    {member.first_name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          {group.is_member && (
            <View className="px-5 py-4">
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/messages",
                    params: {
                      id: id,
                      type: "group",
                      name: group.name,
                      image:
                        group.cover_image || "https://via.placeholder.com/32",
                    },
                  });
                }}
                className="flex-row items-center bg-[#1e2429] p-4 rounded-xl"
              >
                <Image
                  source={{
                    uri: group.cover_image || "https://via.placeholder.com/32",
                  }}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <View className="flex-1">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-white font-semibold text-base">
                      {group.name}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                      Groupe • {group.members_count} membres
                    </Text>
                  </View>
                  <Text
                    className="text-gray-400 text-sm mt-1"
                    numberOfLines={1}
                  >
                    Rejoignez la conversation du groupe
                  </Text>
                </View>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de création d'événement */}
      {showCreateEvent && (
        <View className="absolute inset-0 bg-black/50 justify-center p-5">
          <CreateEventForm
            groupId={id as string}
            onEventCreated={() => {
              fetchEvents();
              setShowCreateEvent(false);
            }}
            onClose={() => setShowCreateEvent(false)}
          />
        </View>
      )}

      {/* Bouton Rejoindre/Quitter */}
      <View className="px-5 py-3 mb-2 border-t border-[#2a3238]">
        {group.is_member ? (
          <Pressable
            onPress={handleLeaveGroup}
            disabled={isLeaving}
            className={`bg-red-500 py-3 rounded-full w-48 self-center ${
              isLeaving ? "opacity-50" : ""
            }`}
          >
            <Text className="text-center text-white font-semibold text-sm">
              {isLeaving ? "En cours..." : "Quitter le groupe"}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleJoinGroup}
            className="bg-green py-3 rounded-full w-48 self-center"
          >
            <Text className="text-center text-[#12171b] font-semibold text-sm">
              Rejoindre le groupe
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
