import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { BlurView } from "expo-blur";
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
      <View className="flex-1 bg-black/70 items-center justify-center px-6">
        <Pressable
          className="flex-1 w-full items-center justify-center"
          onPress={onClose}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              className="rounded-2xl w-[280px] overflow-hidden"
              style={{
                backgroundColor: "rgba(40, 40, 45, 0.95)",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              {/* Header */}
              <View
                className="px-5 py-4"
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: "rgba(255, 255, 255, 0.15)",
                }}
              >
                <Text
                  className="text-xl font-bold text-center"
                  style={{ fontFamily: "Kanit", color: "#ffffff" }}
                >
                  Créer
                </Text>
              </View>

              {/* Options */}
              <View className="px-4 py-4 space-y-2">
                <Pressable
                  onPress={() => handleAction("/events/create")}
                  className="rounded-2xl overflow-hidden active:opacity-80"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderWidth: 0.5,
                    borderColor: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <View className="flex-row items-center p-3">
                    <View
                      className="w-12 h-12 rounded-xl items-center justify-center"
                      style={{
                        backgroundColor: "rgba(240, 194, 254, 0.2)",
                      }}
                    >
                      <Ionicons name="calendar" size={24} color="#126C52" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text
                        className="text-base font-semibold"
                        style={{ fontFamily: "Kanit", color: "#ffffff" }}
                      >
                        Créer un event
                      </Text>
                      <Text
                        className="text-xs opacity-70"
                        style={{ fontFamily: "Kanit", color: "#ffffff" }}
                      >
                        Organisez une course
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="rgba(255, 255, 255, 0.5)"
                    />
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => handleAction("/(app)/groups/create")}
                  className="rounded-2xl overflow-hidden active:opacity-80"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderWidth: 0.5,
                    borderColor: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <View className="flex-row items-center p-3">
                    <View
                      className="w-12 h-12 rounded-xl items-center justify-center"
                      style={{
                        backgroundColor: "rgba(240, 194, 254, 0.2)",
                      }}
                    >
                      <Ionicons name="people" size={24} color="#126C52" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text
                        className="text-base font-semibold"
                        style={{ fontFamily: "Kanit", color: "#ffffff" }}
                      >
                        Créer un groupe
                      </Text>
                      <Text
                        className="text-xs opacity-70"
                        style={{ fontFamily: "Kanit", color: "#ffffff" }}
                      >
                        Rejoignez des coureurs
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="rgba(255, 255, 255, 0.5)"
                    />
                  </View>
                </Pressable>
              </View>

              {/* Footer */}
              <View
                className="px-4 py-4"
                style={{
                  borderTopWidth: 0.5,
                  borderTopColor: "rgba(255, 255, 255, 0.15)",
                }}
              >
                <Pressable
                  onPress={onClose}
                  className="py-3 rounded-xl active:opacity-80"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Text
                    className="text-center font-semibold text-base"
                    style={{ fontFamily: "Kanit", color: "#ffffff" }}
                  >
                    Annuler
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </View>
    </Modal>
  );
}
