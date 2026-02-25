import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import GlassCard from "@/components/ui/GlassCard";
import { useThemeColors, palette } from "@/constants/theme";

interface CreateModalProps {
  visible: boolean;
  onClose: () => void;
}

export function CreateModal({ visible, onClose }: CreateModalProps) {
  const { user } = useAuth();
  const isOrganizer = user?.user_type === "organizer";
  const { colors, shadows } = useThemeColors();

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
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            className="rounded-3xl w-[320px] overflow-hidden"
            style={{
              backgroundColor: colors.elevated,
              ...shadows.lg,
            }}
          >
            {/* Header */}
            <View className="px-6 py-5" style={{ borderBottomWidth: 1, borderBottomColor: colors.glass.border }}>
              <View className="flex-row items-center justify-between">
                <Text style={{ color: colors.text.primary }} className="text-2xl font-nunito-extrabold">
                  Créer
                </Text>
                <Pressable
                  onPress={onClose}
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Ionicons name="close" size={20} color={colors.primary.DEFAULT} />
                </Pressable>
              </View>
            </View>

            {/* Options */}
            <View className="px-5 py-4" style={{ backgroundColor: colors.background }}>
              {isOrganizer ? (
                <>
              <Pressable
                onPress={() => handleAction("/(app)/events/create")}
                className="rounded-2xl mb-3 overflow-hidden"
                style={{
                  backgroundColor: colors.glass.light,
                  ...shadows.sm,
                }}
              >
                <View className="flex-row items-center p-4">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: palette.primary.subtle }}
                  >
                    <Ionicons name="calendar" size={24} color={colors.primary.DEFAULT} />
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: colors.text.primary }} className="font-nunito-bold text-base">
                      Créer un événement
                    </Text>
                    <Text style={{ color: colors.text.tertiary }} className="font-nunito-medium text-xs mt-0.5">
                      Organisez une course
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.text.tertiary}
                  />
                </View>
              </Pressable>

              <Pressable
                onPress={() => handleAction("/(app)/groups/create")}
                className="rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: colors.glass.light,
                  ...shadows.sm,
                }}
              >
                <View className="flex-row items-center p-4">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <Ionicons name="people" size={24} color={colors.text.secondary} />
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: colors.text.primary }} className="font-nunito-bold text-base">
                      Créer un groupe
                    </Text>
                    <Text style={{ color: colors.text.tertiary }} className="font-nunito-medium text-xs mt-0.5">
                      Rejoignez des coureurs
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.primary.DEFAULT}
                  />
                </View>
              </Pressable>
                </>
              ) : (
                <View className="rounded-2xl p-6" style={{ backgroundColor: colors.elevated }}>
                  <View className="items-center">
                    <View
                      className="w-16 h-16 rounded-full items-center justify-center mb-4"
                      style={{ backgroundColor: colors.surface }}
                    >
                      <Ionicons name="lock-closed" size={32} color={colors.text.secondary} />
                    </View>
                    <Text style={{ color: colors.text.primary }} className="font-nunito-bold text-lg mb-2 text-center">
                      Fonctionnalité réservée aux organisateurs
                    </Text>
                    <Text style={{ color: colors.text.secondary }} className="font-nunito-medium text-sm text-center">
                      Seuls les organisateurs peuvent créer des événements et des groupes. Créez un compte organisateur pour accéder à ces fonctionnalités.
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Footer */}
            <View className="px-5 py-4" style={{ backgroundColor: colors.elevated, borderTopWidth: 1, borderTopColor: colors.glass.border }}>
              <Pressable
                onPress={onClose}
                className="py-3 rounded-xl"
                style={{ backgroundColor: colors.surface }}
              >
                <Text style={{ color: colors.text.secondary }} className="text-center font-nunito-bold text-base">
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
