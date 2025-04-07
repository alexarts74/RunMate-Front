import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Conversation } from "@/interface/Conversation";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { directMessageService } from "@/service/api/message";
import { groupMessageService } from "@/service/api/groupMessage";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";

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
      className="flex-row items-center p-4 border-b border-[#394047]"
    >
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
        className="w-12 h-12 rounded-full"
      />
      <View className="flex-1 ml-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white font-bold flex-1 mr-2" numberOfLines={1}>
            {conversation.type === "group"
              ? conversation.group?.name
              : `${conversation.user?.first_name} `}
          </Text>
          {conversation?.last_message?.created_at && (
            <Text className="text-white text-xs shrink-0">
              {formatDistanceToNow(
                new Date(conversation.last_message.created_at),
                {
                  addSuffix: true,
                  locale: fr,
                  includeSeconds: true,
                }
              )}
            </Text>
          )}
        </View>
        <View className="flex-row justify-between items-center mt-1">
          <Text
            className={`flex-1 ${
              conversation.unread_messages > 0
                ? "text-white font-bold"
                : "text-white"
            }`}
            numberOfLines={1}
          >
            {conversation.type === "group" &&
            conversation.last_message?.sender?.first_name
              ? `${conversation.last_message.sender.first_name}: ${
                  conversation.last_message.content || "Message vide"
                }`
              : conversation.last_message?.content || "Aucun message"}
          </Text>
          {conversation.unread_messages > 0 && (
            <View className="bg-purple rounded-full w-6 h-6 items-center justify-center ml-2">
              <Text className="text-dark text-xs font-bold">
                {conversation.unread_messages}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
