import { View, Text, Pressable } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Conversation } from "@/interface/Conversation";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { directMessageService } from "@/service/api/message";
import { groupMessageService } from "@/service/api/groupMessage";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors, radii, typography } from "@/constants/theme";
import GlassCard from "@/components/ui/GlassCard";
import GlassAvatar from "@/components/ui/GlassAvatar";

type ConversationItemProps = {
  conversation: Conversation;
  onMessageRead: (id: string) => void;
};

export function ConversationItem({
  conversation,
  onMessageRead,
}: ConversationItemProps) {
  const { colors, shadows } = useThemeColors();
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

  const avatarUri =
    conversation.type === "group"
      ? conversation.group?.cover_image || null
      : conversation.user?.profile_image || null;

  return (
    <Pressable
      onPress={handlePress}
      style={{
        marginHorizontal: 4,
        marginVertical: 2,
      }}
    >
      <GlassCard
        variant="light"
        noPadding
        style={{
          borderRadius: radii.md,
          ...shadows.sm,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 14,
          }}
        >
          <View style={{ position: "relative", marginRight: 12 }}>
            <GlassAvatar uri={avatarUri} size={48} />
            {conversation.unread_messages > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  minWidth: 20,
                  minHeight: 20,
                  borderRadius: 10,
                  backgroundColor: colors.primary.DEFAULT,
                  borderWidth: 2,
                  borderColor: colors.elevated,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: colors.text.inverse,
                    fontSize: 9,
                    fontFamily: "Nunito-Bold",
                  }}
                >
                  {conversation.unread_messages > 9
                    ? "9+"
                    : conversation.unread_messages}
                </Text>
              </View>
            )}
          </View>

          <View style={{ flex: 1, flexShrink: 1, marginRight: 8 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  ...typography.label,
                  color: colors.text.primary,
                  flex: 1,
                  marginRight: 8,
                }}
              >
                {conversation.type === "group"
                  ? conversation.group?.name
                  : `${conversation.user?.first_name} ${conversation.user?.last_name || ""}`.trim()}
              </Text>
              {conversation?.last_message?.created_at && (
                <Text
                  style={{
                    ...typography.caption,
                    color: colors.text.tertiary,
                    flexShrink: 0,
                    fontSize: 11,
                  }}
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

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  marginRight: 8,
                  fontSize: 13,
                  fontFamily:
                    conversation.unread_messages > 0
                      ? "Nunito-Bold"
                      : "Nunito-Medium",
                  color:
                    conversation.unread_messages > 0
                      ? colors.text.primary
                      : colors.text.tertiary,
                }}
              >
                {conversation.type === "group" &&
                conversation.last_message?.sender?.first_name
                  ? `${conversation.last_message.sender.first_name}: ${
                      conversation.last_message.content || "Message vide"
                    }`
                  : conversation.last_message?.content || "Aucun message"}
              </Text>
              {conversation.type === "group" && (
                <View
                  style={{
                    backgroundColor: colors.primary.subtle,
                    paddingHorizontal: 6,
                    paddingVertical: 4,
                    borderRadius: radii.full,
                    marginLeft: 4,
                  }}
                >
                  <Ionicons
                    name="people"
                    size={10}
                    color={colors.primary.DEFAULT}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );
}
