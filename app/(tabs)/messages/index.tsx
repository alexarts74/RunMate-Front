import { View, Text, FlatList, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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

      setConversations(allConversations as Conversation[]);
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
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="px-6 pt-4 pb-4 flex-row items-center gap-x-4 border-b border-fond"
      >
        <Pressable 
          onPress={() => router.back()}
          className="p-2 rounded-full bg-tertiary"
        >
          <Ionicons name="arrow-back" size={20} color="#FF6B4A" />
        </Pressable>
        <Text className="text-gray-900 text-2xl font-kanit-bold">
          Messages
        </Text>
      </View>

      {isLoading && <LoadingScreen />}

      {conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6 bg-fond">
          <View className="bg-tertiary p-8 rounded-full mb-6"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons name="chatbubbles-outline" size={60} color="#FF6B4A" />
          </View>
          <Text className="text-gray-900 text-2xl font-kanit-bold text-center mb-3">
            Aucune conversation trouvée
          </Text>
          <Text className="text-gray-500 text-base font-kanit-medium text-center mb-8">
            Commencez une conversation avec un utilisateur ou un groupe
          </Text>
          <Pressable
            className="bg-primary rounded-full px-6 py-3 flex-row items-center"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={() => router.push("/")}
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white text-base font-kanit-bold">
              Trouve ton RunMate
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderConversation}
          keyExtractor={keyExtractor}
          onRefresh={loadConversations}
          refreshing={isLoading}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 8, paddingHorizontal: 4 }}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default MessagesScreen;
