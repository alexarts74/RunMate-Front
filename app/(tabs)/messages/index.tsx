import { View, Text, FlatList, Image, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";

// Type pour une conversation
type Conversation = {
  id: string;
  user: {
    id: string;
    name: string;
    profile_image: string;
  };
  last_message: string;
  timestamp: string;
};

// Données de test
const mockConversations: Conversation[] = [
  {
    id: "1",
    user: {
      id: "1",
      name: "John Doe",
      profile_image: "",
    },
    last_message: "Salut, on court ensemble demain ?",
    timestamp: "10:30",
  },
  // Ajoutez d'autres conversations de test...
];

const MessagesScreen = () => {
  const renderConversation = ({ item }: { item: Conversation }) => (
    <Pressable
      onPress={() => router.push(`/chat/${item.id}`)}
      className="flex-row items-center p-4 border-b border-[#394047]"
    >
      <Image
        source={
          item.user.profile_image
            ? { uri: item.user.profile_image }
            : require("@/assets/images/react-logo.png")
        }
        className="w-12 h-12 rounded-full"
      />
      <View className="flex-1 ml-4">
        <Text className="text-white font-bold">{item.user.name}</Text>
        <Text className="text-gray-400">{item.last_message}</Text>
      </View>
      <Text className="text-gray-400 text-xs">{item.timestamp}</Text>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-[#12171b] pt-12">
      <View className="px-4 py-4 border-b border-[#394047]">
        <Text className="text-white text-2xl font-bold">Messages</Text>
      </View>
      <FlatList
        data={mockConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default MessagesScreen;
