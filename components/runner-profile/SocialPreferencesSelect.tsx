import React from "react";
import { View, Text, Pressable } from "react-native";
import { useThemeColors } from "@/constants/theme";

const socialOptions = [
  { key: "solo", value: "Course en solo" },
  { key: "groupe", value: "Course en groupe" },
  { key: "club", value: "Club de course" },
  { key: "evenements", value: "Événements sociaux" },
  { key: "coaching", value: "Coaching personnalisé" },
];

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

export function SocialPreferencesSelect({ value, onChange }: Props) {
  const { colors } = useThemeColors();

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((o) => o !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <View>
      <Text style={{ color: colors.text.primary }} className="text-sm font-semibold pl-2 mb-2">
        Préférences sociales
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {socialOptions.map((option) => (
          <Pressable
            key={option.key}
            onPress={() => toggleOption(option.key)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 9999,
              borderWidth: 1,
              backgroundColor: value.includes(option.key)
                ? colors.primary.subtle
                : colors.glass.light,
              borderColor: value.includes(option.key)
                ? colors.primary.DEFAULT
                : colors.glass.border,
            }}
          >
            <Text
              style={{
                color: value.includes(option.key)
                  ? colors.primary.dark
                  : colors.text.secondary,
              }}
            >
              {option.value}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
