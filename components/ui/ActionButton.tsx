import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GlassButton from "@/components/ui/GlassButton";

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
    <View style={styles.container}>
      <GlassButton
        title={loading ? "Chargement..." : text}
        onPress={onPress}
        variant="primary"
        loading={loading}
        disabled={loading}
        icon={
          icon && !loading ? (
            <Ionicons name={icon} size={iconSize} color="#FFFFFF" />
          ) : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
