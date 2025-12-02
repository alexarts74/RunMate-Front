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

const GroupChatPage = () => {
  const { id } = useLocalSearchParams();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [groupMessages, setGroupMessages] = useState<GroupInfo | null>(null);
  const { user } = useAuth();
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

  const renderMessage = ({ item }: { item: GroupMessage }) => (
    <View
      className={`mb-3 ${
        item.sender.id === user?.id ? "items-end" : "items-start"
      }`}
      style={{ paddingHorizontal: 12 }}
    >
      {item.sender.id !== user?.id && (
        <Text className="text-gray-500 text-xs mb-1 ml-3 font-nunito-medium">
          {item.sender.first_name}
        </Text>
      )}
      <View className="flex-row items-end" style={{ maxWidth: "80%" }}>
        {item.sender.id !== user?.id && (
          <Image
            source={
              item.sender.profile_image
                ? { uri: item.sender.profile_image }
                : require("@/assets/images/react-logo.png")
            }
            className="w-8 h-8 rounded-full mr-2"
          />
        )}
        <View
          className={`p-3 rounded-2xl ${
            item.sender.id === user?.id
              ? "bg-primary rounded-br-md"
              : "bg-white rounded-bl-md border border-gray-200"
          }`}
          style={{
            shadowColor: item.sender.id === user?.id ? "#FF6B4A" : "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text
            className={`font-nunito-medium ${
              item.sender.id === user?.id ? "text-white" : "text-gray-900"
            }`}
            style={{ fontSize: 15 }}
          >
            {item.content}
          </Text>
          <Text
            className={`text-xs font-nunito mt-1 ${
              item.sender.id === user?.id ? "text-white/70" : "text-gray-500"
            }`}
          >
            {new Date(item.created_at).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        {item.sender.id === user?.id && (
          <Image
            source={
              item.sender.profile_image
                ? { uri: item.sender.profile_image }
                : require("@/assets/images/react-logo.png")
            }
            className="w-8 h-8 rounded-full ml-2"
          />
        )}
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
                  <Ionicons name="arrow-back" size={24} color="#FF6B4A" />
                </Pressable>
                <Image
                  source={
                    groupInfo?.cover_image
                      ? { uri: groupInfo.cover_image }
                      : require("@/assets/images/react-logo.png")
                  }
                  className="w-10 h-10 rounded-full mr-3 border-2 border-primary"
                />
                <Text className="text-gray-900 text-lg font-nunito-bold flex-1">
                  {groupInfo?.name}
                </Text>
                <Pressable
                  onPress={() => setShowMembersModal(true)}
                  className="p-2 ml-2"
                >
                  <Ionicons name="people" size={24} color="#FF6B4A" />
                </Pressable>
              </View>
            </View>
          </View>

          <View className="flex-1 bg-fond">
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

          {/* Modal des membres */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showMembersModal}
            onRequestClose={() => setShowMembersModal(false)}
          >
            <View className="flex-1 bg-black/50 justify-end">
              <View className="bg-white rounded-t-3xl h-3/4 p-6">
                <View className="flex-row justify-between items-center mb-6">
                  <Text className="text-gray-900 text-xl font-nunito-extrabold">
                    Membres ({groupInfo?.members.length})
                  </Text>
                  <Pressable onPress={() => setShowMembersModal(false)} className="p-2">
                    <Ionicons name="close" size={24} color="#FF6B4A" />
                  </Pressable>
                </View>
                <FlatList
                  data={groupInfo?.members}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <View className="flex-row items-center p-4 border-b border-gray-100">
                      <Image
                        source={
                          item.profile_image
                            ? { uri: item.profile_image }
                            : require("@/assets/images/react-logo.png")
                        }
                        className="w-12 h-12 rounded-full mr-3 border-2 border-primary"
                      />
                      <View className="flex-1">
                        <Text className="text-gray-900 font-nunito-bold">{item.name}</Text>
                        {item.is_admin && (
                          <View className="bg-primary px-2 py-0.5 rounded-full self-start mt-1">
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
    </View>
  );
};

export default GroupChatPage;
