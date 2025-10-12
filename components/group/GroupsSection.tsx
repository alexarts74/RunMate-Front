import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { groupService } from "@/service/api/group";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";

type RunningGroupType = {
  id: string;
  name: string;
  members_count: number;
  location: string;
  level: string;
  cover_image: string | null;
  max_members: number;
};

export function GroupsSection() {
  const [groups, setGroups] = useState<RunningGroupType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const fetchGroups = async () => {
    if (!user?.is_premium) return;

    setIsLoading(true);
    try {
      const groupsData = await groupService.getGroups();
      // Limiter à 2 groupes pour l'aperçu
      setGroups(groupsData.slice(0, 2));
    } catch (error) {
      console.error("Erreur lors du chargement des groupes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user?.is_premium]);

  const handleGroupPress = (groupId: string) => {
    if (user?.is_premium) {
      router.push(`/groups/${groupId}`);
    } else {
      router.push("/(app)/groups/all");
    }
  };

  const handleSeeAll = () => {
    router.push("/(app)/groups/all");
  };

  return (
    <View className="px-5 py-3">
      {/* Header de la section */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center">
          <View className="w-1 h-6 bg-[#f0c2fe] rounded-full mr-3" />
          <Text className="text-xl font-kanit-semibold text-white">
            👥 Groupes de course
          </Text>
        </View>

        <Pressable
          onPress={handleSeeAll}
          className="flex-row items-center bg-purple/10 px-3 py-1 rounded-full"
        >
          <Text className="text-[#f0c2fe] font-kanit text-sm mr-1">
            Voir tout
          </Text>
          <Ionicons name="arrow-forward" size={14} color="#f0c2fe" />
        </Pressable>
      </View>

      {/* Contenu */}
      {isLoading ? (
        <View className="h-32 bg-background rounded-2xl items-center justify-center border border-gray-700">
          <Ionicons name="hourglass-outline" size={32} color="#f0c2fe" />
        </View>
      ) : !user?.is_premium ? (
        <View className="bg-background rounded-2xl p-5 border border-purple/30">
          <View className="flex-row items-center mb-3">
            <View className="bg-purple/20 p-3 rounded-full mr-3">
              <Ionicons name="people" size={24} color="#f0c2fe" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-kanit-semibold text-base mb-1">
                Rejoignez des groupes
              </Text>
              <Text className="text-gray-400 text-xs">
                Fonctionnalité Premium
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push("/premium")}
            className="bg-purple rounded-xl py-3 items-center"
          >
            <Text className="text-white font-kanit-semibold">
              Débloquer Premium
            </Text>
          </Pressable>
        </View>
      ) : groups.length === 0 ? (
        <View className="bg-background rounded-2xl p-5 items-center border border-gray-700">
          <Ionicons name="people-outline" size={36} color="#f0c2fe" />
          <Text className="text-white text-center font-kanit mt-2 mb-1">
            Aucun groupe
          </Text>
          <Text className="text-gray-400 text-center text-sm">
            Créez ou rejoignez un groupe
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {groups.map((group) => (
            <Pressable
              key={group.id}
              className="bg-background rounded-xl overflow-hidden border border-gray-700"
              onPress={() => handleGroupPress(group.id)}
            >
              <Image
                source={
                  group.cover_image
                    ? { uri: group.cover_image }
                    : require("@/assets/images/favicon.png")
                }
                className="w-full h-24"
                style={{ resizeMode: "cover" }}
              />
              <View className="p-3">
                <Text className="text-white font-kanit-semibold text-base mb-2">
                  {group.name}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="people" size={14} color="#f0c2fe" />
                  <Text className="text-gray-300 text-xs ml-2">
                    {group.members_count} membres
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
