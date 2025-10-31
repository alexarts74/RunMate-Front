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
import { directMessageService } from "@/service/api/message";
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
      const response = await directMessageService.getConversation(
        id.toString()
      );
      setMessages(response);
    } catch (error) {
      console.error("Erreur lors du chargement des messages:", error);
    }
  };

  useEffect(() => {
    const initChat = async () => {
      try {
        const response = await directMessageService.getConversation(
          id.toString()
        );
        setMessages(response);

        const unreadMessages = response.filter(
          (msg: Message) => !msg.read && msg.sender_id !== user?.id
        );

        if (unreadMessages.length > 0) {
          await Promise.all(
            unreadMessages.map((msg: Message) =>
              directMessageService.markAsRead(msg.id.toString())
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
        const messageResponse = await directMessageService.sendMessage(
          id.toString(),
          newMessage
        );
        // On ne réenregistre pas le token à chaque message, il est déjà géré par le NotificationContext
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
          ? "bg-purple self-end"
          : "bg-[#1e2429] self-start"
      }`}
    >
      <Text
        className={`mb-2 font-kanit ${
          item.sender_id === user?.id ? "text-white" : "text-white"
        }`}
      >
        {item.content}
      </Text>
      <Text
        className={`text-xs font-kanit ${
          item.sender_id === user?.id ? "text-gray-200" : "text-gray-400"
        }`}
      >
        {new Date(item.created_at).toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-fond"
    >
      {/* Header */}
      <View className="flex-row items-center px-6 pt-4 pb-4 bg-white border-b border-gray-200">
        <Pressable onPress={() => router.back()} className="p-2 mr-3">
          <Ionicons name="arrow-back" size={24} color="#FF6B4A" />
        </Pressable>

        <Image
          source={
            match?.user.profile_image
              ? { uri: match.user.profile_image }
              : require("@/assets/images/react-logo.png")
          }
          className="w-10 h-10 rounded-full mr-3 border-2 border-primary"
        />

        <Text className="text-gray-900 font-kanit-bold text-lg flex-1">
          {match?.user.first_name} {match?.user.last_name}
        </Text>
      </View>
      <View className="flex-1 pt-4 bg-fond">
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 12 }}
        />
        <View className="p-4 border-t border-gray-200 bg-white flex-row items-center">
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Votre message..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 bg-tertiary text-gray-900 rounded-full px-4 py-2 mr-2 font-kanit"
          />
          <Pressable
            onPress={sendMessage}
            className="bg-primary w-12 h-12 rounded-full items-center justify-center"
            style={{
              shadowColor: "#FF6B4A",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="send" size={20} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatPage;
