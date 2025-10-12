import React from "react";
import { View, Text, Modal, Pressable, StyleSheet } from "react-native";
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
      <View
        className="flex-1 justify-center items-center"
        style={styles.modalContainer}
      >
        <View className="bg-[#1e2429] rounded-2xl p-6 w-full max-w-sm border border-purple/30">
          <View className="items-center mb-4">
            <Ionicons name="star" size={48} color="#f0c2fe" />
            <Text className="text-white text-xl font-bold mt-2 font-kanit">
              {title}
            </Text>
            <Text className="text-gray-400 text-center mt-2 font-kanit">
              {description}
            </Text>
          </View>

          <Pressable
            onPress={onClose}
            className="py-3 mt-3 rounded-xl border border-gray-600"
          >
            <Text className="text-white text-center font-bold font-kanit">
              Fermer
            </Text>
          </Pressable>
          <Pressable
            onPress={onUpgrade}
            className="py-3 mt-3 rounded-xl border border-gray-600"
          >
            <Text className="text-white text-center font-bold font-kanit">
              Upgrade
            </Text>
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
