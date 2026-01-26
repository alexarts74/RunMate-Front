import { View, Text, FlatList, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Conversation } from "@/interface/Conversation";
import { ConversationItem } from "@/components/messages/ConversationItem";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { directMessageService } from "@/service/api/message";
import { groupMessageService } from "@/service/api/groupMessage";
import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@/context/AuthContext";

const ACCENT = "#F97316";

const MessagesScreen = () => {
  const { user } = useAuth();
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
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="px-6 pt-2 pb-4 border-b border-neutral-100">
          <View className="flex-row items-center justify-between">
            <Text className="text-neutral-900 font-nunito-bold text-2xl">
              Messages
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/profile")}
              className="w-10 h-10 rounded-full overflow-hidden"
            >
              <Image
                source={
                  user?.profile_image
                    ? { uri: user.profile_image }
                    : require("@/assets/images/react-logo.png")
                }
                className="w-full h-full"
                style={{ resizeMode: "cover" }}
              />
            </Pressable>
          </View>
        </View>

        {isLoading && <LoadingScreen />}

        {conversations.length === 0 && !isLoading ? (
          <View className="flex-1 items-center justify-center px-6">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: `${ACCENT}15` }}
            >
              <Ionicons name="chatbubbles-outline" size={40} color={ACCENT} />
            </View>
            <Text className="text-neutral-900 text-xl font-nunito-bold text-center mb-2">
              Aucune conversation
            </Text>
            <Text className="text-neutral-500 text-sm font-nunito-medium text-center mb-6">
              {user?.user_type === "organizer"
                ? "Les messages de vos participants apparaîtront ici"
                : "Commence une conversation avec un coureur"}
            </Text>
            {user?.user_type !== "organizer" && (
              <Pressable
                className="rounded-2xl px-6 py-3 flex-row items-center"
                style={{ backgroundColor: ACCENT }}
                onPress={() => router.push("/")}
              >
                <Ionicons name="fitness" size={18} color="white" />
                <Text className="text-white text-sm font-nunito-bold ml-2">
                  Trouver des coureurs
                </Text>
              </Pressable>
            )}
          </View>
        ) : (
          <FlatList
            data={conversations}
            renderItem={renderConversation}
            keyExtractor={keyExtractor}
            onRefresh={loadConversations}
            refreshing={isLoading}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default MessagesScreen;
