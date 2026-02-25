import { View, Text, Pressable, Switch } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "@/components/ui/GlassCard";
import { useThemeColors, palette } from "@/constants/theme";

type SettingItem = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  value: boolean;
  onToggle: () => void;
};

type SettingsSectionProps = {
  items: SettingItem[];
  description?: string;
};

export default function SettingsSection({
  items,
  description,
}: SettingsSectionProps) {
  const { colors } = useThemeColors();

  return (
    <View className="pt-4" style={{ gap: 16 }}>
      <GlassCard noPadding>
        {items.map((item, index) => (
          <Pressable
            key={item.title}
            className="flex-row items-center justify-between p-5"
            style={{
              borderBottomWidth: index !== items.length - 1 ? 1 : 0,
              borderBottomColor: colors.glass.border,
            }}
            onPress={item.onToggle}
          >
            <View className="flex-row items-center flex-1" style={{ gap: 16 }}>
              <View
                className="w-10 h-10 rounded-xl items-center justify-center"
                style={{ backgroundColor: palette.primary.subtle }}
              >
                <Ionicons name={item.icon} size={20} color={colors.primary.DEFAULT} />
              </View>
              <View className="flex-1">
                <Text style={{ color: colors.text.primary }} className="font-nunito-bold">
                  {item.title}
                </Text>
                {item.description && (
                  <Text style={{ color: colors.text.tertiary }} className="text-sm font-nunito-medium mt-1">
                    {item.description}
                  </Text>
                )}
              </View>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.onToggle}
              trackColor={{ false: colors.surface, true: colors.primary.DEFAULT }}
              thumbColor="#fff"
              ios_backgroundColor={colors.surface}
            />
          </Pressable>
        ))}
      </GlassCard>

      {description && (
        <Text style={{ color: colors.text.tertiary }} className="text-sm px-6 font-nunito-medium">
          {description}
        </Text>
      )}
    </View>
  );
}
