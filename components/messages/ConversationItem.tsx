import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Conversation } from "@/interface/Conversation";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { directMessageService } from "@/service/api/message";
import { groupMessageService } from "@/service/api/groupMessage";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { Ionicons } from "@expo/vector-icons";

type ConversationItemProps = {
  conversation: Conversation;
  onMessageRead: (id: string) => void;
};

export function ConversationItem({
  conversation,
  onMessageRead,
}: ConversationItemProps) {
  const { decrementUnreadCount } = useUnreadMessages();

  const handlePress = async () => {
    try {
      if (conversation.type === "group") {
        router.push(`/chat/group/${conversation.group?.id}`);
        if (conversation.unread_messages > 0 && conversation.last_message.id) {
          await groupMessageService.markAsRead(
            conversation?.last_message?.id?.toString()
          );
          onMessageRead?.(conversation?.last_message?.id?.toString());
          decrementUnreadCount(conversation?.unread_messages);
        }
      } else {
        router.push(`/chat/${conversation.user.id}`);
        if (conversation.unread_messages > 0 && conversation.last_message.id) {
          await directMessageService.markAsRead(
            conversation?.last_message?.id?.toString()
          );
          onMessageRead?.(conversation?.last_message?.id?.toString());
          decrementUnreadCount(conversation?.unread_messages);
        }
      }
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center px-4 py-3.5 bg-white"
      style={{
        marginHorizontal: 4,
        marginVertical: 2,
        borderRadius: 12,
        shadowColor: "#FF6B4A",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <View className="relative mr-3">
        <Image
          source={
            conversation.type === "group"
              ? conversation.group?.cover_image
                ? { uri: conversation.group.cover_image }
                : require("@/assets/images/react-logo.png")
              : conversation.user?.profile_image
              ? { uri: conversation.user.profile_image }
              : require("@/assets/images/react-logo.png")
          }
          className="w-12 h-12 rounded-full border border-gray-200"
        />
        {conversation.unread_messages > 0 && (
          <View 
            className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary border-2 border-white items-center justify-center"
            style={{ minWidth: 20, minHeight: 20 }}
          >
            <Text className="text-white text-[10px] font-nunito-bold" style={{ fontSize: 9 }}>
              {conversation.unread_messages > 9 ? "9+" : conversation.unread_messages}
            </Text>
          </View>
        )}
      </View>
      <View className="flex-1 flex-shrink mr-2">
        <View className="flex-row justify-between items-center mb-1">
          <Text 
            className="text-gray-900 font-nunito-bold flex-1 mr-2" 
            numberOfLines={1}
            style={{ fontSize: 15 }}
          >
            {conversation.type === "group"
              ? conversation.group?.name
              : `${conversation.user?.first_name} ${conversation.user?.last_name || ""}`.trim()}
          </Text>
          {conversation?.last_message?.created_at && (
            <Text 
              className="text-gray-500 shrink-0 font-nunito-medium"
              style={{ fontSize: 11 }}
            >
              {formatDistanceToNow(
                new Date(conversation.last_message.created_at),
                {
                  addSuffix: true,
                  locale: fr,
                  includeSeconds: false,
                }
              )}
            </Text>
          )}
        </View>
        <View className="flex-row justify-between items-center">
          <Text
            className={`flex-1 mr-2 ${
              conversation.unread_messages > 0
                ? "text-gray-900 font-nunito-bold"
                : "text-gray-600 font-nunito-medium"
            }`}
            numberOfLines={1}
            style={{ fontSize: 13 }}
          >
            {conversation.type === "group" &&
            conversation.last_message?.sender?.first_name
              ? `${conversation.last_message.sender.first_name}: ${
                  conversation.last_message.content || "Message vide"
                }`
              : conversation.last_message?.content || "Aucun message"}
          </Text>
          {conversation.type === "group" && (
            <View className="bg-tertiary px-1.5 py-1 rounded-full ml-1">
              <Ionicons name="people" size={10} color="#A78BFA" />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
