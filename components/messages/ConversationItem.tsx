import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Conversation } from "@/interface/Conversation";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import messageService from "@/service/api/message";
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
    // console.log("dans le handlePress");
    try {
      router.push(`/chat/${conversation.user.id}`);
      if (conversation.unread_messages > 0 && conversation.last_message.id) {
        await messageService.markAsRead(
          conversation.last_message.id.toString()
        );
        onMessageRead?.(conversation.last_message.id.toString());
        decrementUnreadCount(conversation.unread_messages);
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
          conversation.user.profile_image
            ? { uri: conversation.user.profile_image }
            : require("@/assets/images/react-logo.png")
        }
        className="w-12 h-12 rounded-full"
      />
      <View className="flex-1 ml-4 gap-y-3">
        <View className="flex-row justify-between">
          <Text className="text-white font-bold">
            {conversation.user.first_name} {conversation.user.last_name}
          </Text>
          <Text className="text-white text-xs">
            {formatDistanceToNow(
              new Date(conversation.last_message.created_at),
              {
                addSuffix: true,
                locale: fr,
              }
            )}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text
            className={`flex-1 text-white ${
              conversation.unread_messages > 0 ? "font-bold" : ""
            }`}
            numberOfLines={1}
          >
            {conversation.last_message.content}
          </Text>
          {conversation.unread_messages > 0 && (
            <View className="bg-green rounded-full w-6 h-6 items-center justify-center ml-2">
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
