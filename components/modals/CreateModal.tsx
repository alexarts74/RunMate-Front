import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { useAuth } from "@/context/AuthContext";

const ACCENT = "#F97316";

interface CreateModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateModal({ visible, onClose }: CreateModalProps) {
  const { user } = useAuth();
  const isOrganizer = user?.user_type === "organizer";

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
          <View
            className="rounded-3xl w-[320px] bg-white overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 10,
            }}
          >
            {/* Header */}
            <View className="px-6 py-5 bg-white border-b border-gray-100">
              <View className="flex-row items-center justify-between">
                <Text className="text-2xl font-nunito-extrabold text-gray-900">
                  Créer
                </Text>
                <Pressable
                  onPress={onClose}
                  className="w-8 h-8 rounded-full bg-tertiary items-center justify-center"
                >
                  <Ionicons name="close" size={20} color={ACCENT} />
                </Pressable>
              </View>
            </View>

            {/* Options */}
            <View className="px-5 py-4 bg-fond">
              {isOrganizer ? (
                <>
              <Pressable
                onPress={() => handleAction("/(app)/events/create")}
                className="bg-white rounded-2xl mb-3 overflow-hidden"
                style={{
                  shadowColor: ACCENT,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View className="flex-row items-center p-4">
                  <View className="w-12 h-12 rounded-xl bg-tertiary items-center justify-center mr-4">
                    <Ionicons name="calendar" size={24} color={ACCENT} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-nunito-bold text-base">
                      Créer un événement
                    </Text>
                    <Text className="text-gray-500 font-nunito-medium text-xs mt-0.5">
                      Organisez une course
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#525252"
                  />
                </View>
              </Pressable>

              <Pressable
                onPress={() => handleAction("/(app)/groups/create")}
                className="bg-white rounded-2xl overflow-hidden"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View className="flex-row items-center p-4">
                  <View className="w-12 h-12 rounded-xl bg-tertiary items-center justify-center mr-4">
                    <Ionicons name="people" size={24} color="#525252" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-900 font-nunito-bold text-base">
                      Créer un groupe
                    </Text>
                    <Text className="text-gray-500 font-nunito-medium text-xs mt-0.5">
                      Rejoignez des coureurs
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={ACCENT}
                  />
                </View>
              </Pressable>
                </>
              ) : (
                <View className="bg-white rounded-2xl p-6">
                  <View className="items-center">
                    <View className="w-16 h-16 rounded-full bg-tertiary items-center justify-center mb-4">
                      <Ionicons name="lock-closed" size={32} color="#525252" />
                    </View>
                    <Text className="text-gray-900 font-nunito-bold text-lg mb-2 text-center">
                      Fonctionnalité réservée aux organisateurs
                    </Text>
                    <Text className="text-gray-600 font-nunito-medium text-sm text-center">
                      Seuls les organisateurs peuvent créer des événements et des groupes. Créez un compte organisateur pour accéder à ces fonctionnalités.
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Footer */}
            <View className="px-5 py-4 bg-white border-t border-gray-100">
              <Pressable
                onPress={onClose}
                className="py-3 rounded-xl bg-gray-100"
              >
                <Text className="text-center text-gray-700 font-nunito-bold text-base">
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
