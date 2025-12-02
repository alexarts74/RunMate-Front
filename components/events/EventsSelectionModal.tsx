import React from "react";
import { View, Text, Modal, Pressable } from "react-native";

interface EventsSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectEventsType: (type: "all" | "my") => void;
}

export const EventsSelectionModal = ({
  visible,
  onClose,
  onSelectEventsType,
}: EventsSelectionModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-[#1e2429] m-5 p-5 rounded-2xl w-[80%]">
          <Text className="text-white font-nunito text-xl font-bold mb-6 text-center">
            Sélectionner les events
          </Text>

          <Pressable
            onPress={() => onSelectEventsType("my")}
            className="py-4 mb-3 bg-background rounded-xl"
          >
            <Text className="text-white font-nunito text-lg text-center">
              Mes Events
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onSelectEventsType("all")}
            className="py-4 mb-6 bg-background rounded-xl"
          >
            <Text className="text-white font-nunito text-lg text-center">
              Tous les Events
            </Text>
          </Pressable>

          <Pressable onPress={onClose} className="bg-purple py-4 rounded-xl">
            <Text className="text-white font-nunito text-center font-bold">
              Fermer
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
