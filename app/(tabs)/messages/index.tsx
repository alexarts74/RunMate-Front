import { View, Text, FlatList, Pressable } from "react-native";
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
import WarmBackground from "@/components/ui/WarmBackground";
import GlassAvatar from "@/components/ui/GlassAvatar";
import GlassButton from "@/components/ui/GlassButton";
import { useThemeColors } from "@/constants/theme";

const MessagesScreen = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { colors, shadows } = useThemeColors();

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
    <WarmBackground>
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.glass.border,
          }}
        >
          <View className="flex-row items-center justify-between">
            <Text
              className="font-nunito-bold text-2xl"
              style={{ color: colors.text.primary }}
            >
              Messages
            </Text>
            <Pressable
              onPress={() => router.push("/(tabs)/profile")}
            >
              <GlassAvatar
                uri={user?.profile_image}
                size={40}
                showRing
              />
            </Pressable>
          </View>
        </View>

        {isLoading && <LoadingScreen />}

        {conversations.length === 0 && !isLoading ? (
          <View className="flex-1 items-center justify-center px-6">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: colors.primary.subtle }}
            >
              <Ionicons name="chatbubbles-outline" size={40} color={colors.primary.DEFAULT} />
            </View>
            <Text
              className="text-xl font-nunito-bold text-center mb-2"
              style={{ color: colors.text.primary }}
            >
              Aucune conversation
            </Text>
            <Text
              className="text-sm font-nunito-medium text-center mb-6"
              style={{ color: colors.text.secondary }}
            >
              {user?.user_type === "organizer"
                ? "Les messages de vos participants apparaitront ici"
                : "Commence une conversation avec un coureur"}
            </Text>
            {user?.user_type !== "organizer" && (
              <GlassButton
                title="Trouver des coureurs"
                onPress={() => router.push("/")}
                icon={<Ionicons name="fitness" size={18} color="white" />}
              />
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
    </WarmBackground>
  );
};

export default MessagesScreen;
