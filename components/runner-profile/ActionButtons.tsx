import React from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useThemeColors, spacing } from "@/constants/theme";
import GlassButton from "@/components/ui/GlassButton";

type Props = {
  loading: boolean;
  handleSubmit: () => Promise<void>;
};

export function ActionButtons({ loading, handleSubmit }: Props) {
  const { colors } = useThemeColors();

  return (
    <View style={styles.container}>
      <GlassButton
        title="Sauvegarder mon profil"
        onPress={handleSubmit}
        variant="primary"
        loading={loading}
        disabled={loading}
        size="sm"
      />
      <GlassButton
        title="Passer cette etape"
        onPress={() => router.replace("/(tabs)/matches")}
        variant="secondary"
        size="sm"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
});
