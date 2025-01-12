import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { groupService } from "@/service/api/group";

type RunningGroupType = {
  id: string;
  name: string;
  members_count: number;
  location: string;
  upcoming_events: any[];
  level: string;
  cover_image: string | null;
};

const RunningGroup = () => {
  const [groups, setGroups] = useState<RunningGroupType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
    fetchGroups();
  }, []);

  const renderGroup = ({ item }: { item: RunningGroupType }) => (
    <Pressable className="bg-[#1e2429] rounded-xl overflow-hidden mb-3">
      <View className="flex-row h-20">
        <Image
          source={
            item.cover_image
              ? { uri: item.cover_image }
              : require("@/assets/images/favicon.png")
          }
          className="w-20 h-full"
          style={{ resizeMode: "cover" }}
        />
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text className="text-white font-bold text-base">{item.name}</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location" size={14} color="#6B7280" />
              <Text className="text-green text-sm ml-1">{item.location}</Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="people" size={14} color="#6B7280" />
              <Text className="text-green text-sm ml-1">
                {item.members_count} membres
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="fitness" size={14} color="#6B7280" />
              <Text className="text-green text-sm ml-1">{item.level}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className="bg-[#12171b]">
      <Text className="text-xl font-bold text-white px-5 mb-4">
        Groupes de running
      </Text>
      {isLoading ? (
        <View className="px-5">
          <Text className="text-white text-center">Chargement...</Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          renderItem={renderGroup}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
          style={{ height: 500 }}
        />
      )}
    </View>
  );
};

export default RunningGroup;
