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
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useMatches } from "@/context/MatchesContext";
import { directMessageService } from "@/service/api/message";
import { useAuth } from "@/context/AuthContext";
import { Message } from "@/interface/Conversation";
import { useUnreadMessages } from "@/context/UnreadMessagesContext";
import { LinearGradient } from "expo-linear-gradient";

const ACCENT = "#F97316";

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
      className={`mb-3 ${
        item.sender_id === user?.id ? "items-end" : "items-start"
      }`}
      style={{ paddingHorizontal: 12 }}
    >
      <View
        className={`p-3 rounded-2xl max-w-[80%] ${
          item.sender_id === user?.id
            ? "bg-primary rounded-br-md"
            : "bg-white rounded-bl-md border border-gray-200"
        }`}
        style={{
          shadowColor: item.sender_id === user?.id ? ACCENT : "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text
          className={`font-nunito-medium ${
            item.sender_id === user?.id ? "text-white" : "text-gray-900"
          }`}
          style={{ fontSize: 15 }}
        >
          {item.content}
        </Text>
        <Text
          className={`text-xs font-nunito mt-1 ${
            item.sender_id === user?.id ? "text-white/70" : "text-gray-500"
          }`}
        >
          {new Date(item.created_at).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-fond">
      <SafeAreaView className="flex-1" edges={['top']} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Header */}
          <View className="px-6 pt-2 pb-4 bg-fond border-b border-gray-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Pressable onPress={() => router.back()} className="p-2 mr-3">
                  <Ionicons name="arrow-back" size={24} color={ACCENT} />
                </Pressable>
                <Image
                  source={
                    match?.user.profile_image
                      ? { uri: match.user.profile_image }
                      : require("@/assets/images/react-logo.png")
                  }
                  className="w-10 h-10 rounded-full mr-3 border-2 border-primary"
                />
                <Text className="text-gray-900 font-nunito-bold text-lg flex-1">
                  {match?.user.first_name} {match?.user.last_name}
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-1 bg-fond">
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingVertical: 12 }}
              showsVerticalScrollIndicator={false}
              inverted={false}
            />
            
            <View className="px-4 pb-4 pt-3 bg-fond flex-row items-center">
              <View className="flex-1 bg-white rounded-full border border-gray-200 px-4 py-2 mr-3">
                <TextInput
                  value={newMessage}
                  onChangeText={setNewMessage}
                  placeholder="Votre message..."
                  placeholderTextColor="#9CA3AF"
                  className="text-gray-900 font-nunito"
                  style={{ fontSize: 15 }}
                  multiline
                  maxLength={500}
                />
              </View>
              <Pressable
                onPress={sendMessage}
                className="bg-primary w-12 h-12 rounded-full items-center justify-center"
                style={{
                  shadowColor: ACCENT,
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
      </SafeAreaView>
    </View>
  );
};

export default ChatPage;
