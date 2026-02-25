import React from "react";
import { View, Text, Modal, Pressable } from "react-native";
import GlassCard from "@/components/ui/GlassCard";
import { useThemeColors } from "@/constants/theme";

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
  const { colors, shadows } = useThemeColors();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <View
          className="m-5 p-5 rounded-2xl w-[80%]"
          style={{
            backgroundColor: colors.elevated,
            ...shadows.lg,
          }}
        >
          <Text
            style={{ color: colors.text.primary }}
            className="font-nunito text-xl font-bold mb-6 text-center"
          >
            Sélectionner les events
          </Text>

          <Pressable
            onPress={() => onSelectEventsType("my")}
            className="py-4 mb-3 rounded-xl"
            style={{ backgroundColor: colors.glass.light, borderWidth: 1, borderColor: colors.glass.border }}
          >
            <Text style={{ color: colors.text.primary }} className="font-nunito text-lg text-center">
              Mes Events
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onSelectEventsType("all")}
            className="py-4 mb-6 rounded-xl"
            style={{ backgroundColor: colors.glass.light, borderWidth: 1, borderColor: colors.glass.border }}
          >
            <Text style={{ color: colors.text.primary }} className="font-nunito text-lg text-center">
              Tous les Events
            </Text>
          </Pressable>

          <Pressable
            onPress={onClose}
            className="py-4 rounded-xl"
            style={{ backgroundColor: colors.primary.DEFAULT }}
          >
            <Text className="text-white font-nunito text-center font-bold">
              Fermer
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
