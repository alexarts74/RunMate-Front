import { View, Text, FlatList, Pressable, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Conversation } from "@/interface/Conversation";
import { ConversationItem } from "@/components/messages/ConversationItem";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { directMessageService } from "@/service/api/message";
import { groupMessageService } from "@/service/api/groupMessage";
import LoadingScreen from "@/components/LoadingScreen";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/AuthContext";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";

const MessagesScreen = () => {
  const { user } = useAuth();
  const { unreadCount } = useUnreadMessages();
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
    <View className="flex-1 bg-fond">
      <SafeAreaView className="flex-1" edges={['top']} style={{ flex: 1 }}>
        {/* Header simplifié */}
        <View className="px-6 pt-2 pb-4">
          <View className="flex-row items-center justify-between">
            {/* Logo moderne */}
            <View className="flex-row items-center">
              <LinearGradient
                colors={["#FF6B4A", "#A78BFA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-9 h-9 rounded-xl items-center justify-center mr-2"
              >
                <Text className="text-white font-nunito-bold text-xs">RM</Text>
              </LinearGradient>
            </View>
            
            {/* Actions header */}
            <View className="flex-row items-center" style={{ gap: 12 }}>
              <Pressable
                onPress={() => router.push("/messages")}
                className="relative"
              >
                <Ionicons name="notifications-outline" size={22} color="#FF6B4A" />
                {unreadCount > 0 && (
                  <View className="absolute -top-1 -right-1 bg-primary rounded-full w-4 h-4 items-center justify-center border-2 border-fond">
                    <Text className="text-white text-xs font-nunito-bold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Text>
                  </View>
                )}
              </Pressable>
              
              <Pressable
                onPress={() => router.push("/(tabs)/profile")}
                className="w-9 h-9 rounded-full overflow-hidden border border-primary"
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
        </View>

      {isLoading && <LoadingScreen />}

      {conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
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
          <Text className="text-gray-900 text-2xl font-nunito-extrabold text-center mb-3">
            Aucune conversation trouvée
          </Text>
          <Text className="text-gray-500 text-base font-nunito-medium text-center mb-8">
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
            <Text className="text-white text-base font-nunito-bold">
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
    </View>
  );
};

export default MessagesScreen;
