import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, Pressable, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { groupService } from "@/service/api/group";
import { useRouter, useFocusEffect } from "expo-router";

type RunningGroupType = {
  id: string;
  name: string;
  members_count: number;
  location: string;
  upcoming_events: any[];
  level: string;
  cover_image: string | null;
  max_members: number;
};

const RunningGroup = () => {
  const [groups, setGroups] = useState<RunningGroupType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const groupsData = await groupService.getGroups();
      setGroups(groupsData);
    } catch (error) {
      console.error("Erreur lors du chargement des groupes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchGroups();
    }, [])
  );

  const renderGroup = ({ item }: { item: RunningGroupType }) => (
    <Pressable
      className="bg-[#1e2429] rounded-xl overflow-hidden mb-3 mx-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      onPress={() => router.push(`/chat/group/${item.id}`)}
    >
      <Image
        source={
          item.cover_image
            ? { uri: item.cover_image }
            : require("@/assets/images/favicon.png")
        }
        className="w-full h-32"
        style={{ resizeMode: "cover" }}
      />

      <View className="p-4">
        <Text className="text-white font-bold text-lg mb-2">{item.name}</Text>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="people" size={16} color="#b9f144" />
            <Text className="text-white text-sm ml-2">
              {item.members_count} membres
            </Text>
          </View>

          <Pressable
            className="bg-green/20 px-4 py-2 rounded-lg"
            onPress={() => router.push(`/chat/group/${item.id}`)}
          >
            <Text className="text-green font-semibold">Voir le groupe</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className="bg-[#12171b] flex-1">
      {isLoading ? (
        <View className="px-5">
          <Text className="text-white text-center">Chargement...</Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          renderItem={renderGroup}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={() => (
            <View className="px-5">
              <Text className="text-white text-center">
                Aucun groupe trouvé
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default RunningGroup;
