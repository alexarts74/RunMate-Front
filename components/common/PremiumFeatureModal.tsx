import React from "react";
import { View, Text, Modal, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

interface PremiumFeatureModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onUpgrade: () => void;
}

export const PremiumFeatureModal = ({
  visible,
  onClose,
  onUpgrade,
  title,
  description,
}: PremiumFeatureModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
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
            {/* Header avec icône premium */}
            <View className="px-6 pt-6 pb-4 bg-white">
              <View className="items-center mb-4">
                <View
                  className="w-20 h-20 rounded-full items-center justify-center mb-4"
                  style={{
                    backgroundColor: "#FF6B4A",
                    shadowColor: "#FF6B4A",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <Ionicons name="star" size={40} color="#FFFFFF" />
                </View>
                <Text className="text-2xl font-nunito-extrabold text-gray-900 text-center">
                  {title}
                </Text>
                <Text className="text-gray-600 font-nunito-medium text-sm text-center mt-2 px-2">
                  {description}
                </Text>
              </View>
            </View>

            {/* Contenu */}
            <View className="px-6 pb-6 bg-fond">
              {/* Bouton Upgrade Premium */}
              <Pressable
                onPress={onUpgrade}
                className="mb-3"
                style={{
                  shadowColor: "#FF6B4A",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <LinearGradient
                  colors={["#FF6B4A", "#FF8E75"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-4 rounded-full"
                >
                  <View className="flex-row items-center justify-center">
                    <Ionicons name="sparkles" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text className="text-white font-nunito-bold text-base">
                      Passer à Premium
                    </Text>
                  </View>
                </LinearGradient>
              </Pressable>

              {/* Bouton Fermer */}
              <Pressable
                onPress={onClose}
                className="bg-white py-3 rounded-full border-2 border-gray-200"
              >
                <Text className="text-gray-700 text-center font-nunito-bold text-base">
                  Plus tard
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
