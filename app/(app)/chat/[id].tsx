import React, { useState } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { useMatches } from "@/context/MatchesContext";

type Message = {
  id: string;
  text: string;
  sender_id: string;
  timestamp: string;
};

const ChatPage = () => {
  const { id } = useLocalSearchParams();
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const { matches } = useMatches();

  const match = matches?.find((match) => match.user.id === Number(id));

  // Messages de test
  const [messages] = useState<Message[]>([
    {
      id: "1",
      text: "Salut, on court ensemble demain ?",
      sender_id: "other",
      timestamp: "10:30",
    },
    {
      id: "2",
      text: "Oui, avec plaisir !",
      sender_id: "me",
      timestamp: "10:31",
    },
  ]);

  // Mock user data - à remplacer par vos données réelles
  const chatUser = {
    name: match?.user?.name,
    profile_image: match?.user?.profile_image,
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Ici vous ajouterez la logique pour envoyer le message
      console.log("Message envoyé:", newMessage);
      setNewMessage("");
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`p-3 rounded-xl max-w-[80%] mb-2 ${
        item.sender_id === "me"
          ? "bg-green self-end"
          : "bg-[#1e2429] self-start"
      }`}
    >
      <Text
        className={`${item.sender_id === "me" ? "text-dark" : "text-white"}`}
      >
        {item.text}
      </Text>
      <Text
        className={`text-xs ${
          item.sender_id === "me" ? "text-dark" : "text-gray-400"
        }`}
      >
        {item.timestamp}
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
        <Pressable
          onPress={() => router.back()}
          className="p-2 mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="#b9f144" />
        </Pressable>

        <Image
          source={
            chatUser.profile_image
              ? { uri: chatUser.profile_image }
              : require("@/assets/images/react-logo.png")
          }
          className="w-10 h-10 rounded-full mr-3"
        />

        <Text className="text-white text-lg font-bold flex-1">
          {chatUser.name}
        </Text>
      </View>
      <View className="flex-1 pt-12">
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
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
