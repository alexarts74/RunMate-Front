import { View, Text, FlatList, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import messageService from "@/service/api/message";
import { Conversation } from "@/interface/Conversation";
import { ConversationItem } from "@/components/messages/ConversationItem";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const MessagesScreen = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await messageService.getAllConversations();
      setConversations(data);
    } catch (error) {
      console.error("Erreur lors du chargement des conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#12171b] justify-center items-center">
        <Text className="text-white">Chargement...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#12171b] pt-12">
      <View className="px-4 py-4 border-b border-[#394047] flex-row items-center gap-x-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text className="text-white text-2xl font-bold">Messages</Text>
      </View>

      <FlatList
        data={conversations}
        renderItem={({ item }) => <ConversationItem conversation={item} />}
        keyExtractor={(item) => item.user.id.toString()}
        onRefresh={loadConversations}
        refreshing={isLoading}
      />
    </View>
  );
};

export default MessagesScreen;
