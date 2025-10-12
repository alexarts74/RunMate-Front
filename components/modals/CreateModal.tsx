import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";

interface CreateModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateModal({ visible, onClose }: CreateModalProps) {
  const handleAction = (route: string) => {
    onClose();
    router.push(route as any);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 items-center justify-center px-6"
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="bg-background rounded-3xl w-[320px] shadow-lg">
            {/* Header */}
            <View className="p-6 border-b border-gray-700">
              <Text className="text-white text-2xl font-bold text-center">
                Créer
              </Text>
            </View>

            {/* Options */}
            <View className="p-6 space-y-4">
              <Pressable
                onPress={() => handleAction("/events/create")}
                className="bg-background rounded-2xl overflow-hidden active:opacity-90"
              >
                <View className="flex-row items-center p-4">
                  <View className="w-12 h-12 bg-background/50 rounded-full items-center justify-center">
                    <Ionicons name="calendar" size={24} color="#f0c2fe" />
                  </View>
                  <View className="ml-4 flex-1">
                    <Text className="text-white text-lg font-semibold mb-1">
                      Créer un événement
                    </Text>
                  </View>
                </View>
              </Pressable>

              <Pressable
                onPress={() => handleAction("/(app)/groups/create")}
                className="bg-background rounded-2xl overflow-hidden active:opacity-90"
              >
                <View className="flex-row items-center p-4">
                  <View className="w-12 h-12 bg-background/50 rounded-full items-center justify-center">
                    <Ionicons name="people" size={24} color="#f0c2fe" />
                  </View>
                  <View className="ml-4 flex-1">
                    <Text className="text-white text-lg font-semibold mb-1">
                      Créer un groupe
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>

            {/* Footer */}
            <View className="p-6 border-t border-gray-700">
              <Pressable
                onPress={onClose}
                className="bg-background py-4 rounded-2xl active:opacity-90"
              >
                <Text className="text-white text-center font-semibold text-lg">
                  Annuler
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
