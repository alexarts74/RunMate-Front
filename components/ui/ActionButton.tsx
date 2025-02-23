import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ActionButtonProps {
  onPress: () => void;
  text: string;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  className?: string;
  textClassName?: string;
  loading?: boolean;
}

export function ActionButton({
  onPress,
  text,
  disabled = false,
  icon = "arrow-forward",
  iconSize = 20,
  className = "",
  textClassName = "",
  loading = false,
}: ActionButtonProps) {
  return (
    <View className="w-[80%] mx-auto">
      <Pressable
        onPress={onPress}
        className={`bg-green py-3 rounded-full active:opacity-90 ${className}`}
        disabled={disabled}
        style={disabled ? { opacity: 0.5 } : {}}
      >
        <View className="flex-row justify-center items-center space-x-2">
          <Text className={`text-[#12171b] font-bold text-lg ${textClassName}`}>
            {loading ? "Chargement..." : text}
          </Text>
          {icon && <Ionicons name={icon} size={iconSize} color="#12171b" />}
        </View>
      </Pressable>
    </View>
  );
}
