import { View, Text, FlatList, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { Conversation } from "@/interface/Conversation";
import { ConversationItem } from "@/components/messages/ConversationItem";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { directMessageService } from "@/service/api/message";
import { groupMessageService } from "@/service/api/groupMessage";
import LoadingScreen from "@/components/LoadingScreen";

const MessagesScreen = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadConversations = async () => {
    try {
      const individualConversations =
        await directMessageService.getAllConversations();
      const groupConversations =
        await groupMessageService.getAllGroupConversations();

      const allConversations = [
        ...individualConversations,
        ...groupConversations,
      ].sort((a, b) => {
        const dateA = a.last_message?.created_at
          ? new Date(a.last_message.created_at)
          : new Date(0);
        const dateB = b.last_message?.created_at
          ? new Date(b.last_message.created_at)
          : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setConversations(allConversations);
    } catch (error) {
      console.error("Erreur lors du chargement des conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadConversations();
    }, [])
  );

  const handleMessageRead = (messageId: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) => {
        if (conv.last_message.id.toString() === messageId) {
          return { ...conv, unread_messages: 0 };
        }
        return conv;
      })
    );
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <ConversationItem
      conversation={item}
      onMessageRead={() => handleMessageRead(item.last_message.id.toString())}
    />
  );

  const keyExtractor = (item: Conversation) => {
    return `${item.type || "individual"}-${item.id || item.user?.id}`;
  };

  return (
    <View className="flex-1 bg-background pt-12">
      <View className="px-4 py-4 border-b border-[#394047] flex-row items-center gap-x-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text className="text-white text-2xl font-kanit-semibold">
          Messages
        </Text>
      </View>

      {isLoading && <LoadingScreen />}

      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={keyExtractor}
        onRefresh={loadConversations}
        refreshing={isLoading}
      />
    </View>
  );
};

export default MessagesScreen;
