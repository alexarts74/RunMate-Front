import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { groupMessageService } from "@/service/api/groupMessage";
import { GroupMessage, GroupInfo, GroupChatData } from "@/interface/Group";
import { groupService } from "@/service/api/group";
import { LinearGradient } from "expo-linear-gradient";
import WarmBackground from "@/components/ui/WarmBackground";
import GlassCard from "@/components/ui/GlassCard";
import GlassAvatar from "@/components/ui/GlassAvatar";
import { useThemeColors, radii } from "@/constants/theme";

const GroupChatPage = () => {
  const { id } = useLocalSearchParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [groupMessages, setGroupMessages] = useState<GroupInfo | null>(null);
  const { user } = useAuth();
  const { colors, shadows, gradients } = useThemeColors();
  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const loadMessages = async () => {
    try {
      const response = await groupMessageService.getGroupMessages(
        id.toString()
      );

      if (response && Array.isArray(response.messages)) {
        const sortedMessages = [...response.messages].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        setMessages(sortedMessages);
        setGroupMessages(response.group);
      } else {
        setMessages([]);
        setGroupMessages(null);
      }
    } catch (error) {
      console.error("=== Erreur dans loadMessages ===");
      console.error("Message d'erreur:", error);
      setMessages([]);
      setGroupMessages(null);
    }
  };

  const loadGroupInfo = async () => {
    try {
      const response = await groupService.getGroupById(id.toString());
      setGroupInfo(response);
    } catch (error) {
      console.error("Erreur lors du chargement des infos du groupe:", error);
    }
  };

  useEffect(() => {
    loadMessages();
    loadGroupInfo();
  }, [id]);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const tempMessage: GroupMessage = {
          id: Date.now(),
          content: newMessage,
          created_at: new Date().toISOString(),
          sender: {
            id: user?.id || 0,
            first_name: user?.first_name || "",
            profile_image: user?.profile_image || "",
          },
        };

        setMessages((prevMessages) => {
          return [...prevMessages, tempMessage];
        });

        setNewMessage("");

        await groupMessageService.sendGroupMessage(id.toString(), newMessage);
        await loadMessages();
      } catch (error) {
        console.error("Erreur détaillée lors de l'envoi:", error);
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== Date.now())
        );
      }
    }
  };

  const renderMessage = ({ item }: { item: GroupMessage }) => {
    const isMine = item.sender.id === user?.id;

    return (
      <View
        className={`mb-3 ${isMine ? "items-end" : "items-start"}`}
        style={{ paddingHorizontal: 12 }}
      >
        {!isMine && (
          <Text
            className="text-xs mb-1 ml-3 font-nunito-medium"
            style={{ color: colors.text.tertiary }}
          >
            {item.sender.first_name}
          </Text>
        )}
        <View className="flex-row items-end" style={{ maxWidth: "80%" }}>
          {!isMine && (
            <GlassAvatar
              uri={item.sender.profile_image || undefined}
              size={32}
              style={{ marginRight: 8 }}
            />
          )}
          {isMine ? (
            <LinearGradient
              colors={gradients.primaryButton as unknown as [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                padding: 12,
                borderRadius: radii.md,
                borderBottomRightRadius: 4,
                ...shadows.sm,
              }}
            >
              <Text
                className="text-white font-nunito-medium"
                style={{ fontSize: 15 }}
              >
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
          )}
          {isMine && (
            <GlassAvatar
              uri={item.sender.profile_image || undefined}
              size={32}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <WarmBackground>
      <SafeAreaView className="flex-1" edges={['top']} style={{ flex: 1 }}>
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
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Pressable onPress={() => router.back()} className="p-2 mr-3">
                  <Ionicons name="arrow-back" size={24} color={colors.primary.DEFAULT} />
                </Pressable>
                <GlassAvatar
                  uri={groupInfo?.cover_image || undefined}
                  size={40}
                  showRing
                  style={{ marginRight: 12 }}
                />
                <Text
                  className="font-nunito-bold text-lg flex-1"
                  style={{ color: colors.text.primary }}
                >
                  {groupInfo?.name}
                </Text>
                <Pressable
                  onPress={() => setShowMembersModal(true)}
                  className="p-2 ml-2"
                >
                  <Ionicons name="people" size={24} color={colors.primary.DEFAULT} />
                </Pressable>
              </View>
            </View>
          </View>

          <View className="flex-1">
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{
                paddingVertical: 12,
                flexGrow: 1,
                justifyContent: "flex-end",
              }}
              inverted={false}
              onRefresh={loadMessages}
              refreshing={false}
              showsVerticalScrollIndicator={false}
              ref={flatListRef}
              onContentSizeChange={() => {
                if (flatListRef.current) {
                  flatListRef.current.scrollToEnd({ animated: false });
                }
              }}
              onLayout={() => {
                if (flatListRef.current) {
                  flatListRef.current.scrollToEnd({ animated: false });
                }
              }}
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

          {/* Modal des membres */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showMembersModal}
            onRequestClose={() => setShowMembersModal(false)}
          >
            <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <View
                className="h-3/4 p-6"
                style={{
                  backgroundColor: colors.elevated,
                  borderTopLeftRadius: 24,
                  borderTopRightRadius: 24,
                }}
              >
                <View className="flex-row justify-between items-center mb-6">
                  <Text
                    className="text-xl font-nunito-extrabold"
                    style={{ color: colors.text.primary }}
                  >
                    Membres ({groupInfo?.members.length})
                  </Text>
                  <Pressable onPress={() => setShowMembersModal(false)} className="p-2">
                    <Ionicons name="close" size={24} color={colors.primary.DEFAULT} />
                  </Pressable>
                </View>
                <FlatList
                  data={groupInfo?.members}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View
                      className="flex-row items-center p-4"
                      style={{ borderBottomWidth: 1, borderBottomColor: colors.glass.border }}
                    >
                      <GlassAvatar
                        uri={item.profile_image || undefined}
                        size={48}
                        showRing
                        style={{ marginRight: 12 }}
                      />
                      <View className="flex-1">
                        <Text
                          className="font-nunito-bold"
                          style={{ color: colors.text.primary }}
                        >
                          {item.name}
                        </Text>
                        {item.is_admin && (
                          <View
                            className="px-2 py-0.5 rounded-full self-start mt-1"
                            style={{ backgroundColor: colors.primary.DEFAULT }}
                          >
                            <Text className="text-white text-xs font-nunito-bold">Admin</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                />
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </WarmBackground>
  );
};

export default GroupChatPage;
