import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ActionButtonProps {
  onPress: () => void;
  text: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  className?: string;
  textClassName?: string;
  loading?: boolean;
}

export function ActionButton({
  onPress,
  text,
  icon = "arrow-forward",
  iconSize = 20,
  className = "",
  textClassName = "",
  loading = false,
}: ActionButtonProps) {
  return (
    <View className="w-full">
      <Pressable
        onPress={onPress}
        className={`bg-primary py-4 rounded-full active:opacity-90 ${className}`}
        style={{
          shadowColor: "#FF6B4A",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View className="flex-row justify-center items-center">
          <Text
            className={`text-white font-kanit-bold text-base ${textClassName}`}
          >
            {loading ? "Chargement..." : text}
          </Text>
          {icon && !loading && (
            <Ionicons 
              name={icon} 
              size={iconSize} 
              color="white" 
              style={{ marginLeft: 8 }} 
            />
          )}
        </View>
      </Pressable>
    </View>
  );
}
