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
import { useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { groupMessageService } from "@/service/api/groupMessage";
import { GroupMessage, GroupInfo, GroupChatData } from "@/interface/Group";
import { groupService } from "@/service/api/group";

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
    <View className="flex-row items-end mb-2">
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
        className={`rounded-xl max-w-[75%] ${
          item.sender.id === user?.id
            ? "self-end bg-purple ml-auto"
            : "bg-gray-50"
        }`}
      >
        {item.sender.id !== user?.id && (
          <Text className="text-gray-500 text-xs ml-3 mt-1">
            {item.sender.first_name}
          </Text>
        )}
        <View className="p-3">
          <Text
            className={`${
              item.sender.id === user?.id ? "text-white" : "text-gray-900"
            }`}
          >
            {item.content}
          </Text>
          <Text
            className={`text-xs mt-1 ${
              item.sender.id === user?.id ? "text-white/80" : "text-gray-500"
            }`}
          >
            {new Date(item.created_at).toLocaleTimeString()}
          </Text>
        </View>
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
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      {/* Header */}
      <View className="flex-row items-center px-4 pt-14 pb-4 bg-white border-b border-gray-200">
        <Pressable onPress={() => router.back()} className="p-2 mr-3">
          <Ionicons name="arrow-back" size={24} color="#0a7ea4" />
        </Pressable>

        <View className="flex-row items-center flex-1">
          <Image
            source={
              groupInfo?.cover_image
                ? { uri: groupInfo.cover_image }
                : require("@/assets/images/react-logo.png")
            }
            className="w-10 h-10 rounded-full mr-2"
          />
          <Text className="text-gray-900 text-lg font-bold flex-1">
            {groupInfo?.name}
          </Text>
          <Pressable
            onPress={() => setShowMembersModal(true)}
            className="flex-row items-center"
          >
            <Ionicons name="people" size={24} color="#0a7ea4" />
          </Pressable>
        </View>
      </View>

      <View className="flex-1 pt-4 bg-white">
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            padding: 12,
            flexGrow: 1,
            justifyContent: "flex-end",
          }}
          inverted={false}
          onRefresh={loadMessages}
          refreshing={false}
          showsVerticalScrollIndicator={true}
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
        <View className="p-4 border-t border-gray-200 flex-row items-center bg-white">
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Votre message..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 bg-gray-50 text-gray-900 rounded-full px-4 py-2 mr-2"
          />
          <Pressable
            onPress={sendMessage}
            className="bg-purple w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons name="send" size={20} color="white" />
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
          <View className="bg-white rounded-t-3xl h-3/4 p-4">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-gray-900 text-xl font-bold">
                Membres ({groupInfo?.members.length})
              </Text>
              <Pressable onPress={() => setShowMembersModal(false)}>
                <Ionicons name="close" size={24} color="#0a7ea4" />
              </Pressable>
            </View>
            <FlatList
              data={groupInfo?.members}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View className="flex-row items-center p-4 border-b border-gray-200">
                  <Image
                    source={
                      item.profile_image
                        ? { uri: item.profile_image }
                        : require("@/assets/images/react-logo.png")
                    }
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <View className="flex-1">
                    <Text className="text-gray-900 font-bold">{item.name}</Text>
                    {item.is_admin && (
                      <Text className="text-purple text-sm">Admin</Text>
                    )}
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default GroupChatPage;
