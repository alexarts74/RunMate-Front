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
import { BlurView } from "expo-blur";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassAvatar from "@/components/ui/GlassAvatar";
import GlassCard from "@/components/ui/GlassCard";
import { useThemeColors, blur, radii, isAndroid } from "@/constants/theme";

const ChatPage = () => {
  const { id } = useLocalSearchParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { matches } = useMatches();
  const { user } = useAuth();
  const { decrementUnreadCount } = useUnreadMessages();
  const { colors, gradients, shadows, isDark } = useThemeColors();

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
        await directMessageService.sendMessage(id.toString(), newMessage);
        setNewMessage("");
        loadMessages();
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);
      }
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.sender_id === user?.id;

    return (
      <View
        className={`mb-3 ${isMine ? "items-end" : "items-start"}`}
        style={{ paddingHorizontal: 12 }}
      >
        {isMine ? (
          <LinearGradient
            colors={gradients.primaryButton as unknown as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              padding: 12,
              borderRadius: radii.md,
              borderBottomRightRadius: 4,
              maxWidth: "80%",
              ...shadows.sm,
            }}
          >
            <Text className="text-white font-nunito-medium" style={{ fontSize: 15 }}>
              {item.content}
            </Text>
            <Text className="text-white/70 text-xs font-nunito mt-1">
              {new Date(item.created_at).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </LinearGradient>
        ) : (
          <View style={{ maxWidth: "80%" }}>
            <GlassCard variant="light" noPadding>
              <View
                style={{
                  padding: 12,
                  borderRadius: radii.md,
                  borderBottomLeftRadius: 4,
                }}
              >
                <Text
                  className="font-nunito-medium"
                  style={{ fontSize: 15, color: colors.text.primary }}
                >
                  {item.content}
                </Text>
                <Text
                  className="text-xs font-nunito mt-1"
                  style={{ color: colors.text.tertiary }}
                >
                  {new Date(item.created_at).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </GlassCard>
          </View>
        )}
      </View>
    );
  };

  return (
    <WarmBackground>
      <SafeAreaView className="flex-1" edges={["top"]} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Glass Header */}
          <View
            style={{
              paddingHorizontal: 24,
              paddingTop: 8,
              paddingBottom: 16,
              backgroundColor: colors.glass.heavy,
              ...shadows.sm,
            }}
          >
            <View className="flex-row items-center">
              <Pressable onPress={() => router.back()} className="p-2 mr-3">
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colors.primary.DEFAULT}
                />
              </Pressable>
              <GlassAvatar
                uri={match?.user.profile_image}
                size={40}
                showRing
                style={{ marginRight: 12 }}
              />
              <Text
                className="font-nunito-bold text-lg flex-1"
                style={{ color: colors.text.primary }}
              >
                {match?.user.first_name} {match?.user.last_name}
              </Text>
            </View>
          </View>

          <View className="flex-1">
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingVertical: 12 }}
              showsVerticalScrollIndicator={false}
              inverted={false}
            />

            {/* Glass footer input */}
            <View
              style={{
                paddingHorizontal: 16,
                paddingBottom: 16,
                paddingTop: 12,
                backgroundColor: colors.glass.heavy,
              }}
              className="flex-row items-center"
            >
              <View
                className="flex-1 mr-3"
                style={{
                  backgroundColor: colors.glass.light,
                  borderRadius: radii.full,
                  borderWidth: 1,
                  borderColor: colors.glass.border,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <TextInput
                  value={newMessage}
                  onChangeText={setNewMessage}
                  placeholder="Votre message..."
                  placeholderTextColor={colors.text.tertiary}
                  className="font-nunito"
                  style={{ fontSize: 15, color: colors.text.primary }}
                  multiline
                  maxLength={500}
                />
              </View>
              <Pressable
                onPress={sendMessage}
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{
                  backgroundColor: colors.primary.DEFAULT,
                  ...shadows.md,
                }}
              >
                <Ionicons name="send" size={20} color="#ffffff" />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </WarmBackground>
  );
};

export default ChatPage;
