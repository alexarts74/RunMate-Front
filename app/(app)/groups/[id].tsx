import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Pressable, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { groupService } from "@/service/api/group";
import LoadingScreen from "@/components/LoadingScreen";

type GroupDetails = {
  id: string;
  name: string;
  description: string;
  members_count: number;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [groupData] = await Promise.all([
          groupService.getGroupById(id as string),
        ]);
        setGroup(groupData);
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
    try {
      setIsLeaving(true);
      const updatedGroup = await groupService.leaveGroup(id as string);
      Alert.alert("Succès", "Vous avez quitté le groupe avec succès");
      setGroup(updatedGroup);
      router.back();
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Impossible de quitter le groupe");
    } finally {
      setIsLeaving(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!group) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-white">Groupe non trouvé</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
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
                    {member.first_name} {member.last_name}
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
                    pathname: "/chat/group/[id]",
                    params: {
                      id: id as string,
                      type: "group",
                      name: group.name,
                      image:
                        group.cover_image || "https://via.placeholder.com/32",
                    },
                  });
                }}
                className="flex-row items-center bg-[#1e2429] p-4 rounded-2xl border border-[#2a3238]"
              >
                <View className="relative">
                  <Image
                    source={{
                      uri:
                        group.cover_image || "https://via.placeholder.com/32",
                    }}
                    className="w-12 h-12 rounded-xl"
                  />
                  <View className="absolute -bottom-1 -right-1 bg-purple w-4 h-4 rounded-full border-2 border-[#12171b]" />
                </View>

                <View className="flex-1 ml-4">
                  <View className="flex-row items-center space-x-2">
                    <Text className="text-white font-semibold text-base flex-1">
                      Conversation du groupe
                    </Text>
                    <Ionicons
                      name="chatbubble-ellipses"
                      size={20}
                      color="#b9f144"
                    />
                  </View>
                  <Text className="text-gray-400 text-sm mt-1">
                    {group.members_count} membres actifs
                  </Text>
                </View>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

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
            disabled={isJoining}
            className={`bg-purple py-3 rounded-full w-48 self-center ${
              isJoining ? "opacity-50" : ""
            }`}
          >
            <Text className="text-center text-white font-semibold text-sm">
              {isJoining ? "En cours..." : "Rejoindre le groupe"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
