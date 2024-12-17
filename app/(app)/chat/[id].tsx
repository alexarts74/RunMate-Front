import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useMatches } from "@/context/MatchesContext";
import messageService from "@/service/api/message";
import { useAuth } from "@/context/AuthContext";
import { Message } from "@/interface/Conversation";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";

const ChatPage = () => {
  const { id } = useLocalSearchParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { matches } = useMatches();
  const { user } = useAuth();
  const { decrementUnreadCount } = useUnreadMessages();

  const match = matches?.find((match) => match.user.id === Number(id));

  const loadMessages = async () => {
    try {
      const response = await messageService.getConversation(id.toString());
      setMessages(response);
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
    }
  };

  useEffect(() => {
    const initChat = async () => {
      try {
        const response = await messageService.getConversation(id.toString());
        setMessages(response);

        const unreadMessages = response.filter(
          (msg: Message) => !msg.read && msg.sender_id !== user?.id
        );

        if (unreadMessages.length > 0) {
          await Promise.all(
            unreadMessages.map((msg: Message) =>
              messageService.markAsRead(msg.id.toString())
            )
          );
          // Décrémenter le compteur global
          decrementUnreadCount(unreadMessages.length);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des messages:", error);
      }
    };

    initChat();
  }, [id]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await messageService.sendMessage(id.toString(), newMessage);
        setNewMessage("");
        loadMessages();
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
      }
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`p-3 rounded-xl max-w-[85%] mb-2 ${
        item.sender_id === user?.id
          ? "bg-green self-end"
          : "bg-[#1e2429] self-start"
      }`}
    >
      <Text
        className={`mb-2 ${
          item.sender_id === user?.id ? "text-dark" : "text-white"
        }`}
      >
        {item.content}
      </Text>
      <Text
        className={`text-xs ${
          item.sender_id === user?.id ? "text-dark" : "text-gray"
        }`}
      >
        {new Date(item.created_at).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#12171b]"
    >
      {/* Header */}
      <View className="flex-row items-center px-4 pt-14 pb-4 bg-[#12171b] border-b border-[#394047]">
        <Pressable onPress={() => router.back()} className="p-2 mr-3">
          <Ionicons name="arrow-back" size={24} color="#b9f144" />
        </Pressable>

        <Image
          source={
            match?.user.profile_image
              ? { uri: match.user.profile_image }
              : require("@/assets/images/react-logo.png")
          }
          className="w-10 h-10 rounded-full mr-3"
        />

        <Text className="text-white text-lg font-bold flex-1">
          {match?.user.first_name} {match?.user.last_name}
        </Text>
      </View>
      <View className="flex-1 pt-4">
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 12 }}
        />
        <View className="p-4 border-t border-[#394047] flex-row items-center">
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Votre message..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 bg-[#1e2429] text-white rounded-full px-4 py-2 mr-2"
          />
          <Pressable
            onPress={sendMessage}
            className="bg-green w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons name="send" size={20} color="#12171b" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatPage;
