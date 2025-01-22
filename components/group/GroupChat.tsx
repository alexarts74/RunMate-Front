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

interface GroupChatProps {
  groupId: string | number;
}

export const GroupChat: React.FC<GroupChatProps> = ({ groupId }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

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

  const renderMessage = ({ item: message }) => (
    <View className="mb-4">
      <View className="flex-row items-center mb-1">
        <Image
          source={{
            uri:
              message.sender.profile_image || "https://via.placeholder.com/32",
          }}
          className="w-8 h-8 rounded-full mr-2"
        />
        <Text className="text-white font-semibold">
          {message.sender.first_name}
        </Text>
      </View>
      <View className="ml-10 bg-[#1e2429] rounded-lg p-3">
        <Text className="text-white">{message.content}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white">Chargement des messages...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white">Erreur: {error}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 bg-[#12171b]">
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-400">
                Aucun message dans ce groupe
              </Text>
            </View>
          }
        />

        <View className="p-4 border-t border-[#2a3238]">
          <View className="flex-row items-center">
            <TextInput
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Écrivez votre message..."
              placeholderTextColor="#666"
              className="flex-1 bg-[#1e2429] text-white px-4 py-3 rounded-l-xl"
              multiline={false}
            />
            <Pressable
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-green px-4 py-3 rounded-r-xl"
            >
              <Text className="text-[#12171b] font-semibold">Envoyer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
