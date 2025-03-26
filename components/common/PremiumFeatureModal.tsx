import React from "react";
import { View, Text, Modal, Pressable, Image, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

interface PremiumFeatureModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

export const PremiumFeatureModal = ({
  visible,
  onClose,
  title,
  description,
}: PremiumFeatureModalProps) => {
  const router = useRouter();

  const handleRedirectToMatch = () => {
    // Fermer le modal puis rediriger
    onClose();
    router.push("/(tabs)/matches");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-center items-center"
        style={styles.modalContainer}
      >
        <View className="bg-[#1e2429] rounded-2xl p-6 w-full max-w-sm border border-purple/30">
          <View className="items-center mb-4">
            <Ionicons name="star" size={48} color="#8101f7" />
            <Text className="text-white text-xl font-bold mt-2">{title}</Text>
            <Text className="text-gray-400 text-center mt-2">
              {description}
            </Text>
          </View>

          <Pressable
            onPress={handleRedirectToMatch}
            className="bg-purple py-3 rounded-xl mt-4"
          >
            <Text className="text-white text-center font-bold">
              Découvrir les matchs disponibles
            </Text>
          </Pressable>

          <Pressable
            onPress={onClose}
            className="py-3 mt-3 rounded-xl border border-gray-600"
          >
            <Text className="text-white text-center font-bold">Fermer</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(5px)",
    padding: 16,
  },
});
