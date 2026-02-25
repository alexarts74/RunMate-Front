import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { groupMessageService } from "@/service/api/groupMessage";
import { Message } from "@/interface/Conversation";
import PulseLoader from "@/components/ui/PulseLoader";
import { useThemeColors } from "@/constants/theme";

interface GroupChatProps {
  groupId: string | number;
}

export const GroupChat: React.FC<GroupChatProps> = ({ groupId }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const { colors, shadows } = useThemeColors();

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await groupMessageService.getGroupMessages(groupId);
      setMessages(response.messages);
    } catch (error: any) {
      setError(error.message || "Erreur lors du chargement des messages");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await groupMessageService.sendGroupMessage(groupId, newMessage);
      setNewMessage("");
      loadMessages();
    } catch (error) {
      console.error("Erreur d'envoi:", error);
    }
  };

  useEffect(() => {
    if (groupId) {
      loadMessages();
      const interval = setInterval(loadMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [groupId]);

  const renderMessage = ({ item: message }: { item: Message }) => (
    <View className="mb-4">
      <View className="flex-row items-center mb-1">
        <Image
          source={{
            uri:
              message.sender.profile_image || "https://via.placeholder.com/32",
          }}
          className="w-8 h-8 rounded-full mr-2"
        />
        <Text style={{ color: colors.text.primary }} className="font-semibold">
          {message.sender.first_name}
        </Text>
      </View>
      <View
        className="ml-10 rounded-lg p-3"
        style={{ backgroundColor: colors.glass.light }}
      >
        <Text style={{ color: colors.text.primary }}>{message.content}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
        <PulseLoader color={colors.primary.DEFAULT} size={10} />
        <Text style={{ color: colors.text.tertiary }} className="mt-3">Chargement des messages...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
        <Text style={{ color: colors.error }}>Erreur: {error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center">
              <Text style={{ color: colors.text.tertiary }}>
                Aucun message dans ce groupe
              </Text>
            </View>
          }
        />

        <View className="p-4" style={{ borderTopWidth: 1, borderTopColor: colors.glass.border }}>
          <View className="flex-row items-center">
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Écrivez votre message..."
              placeholderTextColor={colors.text.tertiary}
              className="flex-1 px-4 py-3 rounded-l-xl"
              style={{
                backgroundColor: colors.glass.light,
                color: colors.text.primary,
              }}
              multiline={false}
            />
            <Pressable
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
              className="px-4 py-3 rounded-r-xl"
              style={{ backgroundColor: colors.primary.DEFAULT, opacity: !newMessage.trim() ? 0.5 : 1 }}
            >
              <Text className="text-white font-semibold">Envoyer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
