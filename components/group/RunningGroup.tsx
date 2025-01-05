import React from "react";
import { View, Text, FlatList, Image, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type RunningGroupType = {
  id: string;
  name: string;
  members: number;
  location: string;
  nextRun: string;
  image: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
};

const mockGroups: RunningGroupType[] = [
  {
    id: "1",
    name: "Les Coureurs de Paris",
    members: 24,
    location: "Paris 12e",
    nextRun: "Demain, 18h30",
    image: "https://picsum.photos/400/200",
    level: "Débutant",
  },
  {
    id: "2",
    name: "Running Night Club",
    members: 42,
    location: "Bois de Vincennes",
    nextRun: "Jeudi, 19h00",
    image: "https://picsum.photos/400/201",
    level: "Intermédiaire",
  },
  {
    id: "3",
    name: "Marathon Training",
    members: 18,
    location: "Bois de Boulogne",
    nextRun: "Samedi, 9h00",
    image: "https://picsum.photos/400/202",
    level: "Avancé",
  },
];

const RunningGroup = () => {
  const renderGroup = ({ item }: { item: RunningGroupType }) => (
    <Pressable className="bg-[#1e2429] rounded-xl overflow-hidden mb-3">
      <View className="flex-row h-20">
        <Image
          source={{ uri: item.image }}
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
                {item.members} membres
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time" size={14} color="#6B7280" />
              <Text className="text-green text-sm ml-1">{item.nextRun}</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className="mt-2">
      <Text className="text-xl font-bold text-white px-5 mb-4">
        Groupes de running
      </Text>
      <FlatList
        data={mockGroups}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default RunningGroup;
